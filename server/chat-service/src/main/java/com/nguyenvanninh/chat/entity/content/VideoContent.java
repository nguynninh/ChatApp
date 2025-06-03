package com.nguyenvanninh.chat.entity.content;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VideoContent {
    private String url;
    private String thumbnailUrl;
    private int duration;
    private int width;
    private int height;
    private String caption;
}
