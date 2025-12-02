package vn.uit.lms.shared.mapper.system;

import org.mapstruct.Mapper;
import vn.uit.lms.core.entity.system.SystemSetting;
import vn.uit.lms.shared.dto.response.system.SystemSettingResponse;

@Mapper(componentModel = "spring")
public interface SystemSettingMapper {
    SystemSettingResponse toDto(SystemSetting entity);
}
