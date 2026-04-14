package com.portfolio.controller;

import com.portfolio.service.LikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/likes")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:4173"})
public class LikeController {

    private final LikeService likeService;

    @GetMapping("/{projectId}")
    public ResponseEntity<Map<String, Long>> getLikeCount(@PathVariable Long projectId) {
        long count = likeService.getLikeCount(projectId);
        return ResponseEntity.ok(Map.of("count", count));
    }

    @PostMapping("/{projectId}")
    public ResponseEntity<Map<String, Object>> addLike(
            @PathVariable Long projectId,
            @RequestBody Map<String, String> request) {
        String ipAddress = request.get("ipAddress");
        if (ipAddress == null || ipAddress.isEmpty()) {
            ipAddress = "unknown";
        }

        boolean success = likeService.addLike(projectId, ipAddress);
        long count = likeService.getLikeCount(projectId);

        return ResponseEntity.ok(Map.of(
            "success", success,
            "count", count,
            "alreadyLiked", !success
        ));
    }
}
