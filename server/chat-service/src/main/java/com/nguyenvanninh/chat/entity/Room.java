package com.nguyenvanninh.chat.entity;

import com.nguyenvanninh.chat.constant.ERoomType;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.time.LocalDateTime;
import java.util.List;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "rooms")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Room {
    @MongoId
    String id;

    String roomId;
    String name;
    String photoUrl;
    String description;

    String iconCustom;
    String background;

    ERoomType roomType;
    String linkShare;

    String createBy;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
