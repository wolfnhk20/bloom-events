package com.smartevent.repository;

import com.smartevent.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Repository
public interface EventRepository extends JpaRepository<Event, UUID> {
    List<Event> findByUserIdOrderByCreatedAtDesc(UUID userId);

    @Query("SELECT e FROM Event e WHERE e.user.id = :userId AND e.status = :status")
    List<Event> findByUserIdAndStatus(@Param("userId") UUID userId, @Param("status") Event.Status status);

    @Query("SELECT COUNT(e) FROM Event e")
    Long countAllEvents();

    @Query("SELECT COUNT(e) FROM Event e WHERE e.status = :status")
    Long countByStatus(@Param("status") Event.Status status);

    @Query("SELECT COALESCE(SUM(e.totalCost), 0) FROM Event e WHERE e.status != 'CANCELLED'")
    BigDecimal sumTotalRevenue();

    @Query("SELECT e.eventType, COUNT(e) FROM Event e GROUP BY e.eventType")
    List<Object[]> countByEventType();

    @Query(value = """
        SELECT TO_CHAR(e.created_at, 'Mon YYYY') as month, SUM(e.total_cost) as revenue
        FROM events e
        WHERE e.status != 'CANCELLED'
        GROUP BY TO_CHAR(e.created_at, 'Mon YYYY'), DATE_TRUNC('month', e.created_at)
        ORDER BY DATE_TRUNC('month', e.created_at) DESC
        LIMIT 6
        """, nativeQuery = true)
    List<Object[]> getRevenueByMonth();
}