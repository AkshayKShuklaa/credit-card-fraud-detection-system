package com.fraud.backend.entity;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Document(collection = "users")
@Data
@NoArgsConstructor
public class User {
    @Id
    private String id;

    private String username;

    private String password;

    private String role; // "USER" or "ADMIN"

    @CreatedDate
    private LocalDateTime createdAt;
    
    public User(String username, String password, String role) {
        this.username = username;
        this.password = password;
        this.role = role;
    }
}
