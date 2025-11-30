package vn.uit.lms.shared.dto.request.community.comment;


import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CommentCreateRequest {

    @NotBlank(message = "Content is required")
    private String content;
}