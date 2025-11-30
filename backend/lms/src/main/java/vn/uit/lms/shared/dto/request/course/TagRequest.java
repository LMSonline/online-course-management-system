package vn.uit.lms.shared.dto.request.course;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Schema(description = "Request DTO for creating or updating a tag")
public class TagRequest {
    @NotBlank(message = "Tag name is required")
    @Size(max = 100, message = "Tag name must be at most 100 characters")
    @Schema(
        description = "Tag name",
        example = "Spring Boot",
        requiredMode = Schema.RequiredMode.REQUIRED,
        maxLength = 100
    )
    private String name;
}