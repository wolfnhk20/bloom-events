package com.smartevent.service;

import com.smartevent.repository.PackageRepository;
import com.smartevent.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import com.smartevent.model.Package;

@Service
@RequiredArgsConstructor
public class PackageService {

    private final PackageRepository packageRepository;
    private final CostCalculationService costCalc;

    public List<Package> getAllPackages() {
        return packageRepository.findAllByOrderByBasePriceAsc();
    }

    public com.smartevent.model.Package getPackageById(UUID id) {
        return packageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Package not found: " + id));
    }

    public Map<String, Object> recommend(Integer guestCount) {
        List<com.smartevent.model.Package> suitable = packageRepository.findSuitablePackages(guestCount);
        if (suitable.isEmpty()) suitable = packageRepository.findAllByOrderByBasePriceAsc();
        com.smartevent.model.Package recommended = suitable.get(0);
        BigDecimal estimate = costCalc.calculateTotalCost(recommended, List.of(), guestCount);
        return Map.of(
                "packageId", recommended.getId(),
                "packageName", recommended.getName(),
                "reason", costCalc.getRecommendationReason(recommended, guestCount),
                "estimatedTotal", estimate
        );
    }

    @Transactional
    public Package create(Package pkg) {
        return packageRepository.save(pkg);
    }

    @Transactional
    public Package update(UUID id, Package updated) {
        Package existing = getPackageById(id);
        existing.setName(updated.getName());
        existing.setDescription(updated.getDescription());
        existing.setBasePrice(updated.getBasePrice());
        existing.setMaxGuests(updated.getMaxGuests());
        existing.setFeatures(updated.getFeatures());
        existing.setIsPopular(updated.getIsPopular());
        return packageRepository.save(existing);
    }

    @Transactional
    public void delete(UUID id) {
        if (!packageRepository.existsById(id)) throw new ResourceNotFoundException("Package not found");
        packageRepository.deleteById(id);
    }
}