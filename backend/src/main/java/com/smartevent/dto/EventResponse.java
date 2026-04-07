package com.smartevent.dto;

import com.smartevent.model.Event;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventResponse {
    private UUID id;
    private String eventName;
    private Event.EventType eventType;
    private LocalDate eventDate;
    private LocalTime eventTime;
    private String venueName;
    private String venueAddress;
    private Integer guestCount;
    private BigDecimal cateringPerGuest;
    private BigDecimal totalCost;
    private Event.Status status;
    private String specialNotes;
    private PackageResponse selectedPackage;
    private List<ServiceResponse> services;
    private List<GuestResponse> guests;
    private OffsetDateTime createdAt;
    private String recommendedPackage;
}
