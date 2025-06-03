package com.nguyenvanninh.identity.controllers;

import java.text.ParseException;

import com.nguyenvanninh.identity.dto.ApiResponse;
import com.nguyenvanninh.identity.dto.response.ResetPasswordResponse;
import com.nguyenvanninh.identity.dto.response.SocialResponse;
import org.springframework.web.bind.annotation.*;

import com.nguyenvanninh.identity.dto.request.*;
import com.nguyenvanninh.identity.dto.response.AuthenticationResponse;
import com.nguyenvanninh.identity.dto.response.IntrospectResponse;
import com.nguyenvanninh.identity.service.AuthenticationService;
import com.nimbusds.jose.JOSEException;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationController {
    AuthenticationService authenticationService;

    @PostMapping("/login")
    ApiResponse<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request) {
        var result = authenticationService.authenticate(request);
        return ApiResponse.<AuthenticationResponse>builder()
                .message("Authentication success")
                .data(result)
                .build();
    }

    @GetMapping("/{socialType}")
    ApiResponse<SocialResponse> authenticate(
            @PathVariable String socialType
    ) {
        var result = authenticationService.sociallyAuthenticate(socialType);
        return ApiResponse.<SocialResponse>builder()
                .message("Authentication successful!\n You can close this window now.")
                .data(result)
                .build();
    }

    @PostMapping("/{socialType}/callback")
    ApiResponse<AuthenticationResponse> callback(
            @RequestParam String code,
            @PathVariable String socialType
    ) {
        var result = authenticationService.sociallyAuthenticateCallback(code, socialType);
        return ApiResponse.<AuthenticationResponse>builder()
                .message("Authentication success")
                .data(result)
                .build();
    }

    @PostMapping("/introspect")
    ApiResponse<IntrospectResponse> authenticate(@RequestBody IntrospectRequest request) {
        var result = authenticationService.introspect(request);
        return ApiResponse.<IntrospectResponse>builder()
                .message("Introspection success")
                .data(result)
                .build();
    }

    @PostMapping("/refresh")
    ApiResponse<AuthenticationResponse> authenticate(@RequestBody RefreshRequest request)
            throws ParseException, JOSEException {
        var result = authenticationService.refreshToken(request);
        return ApiResponse.<AuthenticationResponse>builder()
                .message("Refresh token success")
                .data(result)
                .build();
    }

    @PostMapping("/logout")
    ApiResponse<Void> logout(@RequestBody LogoutRequest request) throws ParseException, JOSEException {
        authenticationService.logout(request);
        return ApiResponse.<Void>builder()
                .message("Logout success")
                .build();
    }

    @PostMapping("/forgot-password")
    ApiResponse<Void> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        authenticationService.forgotPassword(request);
        return ApiResponse.<Void>builder()
                .message("Reset password success")
                .build();
    }

    @PostMapping("/reset-password")
    ApiResponse<ResetPasswordResponse> resetPassword(@RequestBody ResetPasswordRequest request) {
        var resetPassword = authenticationService.resetPassword(request);
        return ApiResponse.<ResetPasswordResponse>builder()
                .message(resetPassword.isSuccess()
                        ? "Reset password success"
                        : "Reset password failed")
                .data(resetPassword)
                .build();
    }
}
