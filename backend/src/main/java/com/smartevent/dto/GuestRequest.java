package com.smartevent.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GuestRequest {
    @NotBlank(message = "Guest name is required")
    private String name;
    private String email;
    private String phone;
    private String dietaryPreference;
}
