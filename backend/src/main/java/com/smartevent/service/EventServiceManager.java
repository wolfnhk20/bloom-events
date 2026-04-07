package com.smartevent.service;

import com.smartevent.exception.ResourceNotFoundException;
import com.smartevent.model.Service;
import com.smartevent.repository.ServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class EventServiceManager {

    private final ServiceRepository serviceRepository;

    public List<com.smartevent.model.Service> getAllServices() {
        return serviceRepository.findAllByOrderByCategoryAscNameAsc();
    }

    public Service getServiceById(UUID id) {
        return (Service) serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found: " + id));
    }

    @Transactional
    public Service create(Service service) { return serviceRepository.save(service); }

    @Transactional
    public Service update(UUID id, Service updated) {
        Service existing = getServiceById(id);
        existing.setName(updated.getName());
        existing.setDescription(updated.getDescription());
        existing.setPrice(updated.getPrice());
        existing.setCategory(updated.getCategory());
        existing.setIcon(updated.getIcon());
        return serviceRepository.save(existing);
    }

    @Transactional
    public void delete(UUID id) {
        if (!serviceRepository.existsById(id)) throw new ResourceNotFoundException("Service not found");
        serviceRepository.deleteById(id);
    }
}