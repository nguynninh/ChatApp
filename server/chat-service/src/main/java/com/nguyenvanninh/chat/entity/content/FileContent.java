package com.nguyenvanninh.chat.entity.content;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FileContent {
    private String url;
    private String filename;
    private long size;
    private String mimeType;
}
