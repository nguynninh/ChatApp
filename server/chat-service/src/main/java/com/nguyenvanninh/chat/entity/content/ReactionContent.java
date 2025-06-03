package com.nguyenvanninh.chat.entity.content;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReactionContent {
    private String messageId;
    private String reaction;
    private String userId;
}
