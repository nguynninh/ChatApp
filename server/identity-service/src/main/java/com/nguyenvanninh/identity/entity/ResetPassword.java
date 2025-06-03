package com.nguyenvanninh.identity.entity;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.TimeToLive;
import org.springframework.data.redis.core.index.Indexed;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@RedisHash("reset_password")
public class ResetPassword {
    @Id
    String email;

    @Indexed
    String token;

    String code;

    Integer failedAttempts;

    @TimeToLive
    long expiration;
}
