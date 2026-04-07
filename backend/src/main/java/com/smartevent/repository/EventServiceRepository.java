package com.smartevent.repository;

import com.smartevent.model.EventService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface EventServiceRepository extends JpaRepository<EventService, UUID> {
    List<EventService> findByEventId(UUID eventId);
    void deleteByEventId(UUID eventId);
}