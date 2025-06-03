package com.nguyenvanninh.chat.entity;

import com.nguyenvanninh.chat.constant.EMessageStatus;
import com.nguyenvanninh.chat.constant.EMessageType;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;
import java.util.Map;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "messages")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Message {
    @Id
    String id;

    String senderId;
    String roomId;

    @Field("content")
    Object content;
    EMessageType type;

    EMessageStatus status;

    LocalDateTime timestamp;
}