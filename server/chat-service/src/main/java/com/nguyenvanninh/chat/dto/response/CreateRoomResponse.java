package com.nguyenvanninh.chat.dto.response;

import com.nguyenvanninh.chat.entity.Member;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateRoomResponse {
    String id;
    String name;
    String description;
    String avatar;
    String roomType;
    List<Member> members;
    String createBy;
    String icon;
    String background;

    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}