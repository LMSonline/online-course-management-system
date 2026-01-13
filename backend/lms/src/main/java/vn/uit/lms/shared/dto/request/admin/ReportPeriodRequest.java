package vn.uit.lms.shared.dto.request.admin;

import java.time.LocalDate;

import vn.uit.lms.shared.constant.ReportPeriod;

public record ReportPeriodRequest(
    ReportPeriod period,
    LocalDate from,
    LocalDate to
) {}