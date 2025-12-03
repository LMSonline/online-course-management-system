package vn.uit.lms.shared.mapper.community;

import vn.uit.lms.core.entity.community.comment.Comment;
import vn.uit.lms.shared.dto.response.community.comment.CommentResponse;

import java.util.List;

public class CommentMapper {

    public static CommentResponse toResponse(Comment c, List<CommentResponse> replies) {

        if (c == null) return null;

        CommentResponse dto = new CommentResponse();
        dto.setId(c.getId());
        dto.setContent(c.getContent());
        dto.setCreatedAt(c.getCreatedAt());

        CommentResponse.UserDto user = new CommentResponse.UserDto();
        user.setId(c.getUser().getId());
        user.setUsername(c.getUser().getUsername());
        user.setAvatarUrl(c.getUser().getAvatarUrl());
        dto.setUser(user);

        dto.setReplies(replies);

        return dto;
    }
}