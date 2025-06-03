package com.nguyenvanninh.chat.repository.httpclient;

import com.nguyenvanninh.chat.dto.response.GetNameUserProfileResponse;
import com.nguyenvanninh.chat.dto.response.UserProfileExistResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@FeignClient(name = "profile-service")
public interface ProfileClient {
    @PostMapping("/profiles/internal/users/exist")
    UserProfileExistResponse checkUsersHaveProfiles(@RequestBody List<String> userIds);

    @PostMapping("/profiles/internal/users/name")
    GetNameUserProfileResponse getName(@RequestBody List<String> userId);
}
