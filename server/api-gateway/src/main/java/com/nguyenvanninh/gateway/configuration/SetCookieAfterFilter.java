//package com.nguyenvanninh.gateway.configuration;
//
//import org.glassfish.jersey.internal.jsr166.Flow;
//import org.reactivestreams.Publisher;
//import org.springframework.cloud.gateway.filter.GatewayFilterChain;
//import org.springframework.cloud.gateway.filter.GlobalFilter;
//import org.springframework.core.Ordered;
//import org.springframework.core.io.buffer.DataBuffer;
//import org.springframework.core.io.buffer.DataBufferUtils;
//import org.springframework.http.ResponseCookie;
//import org.springframework.http.server.reactive.ServerHttpResponseDecorator;
//import org.springframework.stereotype.Component;
//import org.springframework.web.server.ServerWebExchange;
//import com.fasterxml.jackson.databind.JsonNode;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import lombok.experimental.FieldDefaults;
//import lombok.AccessLevel;
//import reactor.core.publisher.Mono;
//
//import java.util.Arrays;
//
//@Component
//@Slf4j
//@RequiredArgsConstructor
//@FieldDefaults(level = AccessLevel.PACKAGE, makeFinal = true)
//public class SetCookieAfterFilter implements GlobalFilter, Ordered {
//
//    ObjectMapper objectMapper;
//
//    String[] AUTH_PATHS = {
//            "/identity/auth/login",
//            "/identity/auth/refresh",
//            "/identity/auth/logout",
//    };
//
//    long ACCESS_TOKEN_MAX_AGE = 60 * 60;
//    long REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60;
//
//    @Override
//    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
//        String path = exchange.getRequest().getURI().getPath();
//
//        if (Arrays.stream(AUTH_PATHS).noneMatch(path::matches))
//            return chain.filter(exchange);
//    }
//
//    @Override
//    public int getOrder() {
//        return Ordered.LOWEST_PRECEDENCE;
//    }
//}
