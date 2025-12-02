package vn.uit.lms.shared.mapper.log;

import org.mapstruct.Mapper;
import vn.uit.lms.core.entity.log.AuditLog;
import vn.uit.lms.shared.dto.response.log.AuditLogResponse;

@Mapper(componentModel = "spring")
public interface AuditLogMapper {
    AuditLogResponse toDto(AuditLog log);
}
