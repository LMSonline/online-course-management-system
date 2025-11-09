package vn.uit.lms.shared.dto.request.course;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class TagRequest {
    @NotBlank(message = "Tag name is required")
    @Size(max = 100, message = "Tag name must be at most 100 characters")
    private String name;
}