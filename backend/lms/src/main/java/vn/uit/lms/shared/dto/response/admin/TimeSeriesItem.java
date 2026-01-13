package vn.uit.lms.shared.dto.response.admin;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class TimeSeriesItem {

    private String label; // month / week
    private double value;
}
