package vn.uit.lms.shared.mapper.log;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import vn.uit.lms.core.entity.log.AuditLog;
import vn.uit.lms.shared.dto.response.log.AuditLogResponse;

@Mapper(componentModel = "spring")
public interface AuditLogMapper {

    @Mapping(target = "changedData", expression = "java(toJsonString(log.getChangedData()))")
    AuditLogResponse toDto(AuditLog log);

    default String toJsonString(Object obj) {
        if (obj == null) return null;
        return obj.toString(); // hoặc dùng Jackson nếu cần đẹp
    }
}
