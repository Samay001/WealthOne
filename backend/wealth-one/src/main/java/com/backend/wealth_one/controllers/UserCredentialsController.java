package com.backend.wealth_one.controllers;

import com.backend.wealth_one.models.User;
import com.backend.wealth_one.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1")
public class UserCredentialsController {

    @Autowired
    private UserRepository userRepository;

    @PutMapping("/user-credentials")
    public ResponseEntity<?> updateApplicationCredentials(@RequestBody Map<String, String> credentials) {
        // Get the current authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.isAuthenticated()) {
            String username = authentication.getName();
            System.out.println("Authenticated username: " + username);

            Optional<User> userOptional = userRepository.findByUsername(username);

            if (userOptional.isPresent()) {
                User user = userOptional.get();

                // Update credentials based on what's in the request
                if (credentials.containsKey("coindcxApiKey")) {
                    user.setCoindcxApiKey(credentials.get("coindcxApiKey"));
                }
                if (credentials.containsKey("coindcxApiSecret")) {
                    user.setCoindcxApiSecret(credentials.get("coindcxApiSecret"));
                }
                if (credentials.containsKey("upstoxApiKey")) {
                    user.setUpstoxApiKey(credentials.get("upstoxApiKey"));
                }
                if (credentials.containsKey("upstoxApiSecret")) {
                    user.setUpstoxApiSecret(credentials.get("upstoxApiSecret"));
                }

                // Save the updated user
                User updatedUser = userRepository.save(user);

                // Create a response without sensitive information
                Map<String, Object> response = new HashMap<>();
                response.put("message", "user credentials updated successfully");
                response.put("username", updatedUser.getUsername());

                return ResponseEntity.ok(response);
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User is not logged in");
    }
}