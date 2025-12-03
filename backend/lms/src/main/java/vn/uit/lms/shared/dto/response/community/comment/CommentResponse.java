package vn.uit.lms.shared.dto.response.community.comment;


import lombok.Data;

import java.time.Instant;
import java.util.List;

@Data
public class CommentResponse {

    private Long id;

    private UserDto user;

    private String content;

    private Instant createdAt;

    private List<CommentResponse> replies;

    @Data
    public static class UserDto {
        private Long id;
        private String username;
        private String avatarUrl;
    }
}