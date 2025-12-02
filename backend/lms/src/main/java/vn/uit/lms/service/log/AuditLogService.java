package vn.uit.lms.service.log;

import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import vn.uit.lms.core.entity.log.AuditLog;
import vn.uit.lms.core.repository.log.AuditLogRepository;
import vn.uit.lms.shared.dto.PageResponse;
import vn.uit.lms.shared.dto.response.log.AuditLogResponse;
import vn.uit.lms.shared.mapper.log.AuditLogMapper;

import java.io.PrintWriter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository repo;
    private final AuditLogMapper mapper;

    // 1) Tìm kiếm audit log theo keyword
    public PageResponse<AuditLogResponse> search(String keyword, Pageable pageable) {

        Page<AuditLog> page = repo.findByTableNameContainingIgnoreCase(keyword, pageable);

        return PageResponse.<AuditLogResponse>builder()
                .items(page.getContent().stream()
                        .map(mapper::toDto)
                        .collect(Collectors.toList()))
                .page(page.getNumber())
                .size(page.getSize())
                .totalItems(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .hasNext(page.hasNext())
                .hasPrevious(page.hasPrevious())
                .build();
    }

    // 2) Lấy tất cả audit logs (paging)
    public PageResponse<AuditLogResponse> getAll(Pageable pageable) {

        Page<AuditLog> page = repo.findAll(pageable);

        return PageResponse.<AuditLogResponse>builder()
                .items(page.getContent().stream()
                        .map(mapper::toDto)
                        .collect(Collectors.toList()))
                .page(page.getNumber())
                .size(page.getSize())
                .totalItems(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .hasNext(page.hasNext())
                .hasPrevious(page.hasPrevious())
                .build();
    }

    // 3) Xuất CSV
    public void exportCsv(PrintWriter writer) {

        List<AuditLog> logs = repo.findAll();

        writer.println("ID,Table Name,Record ID,Action,Changed Data,User Account ID,IP Address,Created At");

        for (AuditLog log : logs) {
            writer.printf("%d,%s,%s,%s,%s,%d,%s,%s\n",
                    log.getId(),
                    safe(log.getTableName()),
                    safe(log.getRecordId()),
                    log.getAction().name(),
                    safe(String.valueOf(log.getChangedData())),
                    log.getUserAccountId(),
                    safe(log.getIpAddress()),
                    log.getCreatedAt()
            );
        }

        writer.flush();
    }

    // Escape ký tự CSV tránh lỗi format
    private String safe(String text) {
        if (text == null) return "";
        return text.replace(",", ";").replace("\n", " ");
    }
}
