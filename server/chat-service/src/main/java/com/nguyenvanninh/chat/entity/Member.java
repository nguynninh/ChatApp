package com.nguyenvanninh.chat.entity;

import com.nguyenvanninh.chat.constant.ERole;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.time.LocalDateTime;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "members")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Member {
    @MongoId
    String id;

    String roomId;
    String userId;
    String nickname;

    ERole role;

    String addById;
    LocalDateTime joinedAt;

    boolean isNotificationEnabled;
    boolean isPinEnabled;
}
