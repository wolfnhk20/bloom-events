package com.smartevent.service;

import com.smartevent.model.Package;
import com.smartevent.model.Service;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Component
@Slf4j
public class CostCalculationService {
    @Value("${app.catering.price-per-guest:500}")
    private BigDecimal cateringPricePerGuest;

    public BigDecimal calculateTotalCost(
            Package selectedPackage,
            List<Service> services,
            Integer guestCount) {

        BigDecimal total = BigDecimal.ZERO;

        // 1. Package base price
        if (selectedPackage != null) {
            total = total.add(selectedPackage.getBasePrice());
        }

        // 2. Services cost
        if (services != null && !services.isEmpty()) {
            BigDecimal servicesCost = services.stream()
                    .map(Service::getPrice)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            total = total.add(servicesCost);
        }

        // 3. Catering cost (per guest)
        if (guestCount != null && guestCount > 0) {
            BigDecimal cateringCost = cateringPricePerGuest.multiply(BigDecimal.valueOf(guestCount));
            total = total.add(cateringCost);
        }

        log.info("Calculated total cost: {} for {} guests", total, guestCount);
        return total;
    }

    public BigDecimal getCateringPricePerGuest() {
        return cateringPricePerGuest;
    }

    public String getRecommendationReason(Package pkg, Integer guestCount) {
        if (guestCount <= 30) {
            return String.format(
                "The %s package is ideal for your intimate gathering of %d guests, offering great value.",
                pkg.getName(), guestCount);
        } else if (guestCount <= 75) {
            return String.format(
                "The %s package perfectly accommodates your %d guests with a great balance of features.",
                pkg.getName(), guestCount);
        } else {
            return String.format(
                "With %d guests, the %s package provides the full luxury experience your celebration deserves.",
                guestCount, pkg.getName());
        }
    }
}
