package com.backend.wealth_one.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String username;
    private String email;
    private String password;
    private String coindcxApiKey;
    private String coindcxApiSecret;
    private String upstoxApiKey;
    private String upstoxApiSecret;
}
