package com.nguyenvanninh.identity.repository.httpclient;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.Map;

@FeignClient(name = "googleUserInfoClient", url = "https://www.googleapis.com")
public interface GoogleUserInfoClient {

    @GetMapping("/oauth2/v2/userinfo")
    Map<String, Object> getUserInfo(@RequestHeader("Authorization") String bearerToken);
}
