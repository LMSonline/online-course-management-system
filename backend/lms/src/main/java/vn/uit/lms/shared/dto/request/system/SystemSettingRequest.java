package vn.uit.lms.shared.dto.request.system;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SystemSettingRequest {
    private String keyName;
    private String value;
    private String description;
}
