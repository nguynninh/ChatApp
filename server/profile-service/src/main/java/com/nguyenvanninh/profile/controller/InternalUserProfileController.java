package com.nguyenvanninh.profile.controller;

import com.nguyenvanninh.profile.dto.ApiResponse;
import com.nguyenvanninh.profile.dto.request.GetProfileByNameRequest;
import com.nguyenvanninh.profile.dto.request.ProfileCreationRequest;
import com.nguyenvanninh.profile.dto.request.UserProfileExistRequest;
import com.nguyenvanninh.profile.dto.response.GetProfileByNameResponse;
import com.nguyenvanninh.profile.dto.response.UserProfileResponse;
import com.nguyenvanninh.profile.dto.response.UserProfileExistResponse;
import com.nguyenvanninh.profile.service.UserProfileService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/internal")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class InternalUserProfileController {
    UserProfileService userProfileService;

    @PostMapping("/users")
    ApiResponse<UserProfileResponse> createProfile(@RequestBody ProfileCreationRequest request) {
        return ApiResponse.<UserProfileResponse>builder()
                .data(userProfileService.createProfile(request))
                .build();
    }

    @GetMapping("/users/{userId}")
    ApiResponse<UserProfileResponse> getProfile(@PathVariable String userId) {
        return ApiResponse.<UserProfileResponse>builder()
                .data(userProfileService.getByUserId(userId))
                .build();
    }

    @PostMapping("/users/exist")
    public ApiResponse<UserProfileExistResponse> checkUsersHaveProfiles(@RequestBody UserProfileExistRequest request) {
        var result = userProfileService.checkUsersHaveProfiles(request);
        return ApiResponse.<UserProfileExistResponse>builder()
                .data(result)
                .build();
    }

    @PostMapping("/users/name")
    public ApiResponse<GetProfileByNameResponse> getNames(
            @RequestBody GetProfileByNameRequest request) {
        var result = userProfileService.getNames(request);
        return ApiResponse.<GetProfileByNameResponse>builder()
                .data(result)
                .build();
    }
}
