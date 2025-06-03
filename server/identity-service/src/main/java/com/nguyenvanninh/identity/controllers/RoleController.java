package com.nguyenvanninh.identity.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.nguyenvanninh.identity.dto.ApiResponse;
import com.nguyenvanninh.identity.dto.request.RoleRequest;
import com.nguyenvanninh.identity.dto.response.RoleResponse;
import com.nguyenvanninh.identity.service.RoleService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/roles")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class RoleController {
    RoleService roleService;

    @PostMapping
    ApiResponse<RoleResponse> create(@RequestBody RoleRequest request) {
        return ApiResponse.<RoleResponse>builder()
                .data(roleService.create(request))
                .message("Role has been created")
                .build();
    }

    @GetMapping
    ApiResponse<List<RoleResponse>> getAll() {
        return ApiResponse.<List<RoleResponse>>builder()
                .data(roleService.getAll())
                .message("Get all roles")
                .build();
    }

    @DeleteMapping("/{role}")
    ApiResponse<Void> delete(@PathVariable String role) {
        roleService.delete(role);
        return ApiResponse.<Void>builder()
                .message("Role has been deleted")
                .build();
    }
}
