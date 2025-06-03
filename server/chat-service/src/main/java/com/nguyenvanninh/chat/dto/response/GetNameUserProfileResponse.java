package com.nguyenvanninh.chat.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class GetNameUserProfileResponse {
    @Data
    public static class Profile {
        public String id;
        public String firstName;
        public String lastName;
    }

    List<Profile> profiles;
}
