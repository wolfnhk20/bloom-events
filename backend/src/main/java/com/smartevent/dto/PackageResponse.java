package com.smartevent.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PackageResponse {
    private UUID id;
    private String name;
    private String description;
    private BigDecimal basePrice;
    private Integer maxGuests;
    private List<String> features;
    private Boolean isPopular;
}

