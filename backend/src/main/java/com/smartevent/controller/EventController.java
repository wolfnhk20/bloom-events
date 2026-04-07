package com.smartevent.controller;

import com.smartevent.model.Event;
import com.smartevent.model.User;
import com.smartevent.service.EventManagementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import com.smartevent.dto.EventCreateRequest;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventManagementService eventService;

    @GetMapping
    public ResponseEntity<List<Event>> getMyEvents(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(eventService.getUserEvents(user.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Event> getEvent(@PathVariable UUID id, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(eventService.getEventById(id, user));
    }

    @PostMapping
    public ResponseEntity<Event> createEvent(
            @RequestBody EventCreateRequest req,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(eventService.createEvent(req, user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Event> updateEvent(
            @PathVariable UUID id,
            @RequestBody EventCreateRequest req,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(eventService.updateEvent(id, req, user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable UUID id, @AuthenticationPrincipal User user) {
        eventService.deleteEvent(id, user);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/cost")
    public ResponseEntity<Map<String, Object>> calculateCost(
            @PathVariable UUID id,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(eventService.getCostBreakdown(id, user));
    }
}