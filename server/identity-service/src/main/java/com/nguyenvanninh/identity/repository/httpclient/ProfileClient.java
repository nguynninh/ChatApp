package com.nguyenvanninh.identity.repository.httpclient;

import com.nguyenvanninh.identity.configuration.AuthenticationInterceptor;
import com.nguyenvanninh.identity.dto.ApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.nguyenvanninh.identity.dto.request.ProfileCreationRequest;
import com.nguyenvanninh.identity.dto.response.UserProfileResponse;

@FeignClient(name = "profile-service",
        configuration = { AuthenticationInterceptor.class })
public interface ProfileClient {
    @PostMapping(value = "/profile/internal/users", produces = MediaType.APPLICATION_JSON_VALUE)
    ApiResponse<UserProfileResponse> createProfile(@RequestBody ProfileCreationRequest request);
}