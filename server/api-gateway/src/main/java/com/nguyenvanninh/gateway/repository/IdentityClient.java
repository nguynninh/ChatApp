package com.nguyenvanninh.gateway.repository;

import com.nguyenvanninh.gateway.dto.ApiResponse;
import com.nguyenvanninh.gateway.dto.request.IntrospectRequest;
import com.nguyenvanninh.gateway.dto.response.IntrospectResponse;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.service.annotation.PostExchange;
import reactor.core.publisher.Mono;

public interface IdentityClient {
    @PostExchange(url = "/auth/introspect", contentType = MediaType.APPLICATION_JSON_VALUE)
    Mono<ApiResponse<IntrospectResponse>> introspect(@RequestBody IntrospectRequest request);
}
