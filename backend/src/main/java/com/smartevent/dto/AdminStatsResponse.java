package com.smartevent.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminStatsResponse {
    private Long totalEvents;
    private Long totalUsers;
    private Long pendingEvents;
    private Long confirmedEvents;
    private BigDecimal totalRevenue;
    private Long totalGuests;
    private List<com.smartevent.dto.AdminStatsResponse.RevenueByMonth> revenueByMonth;
    private List<com.smartevent.dto.AdminStatsResponse.EventTypeCount> eventTypeBreakdown;

    @Data @NoArgsConstructor @AllArgsConstructor
    static class RevenueByMonth {
        private String month;
        private BigDecimal revenue;
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    static class EventTypeCount {
        private String type;
        private Long count;
    }
}