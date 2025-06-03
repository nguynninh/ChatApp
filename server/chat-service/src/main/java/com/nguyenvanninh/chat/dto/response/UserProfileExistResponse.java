package com.nguyenvanninh.chat.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserProfileExistResponse {
    int quantity;
    int success;
    int failed;
    Map<String, Boolean> users;
}