package vn.uit.lms.shared.dto.request.resource;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request DTO for reordering lesson resources")
public class ReorderResourcesRequest {

    @NotEmpty(message = "Resource IDs list cannot be empty")
    @Schema(
        description = "Ordered list of resource IDs",
        example = "[3, 1, 2, 4]",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    private List<Long> resourceIds;
}

