package vn.uit.lms.shared.dto.response.system;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SystemSettingResponse {
    private Long id;
    private String keyName;
    private String value;
    private String description;
}

