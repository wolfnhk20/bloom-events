package com.smartevent.dto;

import com.smartevent.model.Guest;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GuestResponse {
    private UUID id;
    private String name;
    private String email;
    private String phone;
    private String dietaryPreference;
    private Guest.RsvpStatus rsvpStatus;
}
