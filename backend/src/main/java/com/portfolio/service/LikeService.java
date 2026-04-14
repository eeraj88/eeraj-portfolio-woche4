package com.portfolio.service;

import com.portfolio.entity.Like;
import com.portfolio.repository.LikeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LikeService {

    private final LikeRepository likeRepository;

    public long getLikeCount(Long projectId) {
        return likeRepository.countByProjectId(projectId);
    }

    public boolean addLike(Long projectId, String ipAddress) {
        // Prüfen, ob dieser User bereits geliked hat
        if (likeRepository.existsByProjectIdAndIpAddress(projectId, ipAddress)) {
            return false; // Bereits geliked
        }

        // Neuen Like erstellen
        Like like = new Like();
        like.setProjectId(projectId);
        like.setIpAddress(ipAddress);
        likeRepository.save(like);
        return true;
    }
}
