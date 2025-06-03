package com.nguyenvanninh.identity.mapper;

import org.mapstruct.Mapper;

import com.nguyenvanninh.identity.dto.request.PermissionRequest;
import com.nguyenvanninh.identity.dto.response.PermissionResponse;
import com.nguyenvanninh.identity.entity.Permission;

@Mapper(componentModel = "spring")
public interface PermissionMapper {
    Permission toPermission(PermissionRequest request);

    PermissionResponse toPermissionResponse(Permission permission);
}