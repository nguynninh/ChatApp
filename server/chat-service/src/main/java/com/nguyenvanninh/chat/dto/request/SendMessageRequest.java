package com.nguyenvanninh.chat.dto.request;

import com.nguyenvanninh.chat.constant.EMessageType;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SendMessageRequest {
    String senderId;
    String roomId;

    Object content;

    EMessageType type;
}
