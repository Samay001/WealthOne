package com.backend.wealth_one.services;

import com.backend.wealth_one.models.User;
import com.backend.wealth_one.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;

@Service
public class AuthService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User registerUser(User user) {
        // Add this debug logging temporarily
        System.out.println("=== DEBUG: Received user ===");
        System.out.println("CoindcxApiKey: " + user.getCoindcxApiKey());
        System.out.println("CoindcxApiSecret: " + user.getCoindcxApiSecret());
        System.out.println("UpstoxApiKey: " + user.getUpstoxApiKey());
        System.out.println("UpstoxApiSecret: " + user.getUpstoxApiSecret());

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        User savedUser = userRepository.save(user);

        System.out.println("=== DEBUG: Saved user ===");
        System.out.println("CoindcxApiKey: " + savedUser.getCoindcxApiKey());
        System.out.println("CoindcxApiSecret: " + savedUser.getCoindcxApiSecret());
        System.out.println("UpstoxApiKey: " + savedUser.getUpstoxApiKey());
        System.out.println("UpstoxApiSecret: " + savedUser.getUpstoxApiSecret());

        return savedUser;
    }

    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                new ArrayList<>()
        );
    }
}