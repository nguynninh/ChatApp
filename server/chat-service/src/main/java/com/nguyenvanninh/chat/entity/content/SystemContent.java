package com.nguyenvanninh.chat.entity.content;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SystemContent {
    private String message;
    private String actionType;
    private String targetUserId;
}
