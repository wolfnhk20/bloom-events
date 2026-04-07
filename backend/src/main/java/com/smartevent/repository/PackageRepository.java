package com.smartevent.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.smartevent.model.Package;

import java.util.List;
import java.util.UUID;

@Repository
public interface PackageRepository extends JpaRepository<Package, UUID> {
    List<Package> findAllByOrderByBasePriceAsc();

    @Query("SELECT p FROM Package p WHERE p.maxGuests >= :guestCount ORDER BY p.basePrice ASC")
    List<Package> findSuitablePackages(@Param("guestCount") Integer guestCount);
}
