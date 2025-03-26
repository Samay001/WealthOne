package com.backend.wealth_one.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.util.Map;

@RestController
@RequestMapping("/upstox")
public class UpstoxSampleDataController {

    private static final Logger logger = LoggerFactory.getLogger(CoinDcxSampleDataController.class);
    private static final String SAMPLE_DATA_PATH = "src/main/resources/data/upstox/sample.json";

    private final ObjectMapper objectMapper;

    public UpstoxSampleDataController(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @GetMapping("/load")
    public ResponseEntity<Object> loadSampleData() {
        try {
            File file = new File(SAMPLE_DATA_PATH);
            if (!file.exists() || file.length() == 0) {
                return ResponseEntity.noContent().build(); // 204 No Content if file is missing
            }

            // Deserialize JSON directly into a Map<String, Object>
            Map<String, Object> sampleData = objectMapper.readValue(file, Map.class);

            return ResponseEntity.ok(sampleData);
        } catch (Exception e) {
            logger.error("Error reading Coindcx sample data file", e);
            return ResponseEntity.internalServerError().body("Error loading sample data");
        }
    }
}
