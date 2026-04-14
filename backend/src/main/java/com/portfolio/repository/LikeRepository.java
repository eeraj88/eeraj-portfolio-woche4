package com.portfolio.repository;

import com.portfolio.entity.Like;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {
    long countByProjectId(Long projectId);
    boolean existsByProjectIdAndIpAddress(Long projectId, String ipAddress);
}
