package com.nguyenvanninh.identity.repository.httpclient;

import com.nguyenvanninh.identity.dto.response.GoogleTokenResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "googleAccessTokenClient", url = "https://oauth2.googleapis.com")
public interface GoogleAccessTokenClient {

    @PostMapping(value = "/token", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    GoogleTokenResponse getAccessToken(@RequestBody MultiValueMap<String, String> formData);
}
