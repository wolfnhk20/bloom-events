package com.smartevent.controller;

import com.smartevent.model.Guest;
import com.smartevent.model.User;
import com.smartevent.service.GuestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/events/{eventId}/guests")
@RequiredArgsConstructor
public class GuestController {

    private final GuestService guestService;

    @GetMapping
    public ResponseEntity<List<Guest>> getGuests(
            @PathVariable UUID eventId,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(guestService.getGuests(eventId, user));
    }

    @PostMapping
    public ResponseEntity<Guest> addGuest(
            @PathVariable UUID eventId,
            @RequestBody Guest guest,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(guestService.addGuest(eventId, guest, user));
    }

    @PostMapping("/bulk")
    public ResponseEntity<List<Guest>> addGuestsBulk(
            @PathVariable UUID eventId,
            @RequestBody List<Guest> guests,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(guestService.addGuestsBulk(eventId, guests, user));
    }

    @DeleteMapping("/{guestId}")
    public ResponseEntity<Void> removeGuest(
            @PathVariable UUID eventId,
            @PathVariable UUID guestId,
            @AuthenticationPrincipal User user) {
        guestService.removeGuest(eventId, guestId, user);
        return ResponseEntity.noContent().build();
    }
}