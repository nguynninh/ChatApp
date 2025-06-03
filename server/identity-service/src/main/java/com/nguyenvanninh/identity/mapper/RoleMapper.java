package com.nguyenvanninh.identity.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.nguyenvanninh.identity.dto.request.RoleRequest;
import com.nguyenvanninh.identity.dto.response.RoleResponse;
import com.nguyenvanninh.identity.entity.Role;

@Mapper(componentModel = "spring")
public interface RoleMapper {
    @Mapping(target = "permissions", ignore = true)
    Role toRole(RoleRequest request);

    RoleResponse toRoleResponse(Role role);
}