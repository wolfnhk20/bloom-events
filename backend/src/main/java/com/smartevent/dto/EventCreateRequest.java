package com.smartevent.dto;

import com.smartevent.model.Event;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventCreateRequest {
    @NotBlank(message = "Event name is required")
    private String eventName;

    @NotNull(message = "Event type is required")
    private Event.EventType eventType;

    @NotNull(message = "Event date is required")
    @Future(message = "Event date must be in the future")
    private LocalDate eventDate;

    @NotNull(message = "Event time is required")
    private LocalTime eventTime;

    private String venueName;
    private String venueAddress;

    @Min(value = 1, message = "Guest count must be at least 1")
    @Max(value = 500, message = "Guest count cannot exceed 500")
    private Integer guestCount;

    private UUID packageId;
    private List<UUID> serviceIds;
    private String specialNotes;
}
