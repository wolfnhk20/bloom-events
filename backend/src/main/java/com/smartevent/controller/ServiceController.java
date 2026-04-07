package com.smartevent.controller;

import com.smartevent.model.Service;
import com.smartevent.service.EventServiceManager;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
public class ServiceController {

    private final EventServiceManager serviceManager;

    @GetMapping
    public ResponseEntity<List<Service>> getAllServices() {
        return ResponseEntity.ok(serviceManager.getAllServices());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Service> getService(@PathVariable UUID id) {
        return ResponseEntity.ok(serviceManager.getServiceById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Service> createService(@Valid @RequestBody Service service) {
        return ResponseEntity.status(HttpStatus.CREATED).body(serviceManager.create(service));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Service> updateService(@PathVariable UUID id, @Valid @RequestBody Service service) {
        return ResponseEntity.ok(serviceManager.update(id, service));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteService(@PathVariable UUID id) {
        serviceManager.delete(id);
        return ResponseEntity.noContent().build();
    }
}
