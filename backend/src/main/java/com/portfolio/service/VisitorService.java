package com.portfolio.service;

import com.portfolio.entity.Visitor;
import com.portfolio.repository.VisitorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class VisitorService {

    private final VisitorRepository visitorRepository;

    public long getVisitorCount() {
        return visitorRepository.count();
    }

    public Visitor registerVisitor(String ipAddress) {
        Visitor visitor = new Visitor();
        visitor.setIpAddress(ipAddress);
        return visitorRepository.save(visitor);
    }
}
