package com.backend.wealth_one.controllers;

import com.backend.wealth_one.models.User;
import com.backend.wealth_one.services.AuthService;
import com.backend.wealth_one.utils.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth/v1")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        if (authService.getUserByUsername(user.getUsername()).isPresent()) {
            System.out.println("logs" + user);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username already exists");
        }
        return ResponseEntity.ok(authService.registerUser(user));
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> body, HttpServletResponse response) {
        String username = body.getOrDefault("username", "");
        String password = body.getOrDefault("password", "");

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password)
            );

            String token = jwtUtil.generateToken(username);

            Cookie jwtCookie = createJwtCookie(token);

            // Add the cookie to the response
            response.addCookie(jwtCookie);

            Map<String, String> responseBody = new HashMap<>();
            responseBody.put("token", token);
            responseBody.put("message", "Login successful");

            return ResponseEntity.ok(responseBody);
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        // Create a cookie with the same name but null value and zero max age to invalidate it
        Cookie cookie = new Cookie("jwt", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // Set to false for local development without HTTPS
        cookie.setPath("/");
        cookie.setMaxAge(0);

        response.addCookie(cookie);

        Map<String, String> responseBody = new HashMap<>();
        responseBody.put("message", "Logged out successfully");

        return ResponseEntity.ok(responseBody);
    }

    private Cookie createJwtCookie(String token) {
        Cookie cookie = new Cookie("jwt", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(7 * 24 * 60 * 60);

        return cookie;
    }
}