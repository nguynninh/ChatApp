package com.nguyenvanninh.identity.repository.httpclient;

import com.nguyenvanninh.identity.dto.response.FacebookTokenResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "facebookAccessTokenClient", url = "https://graph.facebook.com")
public interface FacebookAccessTokenClient {

    @GetMapping("/v10.0/oauth/access_token")
    FacebookTokenResponse getAccessToken(
        @RequestParam("client_id") String clientId,
        @RequestParam("redirect_uri") String redirectUri,
        @RequestParam("client_secret") String clientSecret,
        @RequestParam("code") String code
    );
}
