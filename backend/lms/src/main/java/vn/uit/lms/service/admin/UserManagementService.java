package vn.uit.lms.service.admin;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.uit.lms.core.entity.Account;
import vn.uit.lms.core.repository.AccountRepository;
import vn.uit.lms.core.repository.StudentRepository;
import vn.uit.lms.core.repository.TeacherRepository;
import vn.uit.lms.shared.constant.AccountStatus;
import vn.uit.lms.shared.constant.Role;
import vn.uit.lms.shared.dto.PageResponse;
import vn.uit.lms.shared.dto.request.admin.ExportUsersRequest;
import vn.uit.lms.shared.dto.request.admin.UserFilterRequest;
import vn.uit.lms.shared.dto.response.admin.AdminUserListResponse;
import vn.uit.lms.shared.dto.response.admin.UserStatsResponse;
import vn.uit.lms.shared.exception.InvalidRequestException;

import java.io.IOException;
import java.io.PrintWriter;
import java.time.*;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for admin user management operations
 * Handles user listing, statistics, and export functionality
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class UserManagementService {

    private final AccountRepository accountRepository;
    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;

    @Transactional(readOnly = true)
    public PageResponse<AdminUserListResponse> getAllUsers(UserFilterRequest filter, Pageable pageable) {
        log.info("Fetching users with filter: {}", filter);

        if (pageable == null) {
            throw new InvalidRequestException("Pageable cannot be null");
        }

        Specification<Account> spec = buildUserSpecification(filter);
        Page<Account> page = accountRepository.findAll(spec, pageable);

        List<AdminUserListResponse> items = page.getContent().stream()
                .map(this::mapToUserListResponse)
                .collect(Collectors.toList());

        log.info("Retrieved {} users out of {} total", items.size(), page.getTotalElements());

        return PageResponse.<AdminUserListResponse>builder()
                .items(items)
                .page(page.getNumber())
                .size(page.getSize())
                .totalItems(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .hasNext(page.hasNext())
                .hasPrevious(page.hasPrevious())
                .build();
    }

    @Transactional(readOnly = true)
    public UserStatsResponse getUserStats() {
        log.info("Calculating user statistics");

        Instant now = Instant.now();
        LocalDateTime nowLocal = LocalDateTime.ofInstant(now, ZoneId.systemDefault());

        Long totalUsers = accountRepository.count();
        Long activeUsers = accountRepository.count(hasStatus(AccountStatus.ACTIVE));
        Long inactiveUsers = accountRepository.count(hasStatus(AccountStatus.DEACTIVATED));
        Long suspendedUsers = accountRepository.count(hasStatus(AccountStatus.SUSPENDED));
        Long pendingApprovalUsers = accountRepository.count(hasStatus(AccountStatus.PENDING_APPROVAL));
        Long pendingEmailUsers = accountRepository.count(hasStatus(AccountStatus.PENDING_EMAIL));
        Long rejectedUsers = accountRepository.count(hasStatus(AccountStatus.REJECTED));

        UserStatsResponse.RoleStats roleStats = UserStatsResponse.RoleStats.builder()
                .students(accountRepository.count(hasRole(Role.STUDENT)))
                .teachers(accountRepository.count(hasRole(Role.TEACHER)))
                .admins(accountRepository.count(hasRole(Role.ADMIN)))
                .approvedTeachers(teacherRepository.countByApprovedTrue())
                .pendingTeachers(teacherRepository.countByApprovedFalse())
                .build();

        UserStatsResponse.RegistrationStats registrationStats = UserStatsResponse.RegistrationStats.builder()
                .today(accountRepository.count(createdAfter(nowLocal.truncatedTo(ChronoUnit.DAYS))))
                .thisWeek(accountRepository.count(createdAfter(nowLocal.minusWeeks(1))))
                .thisMonth(accountRepository.count(createdAfter(nowLocal.minusMonths(1))))
                .thisYear(accountRepository.count(createdAfter(nowLocal.minusYears(1))))
                .build();

        UserStatsResponse.ActivityStats activityStats = UserStatsResponse.ActivityStats.builder()
                .activeToday(accountRepository.count(lastLoginAfter(nowLocal.truncatedTo(ChronoUnit.DAYS))))
                .activeThisWeek(accountRepository.count(lastLoginAfter(nowLocal.minusWeeks(1))))
                .activeThisMonth(accountRepository.count(lastLoginAfter(nowLocal.minusMonths(1))))
                .neverLoggedIn(accountRepository.count(lastLoginIsNull()))
                .inactiveFor30Days(accountRepository.count(lastLoginBefore(nowLocal.minusDays(30))))
                .inactiveFor90Days(accountRepository.count(lastLoginBefore(nowLocal.minusDays(90))))
                .build();

        log.info("Statistics calculated: total={}, active={}, teachers={}, students={}",
                totalUsers, activeUsers, roleStats.getTeachers(), roleStats.getStudents());

        return UserStatsResponse.builder()
                .totalUsers(totalUsers)
                .activeUsers(activeUsers)
                .inactiveUsers(inactiveUsers)
                .suspendedUsers(suspendedUsers)
                .pendingApprovalUsers(pendingApprovalUsers)
                .pendingEmailUsers(pendingEmailUsers)
                .rejectedUsers(rejectedUsers)
                .roleStats(roleStats)
                .registrationStats(registrationStats)
                .activityStats(activityStats)
                .build();
    }

    @Transactional(readOnly = true)
    public void exportUsers(ExportUsersRequest request, HttpServletResponse response) throws IOException {
        log.info("Exporting users with format: {}", request.getFormat());

        if (request.getFormat() == null) {
            throw new InvalidRequestException("Export format is required");
        }

        Specification<Account> spec = buildExportSpecification(request);
        List<Account> accounts = accountRepository.findAll(spec);
        log.info("Exporting {} users", accounts.size());

        String filename = "users_export_" + Instant.now().getEpochSecond();

        if (request.getFormat() == ExportUsersRequest.ExportFormat.CSV) {
            response.setContentType("text/csv");
            response.setHeader("Content-Disposition", "attachment; filename=\"" + filename + ".csv\"");
            exportToCsv(accounts, response.getWriter(), request);
        } else {
            response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            response.setHeader("Content-Disposition", "attachment; filename=\"" + filename + ".xlsx\"");
            exportToExcel(accounts, response.getOutputStream(), request);
        }

        log.info("Export completed successfully");
    }

    private Specification<Account> buildUserSpecification(UserFilterRequest filter) {
        if (filter == null) {
            return Specification.anyOf();
        }

        Specification<Account> spec = Specification.anyOf();

        if (filter.getKeyword() != null && !filter.getKeyword().isBlank()) {
            String keyword = "%" + filter.getKeyword().toLowerCase() + "%";
            spec = spec.and((root, query, cb) -> cb.or(
                    cb.like(cb.lower(root.get("username")), keyword),
                    cb.like(cb.lower(root.get("email")), keyword)
            ));
        }

        if (filter.getRole() != null) {
            spec = spec.and(hasRole(filter.getRole()));
        }

        if (filter.getStatus() != null) {
            spec = spec.and(hasStatus(filter.getStatus()));
        }

        if (filter.getCreatedFrom() != null) {
            spec = spec.and((root, query, cb) ->
                    cb.greaterThanOrEqualTo(root.get("createdAt"), filter.getCreatedFrom()));
        }
        if (filter.getCreatedTo() != null) {
            spec = spec.and((root, query, cb) ->
                    cb.lessThanOrEqualTo(root.get("createdAt"), filter.getCreatedTo()));
        }

        if (filter.getLastLoginFrom() != null) {
            spec = spec.and((root, query, cb) ->
                    cb.greaterThanOrEqualTo(root.get("lastLoginAt"), filter.getLastLoginFrom()));
        }
        if (filter.getLastLoginTo() != null) {
            spec = spec.and((root, query, cb) ->
                    cb.lessThanOrEqualTo(root.get("lastLoginAt"), filter.getLastLoginTo()));
        }

        if (filter.getHasAvatar() != null) {
            if (filter.getHasAvatar()) {
                spec = spec.and((root, query, cb) -> cb.isNotNull(root.get("avatarUrl")));
            } else {
                spec = spec.and((root, query, cb) -> cb.isNull(root.get("avatarUrl")));
            }
        }

        return spec;
    }

    private Specification<Account> buildExportSpecification(ExportUsersRequest request) {
        Specification<Account> spec = Specification.anyOf();

        List<AccountStatus> includedStatuses = new ArrayList<>();
        includedStatuses.add(AccountStatus.ACTIVE);
        includedStatuses.add(AccountStatus.PENDING_EMAIL);
        includedStatuses.add(AccountStatus.PENDING_APPROVAL);

        if (Boolean.TRUE.equals(request.getIncludeInactive())) {
            includedStatuses.add(AccountStatus.DEACTIVATED);
        }
        if (Boolean.TRUE.equals(request.getIncludeSuspended())) {
            includedStatuses.add(AccountStatus.SUSPENDED);
        }
        if (Boolean.TRUE.equals(request.getIncludeRejected())) {
            includedStatuses.add(AccountStatus.REJECTED);
        }

        spec = spec.and((root, query, cb) -> root.get("status").in(includedStatuses));

        if (!Boolean.TRUE.equals(request.getIncludeDeleted())) {
            spec = spec.and((root, query, cb) -> cb.isNull(root.get("deletedAt")));
        }

        return spec;
    }

    private AdminUserListResponse mapToUserListResponse(Account account) {
        AdminUserListResponse response = AdminUserListResponse.builder()
                .accountId(account.getId())
                .username(account.getUsername())
                .email(account.getEmail())
                .role(account.getRole())
                .status(account.getStatus())
                .avatarUrl(account.getAvatarUrl())
                .lastLoginAt(account.getLastLoginAt())
                .createdAt(account.getCreatedAt())
                .build();

        if (account.getLastLoginAt() != null) {
            long days = ChronoUnit.DAYS.between(account.getLastLoginAt(), Instant.now());
            response.setDaysSinceLastLogin(days);
        }

        if (account.getCreatedAt() != null) {
            long days = ChronoUnit.DAYS.between(account.getCreatedAt(), Instant.now());
            response.setAccountAgeDays(days);
        }

        if (account.getRole() == Role.TEACHER) {
            teacherRepository.findByAccount(account).ifPresent(teacher -> {
                response.setTeacherCode(teacher.getTeacherCode());
                response.setFullName(teacher.getFullName());
                response.setTeacherApproved(teacher.isApproved());
            });
        } else if (account.getRole() == Role.STUDENT) {
            studentRepository.findByAccount(account).ifPresent(student -> {
                response.setStudentCode(student.getStudentCode());
                response.setFullName(student.getFullName());
            });
        }

        return response;
    }

    private void exportToCsv(List<Account> accounts, PrintWriter writer, ExportUsersRequest request) {
        List<String> fields = determineExportFields(request.getFields());

        writer.println(fields.stream()
                .map(this::formatFieldHeader)
                .collect(Collectors.joining(",")));

        for (Account account : accounts) {
            List<String> values = new ArrayList<>();
            for (String field : fields) {
                values.add(escapeCsv(getFieldValue(account, field)));
            }
            writer.println(String.join(",", values));
        }

        writer.flush();
    }

    private List<String> determineExportFields(String fieldsParam) {
        if (fieldsParam != null && !fieldsParam.isBlank()) {
            return List.of(fieldsParam.split(","));
        }
        return List.of("accountId", "username", "email", "role", "status", "createdAt", "lastLoginAt");
    }

    private String formatFieldHeader(String field) {
        return field.replaceAll("([A-Z])", " $1").trim().toUpperCase();
    }

    private String getFieldValue(Account account, String field) {
        return switch (field.toLowerCase()) {
            case "accountid" -> String.valueOf(account.getId());
            case "username" -> account.getUsername();
            case "email" -> account.getEmail();
            case "role" -> account.getRole().name();
            case "status" -> account.getStatus().name();
            case "createdat" -> account.getCreatedAt() != null ? account.getCreatedAt().toString() : "";
            case "updatedat" -> account.getUpdatedAt() != null ? account.getUpdatedAt().toString() : "";
            case "lastloginat" -> account.getLastLoginAt() != null ? account.getLastLoginAt().toString() : "";
            case "avatarurl" -> account.getAvatarUrl() != null ? account.getAvatarUrl() : "";
            default -> "";
        };
    }

    private String escapeCsv(String value) {
        if (value == null) return "";
        if (value.contains(",") || value.contains("\"") || value.contains("\n")) {
            return "\"" + value.replace("\"", "\"\"") + "\"";
        }
        return value;
    }

    private Specification<Account> hasRole(Role role) {
        return (root, query, cb) -> cb.equal(root.get("role"), role);
    }

    private Specification<Account> hasStatus(AccountStatus status) {
        return (root, query, cb) -> cb.equal(root.get("status"), status);
    }

    private Specification<Account> createdAfter(LocalDateTime dateTime) {
        Instant instant = dateTime.atZone(ZoneId.systemDefault()).toInstant();
        return (root, query, cb) -> cb.greaterThanOrEqualTo(root.get("createdAt"), instant);
    }

    private Specification<Account> lastLoginAfter(LocalDateTime dateTime) {
        Instant instant = dateTime.atZone(ZoneId.systemDefault()).toInstant();
        return (root, query, cb) -> cb.greaterThanOrEqualTo(root.get("lastLoginAt"), instant);
    }

    private Specification<Account> lastLoginBefore(LocalDateTime dateTime) {
        Instant instant = dateTime.atZone(ZoneId.systemDefault()).toInstant();
        return (root, query, cb) -> cb.and(
                cb.isNotNull(root.get("lastLoginAt")),
                cb.lessThanOrEqualTo(root.get("lastLoginAt"), instant)
        );
    }

    private Specification<Account> lastLoginIsNull() {
        return (root, query, cb) -> cb.isNull(root.get("lastLoginAt"));
    }

    /**
     * Export users to Excel format using Apache POI
     */
    private void exportToExcel(List<Account> accounts, java.io.OutputStream outputStream, ExportUsersRequest request) throws IOException {
        List<String> fields = determineExportFields(request.getFields());

        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Users");

            // Create header style
            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setFontHeightInPoints((short) 12);
            headerFont.setColor(IndexedColors.WHITE.getIndex());
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerStyle.setAlignment(HorizontalAlignment.CENTER);
            headerStyle.setVerticalAlignment(VerticalAlignment.CENTER);
            headerStyle.setBorderBottom(BorderStyle.THIN);
            headerStyle.setBorderTop(BorderStyle.THIN);
            headerStyle.setBorderRight(BorderStyle.THIN);
            headerStyle.setBorderLeft(BorderStyle.THIN);

            // Create data style
            CellStyle dataStyle = workbook.createCellStyle();
            dataStyle.setBorderBottom(BorderStyle.THIN);
            dataStyle.setBorderTop(BorderStyle.THIN);
            dataStyle.setBorderRight(BorderStyle.THIN);
            dataStyle.setBorderLeft(BorderStyle.THIN);
            dataStyle.setVerticalAlignment(VerticalAlignment.CENTER);

            // Create date style
            CellStyle dateStyle = workbook.createCellStyle();
            dateStyle.cloneStyleFrom(dataStyle);
            CreationHelper createHelper = workbook.getCreationHelper();
            dateStyle.setDataFormat(createHelper.createDataFormat().getFormat("yyyy-mm-dd hh:mm:ss"));

            // Create header row
            Row headerRow = sheet.createRow(0);
            headerRow.setHeightInPoints(25);
            for (int i = 0; i < fields.size(); i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(formatFieldHeader(fields.get(i)));
                cell.setCellStyle(headerStyle);
            }

            // Create data rows
            int rowNum = 1;
            for (Account account : accounts) {
                Row row = sheet.createRow(rowNum++);
                for (int i = 0; i < fields.size(); i++) {
                    Cell cell = row.createCell(i);
                    String fieldValue = getFieldValue(account, fields.get(i));

                    // Try to parse dates for better formatting
                    if (fields.get(i).toLowerCase().contains("at") && !fieldValue.isEmpty()) {
                        try {
                            cell.setCellValue(fieldValue);
                            cell.setCellStyle(dataStyle);
                        } catch (Exception e) {
                            cell.setCellValue(fieldValue);
                            cell.setCellStyle(dataStyle);
                        }
                    } else {
                        cell.setCellValue(fieldValue);
                        cell.setCellStyle(dataStyle);
                    }
                }
            }

            // Auto-size columns
            for (int i = 0; i < fields.size(); i++) {
                sheet.autoSizeColumn(i);
                // Add some padding
                int currentWidth = sheet.getColumnWidth(i);
                sheet.setColumnWidth(i, currentWidth + 1000);
            }

            // Freeze header row
            sheet.createFreezePane(0, 1);

            // Add filter to header row
            sheet.setAutoFilter(new org.apache.poi.ss.util.CellRangeAddress(0, 0, 0, fields.size() - 1));

            // Write to output stream
            workbook.write(outputStream);
            outputStream.flush();
        }
    }
}

