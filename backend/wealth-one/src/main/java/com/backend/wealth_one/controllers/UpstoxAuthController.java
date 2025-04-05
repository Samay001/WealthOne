package com.backend.wealth_one.controllers;

import com.backend.wealth_one.services.UpstoxAuthService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

import java.util.Map;

@RestController
public class UpstoxAuthController {

    private final UpstoxAuthService upstoxAuthService;

    @Autowired
    public UpstoxAuthController(UpstoxAuthService upstoxAuthService) {
        this.upstoxAuthService = upstoxAuthService;
    }

    // Route to start the OAuth flow
    @GetMapping("/login")
    public RedirectView login() {
        String authUrl = upstoxAuthService.getAuthorizationUrl();
        return new RedirectView(authUrl);
    }

    // Callback route for OAuth redirect
    @GetMapping("/upstox/callback")
    public String callback(@RequestParam("code") String code, HttpSession session) {
        try {
            // Exchange the authorization code for access token
            Map<String, Object> tokenData = upstoxAuthService.getAccessToken(code);

            // Store tokens in session
            session.setAttribute("accessToken", tokenData.get("accessToken"));
            session.setAttribute("refreshToken", tokenData.get("refreshToken"));

            return "Authentication successful! You can now use the API.";
        } catch (Exception e) {
            return "Authentication failed: " + e.getMessage();
        }
    }
}
