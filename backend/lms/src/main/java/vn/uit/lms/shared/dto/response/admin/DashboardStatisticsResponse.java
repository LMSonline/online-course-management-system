package vn.uit.lms.shared.dto.response.admin;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter
public class DashboardStatisticsResponse {

    private List<TimeSeriesItem> revenueTrend;
    private List<TimeSeriesItem> userGrowth;
    private List<TimeSeriesItem> courseCompletion;
}



