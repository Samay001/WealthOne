package com.backend.wealth_one.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.backend.wealth_one.services.StockService;

@RestController
@RequestMapping("/api/v1")
public class StockPriceApiController {

    private final StockService stockService;

    @Autowired
    public StockPriceApiController(StockService stockService) {
        this.stockService = stockService;
    }

    @GetMapping("/stock")
    public ResponseEntity<?> getStockPrice(@RequestParam("name") String stockName) {
        Object stockResponse = stockService.getStockPrice(stockName);
        return ResponseEntity.ok(stockResponse);
    }
}
