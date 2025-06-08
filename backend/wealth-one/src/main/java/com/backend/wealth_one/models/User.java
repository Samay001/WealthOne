package com.backend.wealth_one.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
@Document(collection = "users")
public class User {
    @Id
    private String id;

    @Field("username")
    private String username;

    @Field("email")
    private String email;

    @Field("password")
    private String password;

    @Field("coindcxApiKey")
    private String coindcxApiKey;

    @Field("coindcxApiSecret")
    private String coindcxApiSecret;

    @Field("upstoxApiKey")
    private String upstoxApiKey;

    @Field("upstoxApiSecret")
    private String upstoxApiSecret;
}