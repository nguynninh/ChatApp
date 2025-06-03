package com.nguyenvanninh.identity.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.nguyenvanninh.identity.dto.ApiResponse;
import com.nguyenvanninh.identity.dto.request.PermissionRequest;
import com.nguyenvanninh.identity.dto.response.PermissionResponse;
import com.nguyenvanninh.identity.service.PermissionService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/permissions")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class PermissionController {
    PermissionService permissionService;

    @PostMapping
    ApiResponse<PermissionResponse> create(@RequestBody PermissionRequest request) {
        return ApiResponse.<PermissionResponse>builder()
                .data(permissionService.create(request))
                .message("Permission has been created")
                .build();
    }

    @GetMapping
    ApiResponse<List<PermissionResponse>> getAll() {
        return ApiResponse.<List<PermissionResponse>>builder()
                .data(permissionService.getAll())
                .message("Get all permissions")
                .build();
    }

    @DeleteMapping("/{permission}")
    ApiResponse<Void> delete(@PathVariable String permission) {
        permissionService.delete(permission);
        return ApiResponse.<Void>builder()
                .message("Permission has been deleted")
                .build();
    }
}
