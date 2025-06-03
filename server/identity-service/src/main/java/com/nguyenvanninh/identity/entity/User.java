package com.nguyenvanninh.identity.entity;

import java.util.Set;

import jakarta.persistence.*;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class User extends Auditable {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @Column(name = "password", columnDefinition = "VARCHAR(255) COLLATE utf8mb4_unicode_ci")
    String password;

    @Column(name = "email", unique = true, columnDefinition = "VARCHAR(255) COLLATE utf8mb4_unicode_ci")
    String email;

    @Column(name = "email_verified", nullable = false, columnDefinition = "boolean default false")
    boolean emailVerified;

    @Column(name = "login_by_google", nullable = false, columnDefinition = "boolean default false")
    boolean loginByGoogle;

    @Column(name = "login_by_facebook", nullable = false, columnDefinition = "boolean default false")
    boolean loginByFacebook;

    @ManyToMany
    Set<Role> roles;
}