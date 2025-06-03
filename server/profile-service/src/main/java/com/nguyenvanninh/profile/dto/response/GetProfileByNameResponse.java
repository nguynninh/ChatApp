package com.nguyenvanninh.profile.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class GetProfileByNameResponse {
    @Data
    public static class Profile {
        String id;
        String firstName;
        String lastName;
    }

    List<Profile> profiles;
}