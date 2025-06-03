package com.nguyenvanninh.chat.dto.response;

import com.nguyenvanninh.chat.constant.EMessageStatus;
import com.nguyenvanninh.chat.constant.EMessageType;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SendMessageResponse {
    String id;

    String senderId;
    String roomId;

    Object content;

    EMessageType type;
    EMessageStatus status;
    LocalDateTime timestamp;
}
