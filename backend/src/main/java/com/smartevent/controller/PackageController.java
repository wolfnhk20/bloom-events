package com.smartevent.controller;

import com.smartevent.service.PackageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.smartevent.model.Package;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/packages")
@RequiredArgsConstructor
public class PackageController {

    private final PackageService packageService;

    @GetMapping
    public ResponseEntity<List<com.smartevent.model.Package>> getAllPackages() {
        return ResponseEntity.ok(packageService.getAllPackages());
    }

    @GetMapping("/{id}")
    public ResponseEntity<com.smartevent.model.Package> getPackage(@PathVariable UUID id) {
        return ResponseEntity.ok(packageService.getPackageById(id));
    }

    @GetMapping("/recommend")
    public ResponseEntity<Map<String, Object>> recommend(@RequestParam Integer guestCount) {
        return ResponseEntity.ok(packageService.recommend(guestCount));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Package> createPackage(@Valid @RequestBody Package pkg) {
        return ResponseEntity.status(HttpStatus.CREATED).body(packageService.create(pkg));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Package> updatePackage(@PathVariable UUID id, @Valid @RequestBody Package pkg) {
        return ResponseEntity.ok(packageService.update(id, pkg));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletePackage(@PathVariable UUID id) {
        packageService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
