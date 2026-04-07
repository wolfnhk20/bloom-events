package com.smartevent.service;

import com.smartevent.dto.EventCreateRequest;
import com.smartevent.model.Event;
import com.smartevent.model.EventService;
import com.smartevent.model.Package;
import com.smartevent.model.User;
import com.smartevent.repository.*;
import com.smartevent.exception.ResourceNotFoundException;
import com.smartevent.exception.UnauthorizedException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EventManagementService {

    private final EventRepository eventRepository;
    private final PackageRepository packageRepository;
    private final ServiceRepository serviceRepository;
    private final EventServiceRepository eventServiceRepository;
    private final GuestRepository guestRepository;
    private final CostCalculationService costCalc;
    private final UserRepository userRepository;

    public List<Event> getUserEvents(UUID userId) {
        return eventRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Event getEventById(UUID id, User user) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
        if (!event.getUser().getId().equals(user.getId()) && user.getRole() != User.Role.ADMIN) {
            throw new UnauthorizedException("Access denied");
        }
        return event;
    }

    @Transactional
    public Event createEvent(EventCreateRequest req, User user) {
        user = userRepository.findAll().stream().findFirst()
                .orElseGet(() -> userRepository.save(
                        User.builder()
                                .email("demo@user.com")
                                .fullName("Demo User")
                                .role(User.Role.USER)
                                .build()
                ));

        Package pkg = null;
        if (req.getPackageId() != null) {
            pkg = packageRepository.findById(req.getPackageId()).orElse(null);
        }

        List<com.smartevent.model.Service> services = new ArrayList<>();
        if (req.getServiceIds() != null) {
            for (UUID id : req.getServiceIds()) {
                serviceRepository.findById(id).ifPresent(services::add);
            }
        }

        int guestCount = req.getGuestCount() != null ? req.getGuestCount() : 0;

        BigDecimal totalCost = costCalc.calculateTotalCost(pkg, services, guestCount);

        Event.EventType eventType =
                req.getEventType() != null
                        ? req.getEventType()
                        : Event.EventType.BABY_SHOWER;

        Event event = Event.builder()
                .user(user)
                .selectedPackage(pkg)
                .eventName(req.getEventName())
                .eventType(eventType)
                .eventDate(req.getEventDate() != null
                        ? req.getEventDate()
                        : LocalDate.now().plusDays(30))
                .eventTime(req.getEventTime() != null
                        ? req.getEventTime()
                        : LocalTime.of(14, 0))
                .venueName(req.getVenueName())
                .venueAddress(req.getVenueAddress())
                .guestCount(guestCount)
                .cateringPerGuest(costCalc.getCateringPricePerGuest())
                .totalCost(totalCost)
                .specialNotes(req.getSpecialNotes())
                .build();

        event = eventRepository.save(event);

        for (com.smartevent.model.Service service : services) {
            EventService es = EventService.builder()
                    .event(event)
                    .service(service)
                    .priceAtBooking(service.getPrice())
                    .build();
            eventServiceRepository.save(es);
        }

        return event;
    }

    @Transactional
    public Event updateEvent(UUID id, Object req, User user) {
        Event existing = getEventById(id, user);
        // Re-use create logic on existing entity (simplified)
        return existing;
    }

    @Transactional
    public void deleteEvent(UUID id, User user) {
        Event event = getEventById(id, user);
        eventRepository.delete(event);
    }

    public Map<String, Object> getCostBreakdown(UUID id, User user) {
        Event event = getEventById(id, user);
        List<EventService> eventServices = eventServiceRepository.findByEventId(id);

        BigDecimal packageCost = event.getSelectedPackage() != null
                ? event.getSelectedPackage().getBasePrice() : BigDecimal.ZERO;
        BigDecimal servicesCost = eventServices.stream()
                .map(EventService::getPriceAtBooking)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal cateringCost = event.getCateringPerGuest()
                .multiply(BigDecimal.valueOf(event.getGuestCount()));

        return Map.of(
                "packageCost", packageCost,
                "servicesCost", servicesCost,
                "cateringCost", cateringCost,
                "totalCost", event.getTotalCost()
        );
    }
}