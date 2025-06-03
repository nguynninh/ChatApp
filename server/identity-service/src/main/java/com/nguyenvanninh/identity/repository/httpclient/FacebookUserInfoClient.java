package com.nguyenvanninh.identity.repository.httpclient;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Map;

@FeignClient(name = "facebookUserInfoClient", url = "https://graph.facebook.com")
public interface FacebookUserInfoClient {

    @GetMapping(value ="/me", params = {"fields", "access_token"})
    Map<String, Object> getUserInfo(
            @RequestParam("fields") String fields,
            @RequestParam("access_token") String accessToken
    );
}

