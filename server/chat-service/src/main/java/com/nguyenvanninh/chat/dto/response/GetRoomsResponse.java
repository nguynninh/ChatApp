package com.nguyenvanninh.chat.dto.response;

import com.nguyenvanninh.chat.constant.ERoomType;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class GetRoomsResponse {
    String id;

    String roomId;
    String name;
    String photoUrl;

    ERoomType roomType;
    String linkShare;

    String lastMessage;
    String lastMessageSenderName;
    String lastMessageStatus;
    LocalDateTime lastMessageAt;

    int unreadCount;
    boolean isNotificationEnabled;
    boolean isPinEnabled;
}