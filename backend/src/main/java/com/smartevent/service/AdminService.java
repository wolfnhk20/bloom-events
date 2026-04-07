package com.smartevent.service;

import com.smartevent.model.Event;
import com.smartevent.model.User;
import com.smartevent.repository.EventRepository;
import com.smartevent.repository.GuestRepository;
import com.smartevent.repository.UserRepository;
import com.smartevent.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final GuestRepository guestRepository;

    public Map<String, Object> getStats() {
        long totalEvents = eventRepository.countAllEvents();
        long totalUsers = userRepository.countAllUsers();
        long pendingEvents = eventRepository.countByStatus(Event.Status.PENDING);
        long confirmedEvents = eventRepository.countByStatus(Event.Status.CONFIRMED);
        BigDecimal totalRevenue = eventRepository.sumTotalRevenue();
        Long totalGuests = guestRepository.countAllGuests();

        List<Map<String, Object>> eventTypeBreakdown = eventRepository.countByEventType()
                .stream()
                .map(row -> Map.<String, Object>of("type", row[0].toString(), "count", row[1]))
                .collect(Collectors.toList());

        List<Map<String, Object>> revenueByMonth = eventRepository.getRevenueByMonth()
                .stream()
                .map(row -> Map.<String, Object>of("month", row[0].toString(), "revenue", row[1]))
                .collect(Collectors.toList());

        return Map.of(
                "totalEvents", totalEvents,
                "totalUsers", totalUsers,
                "pendingEvents", pendingEvents,
                "confirmedEvents", confirmedEvents,
                "totalRevenue", totalRevenue != null ? totalRevenue : BigDecimal.ZERO,
                "totalGuests", totalGuests != null ? totalGuests : 0L,
                "eventTypeBreakdown", eventTypeBreakdown,
                "revenueByMonth", revenueByMonth
        );
    }

    public List<Event> getAllEvents(String status, int page, int size) {
        if (status != null && !status.isBlank()) {
            return eventRepository.findByUserIdAndStatus(null, Event.Status.valueOf(status));
        }
        return eventRepository.findAll(PageRequest.of(page, size)).getContent();
    }

    @Transactional
    public Event updateEventStatus(UUID id, String status) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
        event.setStatus(Event.Status.valueOf(status));
        return eventRepository.save(event);
    }

    @Transactional
    public void deleteEvent(UUID id) {
        if (!eventRepository.existsById(id)) throw new ResourceNotFoundException("Event not found");
        eventRepository.deleteById(id);
    }

    public List<User> getAllUsers(int page, int size) {
        return userRepository.findAll(PageRequest.of(page, size)).getContent();
    }
}