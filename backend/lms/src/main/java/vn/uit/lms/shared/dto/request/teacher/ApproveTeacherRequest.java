package vn.uit.lms.shared.dto.request.teacher;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request to approve teacher")
public class ApproveTeacherRequest {

    @Size(max = 500, message = "Note must not exceed 500 characters")
    @Schema(description = "Optional note for approval", example = "Approved based on credentials verification")
    private String note;
}

