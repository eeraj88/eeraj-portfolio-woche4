package com.portfolio.controller;

import com.portfolio.entity.Visitor;
import com.portfolio.service.VisitorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/visitor")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:4173"})
public class VisitorController {

    private final VisitorService visitorService;

    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> getVisitorCount() {
        long count = visitorService.getVisitorCount();
        return ResponseEntity.ok(Map.of("count", count));
    }

    @PostMapping
    public ResponseEntity<Visitor> registerVisitor(@RequestBody Map<String, String> request) {
        String ipAddress = request.get("ipAddress");
        if (ipAddress == null || ipAddress.isEmpty()) {
            ipAddress = "unknown";
        }
        Visitor visitor = visitorService.registerVisitor(ipAddress);
        return ResponseEntity.ok(visitor);
    }
}
