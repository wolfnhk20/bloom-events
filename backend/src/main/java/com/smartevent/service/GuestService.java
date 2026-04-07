package com.smartevent.service;

import com.smartevent.model.Event;
import com.smartevent.model.Guest;
import com.smartevent.model.User;
import com.smartevent.repository.EventRepository;
import com.smartevent.repository.GuestRepository;
import com.smartevent.exception.ResourceNotFoundException;
import com.smartevent.exception.UnauthorizedException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GuestService {

    private final GuestRepository guestRepository;
    private final EventRepository eventRepository;

    private Event verifyAccess(UUID eventId, User user) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
        if (!event.getUser().getId().equals(user.getId()) && user.getRole() != User.Role.ADMIN) {
            throw new UnauthorizedException("Access denied");
        }
        return event;
    }

    public List<Guest> getGuests(UUID eventId, User user) {
        verifyAccess(eventId, user);
        return guestRepository.findByEventId(eventId);
    }

    @Transactional
    public Guest addGuest(UUID eventId, Guest guestData, User user) {
        Event event = verifyAccess(eventId, user);
        guestData.setEvent(event);
        return guestRepository.save(guestData);
    }

    @Transactional
    public List<Guest> addGuestsBulk(UUID eventId, List<Guest> guestList, User user) {
        Event event = verifyAccess(eventId, user);
        return guestList.stream()
                .map(g -> { g.setEvent(event); return guestRepository.save(g); })
                .collect(Collectors.toList());
    }

    @Transactional
    public void removeGuest(UUID eventId, UUID guestId, User user) {
        verifyAccess(eventId, user);
        if (!guestRepository.existsById(guestId)) throw new ResourceNotFoundException("Guest not found");
        guestRepository.deleteById(guestId);
    }
}
