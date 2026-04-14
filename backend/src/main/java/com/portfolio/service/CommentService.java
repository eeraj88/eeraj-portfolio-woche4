package com.portfolio.service;

import com.portfolio.entity.Comment;
import com.portfolio.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;

    public List<Comment> getCommentsByProjectId(Long projectId) {
        return commentRepository.findByProjectIdOrderByTimestampDesc(projectId);
    }

    public Comment addComment(Long projectId, String name, String message) {
        Comment comment = new Comment();
        comment.setProjectId(projectId);
        comment.setName(name);
        comment.setMessage(message);
        return commentRepository.save(comment);
    }
}
