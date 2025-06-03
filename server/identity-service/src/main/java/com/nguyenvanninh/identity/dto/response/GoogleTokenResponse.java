package com.nguyenvanninh.identity.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import com.fasterxml.jackson.annotation.JsonProperty;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class GoogleTokenResponse {

    @JsonProperty("access_token")
    String accessToken;

    @JsonProperty("expires_in")
    String expiresIn;

    @JsonProperty("token_type")
    String tokenType;

    @JsonProperty("scope")
    String scope;

    @JsonProperty("id_token")
    String idToken;
}
