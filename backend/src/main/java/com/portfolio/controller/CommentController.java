package com.portfolio.controller;

import com.portfolio.entity.Comment;
import com.portfolio.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:4173"})
public class CommentController {

    private final CommentService commentService;

    @GetMapping("/{projectId}")
    public ResponseEntity<List<Comment>> getComments(@PathVariable Long projectId) {
        List<Comment> comments = commentService.getCommentsByProjectId(projectId);
        return ResponseEntity.ok(comments);
    }

    @PostMapping("/{projectId}")
    public ResponseEntity<Comment> addComment(
            @PathVariable Long projectId,
            @RequestBody Map<String, String> request) {
        String name = request.get("name");
        String message = request.get("message");

        if (name == null || name.trim().isEmpty() || message == null || message.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        Comment comment = commentService.addComment(projectId, name, message);
        return ResponseEntity.ok(comment);
    }
}
