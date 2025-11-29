package vn.uit.lms.shared.dto.request.assessment;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class QuestionBankRequest {
    @NotBlank(message = "Name is required")
    private String name;
    private String description;
}
