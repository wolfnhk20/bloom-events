package com.smartevent.repository;

import com.smartevent.model.Guest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface GuestRepository extends JpaRepository<Guest, UUID> {
    List<Guest> findByEventId(UUID eventId);

    @Query("SELECT COUNT(g) FROM Guest g WHERE g.event.user.id = :userId")
    Long countGuestsByUserId(@Param("userId") UUID userId);

    @Query("SELECT SUM(SIZE(e.guests)) FROM Event e")
    Long countAllGuests();
}