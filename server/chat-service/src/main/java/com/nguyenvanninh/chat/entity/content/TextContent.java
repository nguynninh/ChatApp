package com.nguyenvanninh.chat.entity.content;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TextContent {
    private String text;
    private boolean isMarkdown;
}
