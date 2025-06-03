package com.nguyenvanninh.identity.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.nguyenvanninh.identity.dto.request.UserCreationRequest;
import com.nguyenvanninh.identity.dto.request.UserUpdateRequest;
import com.nguyenvanninh.identity.dto.response.UserResponse;
import com.nguyenvanninh.identity.entity.User;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toUser(UserCreationRequest request);

    UserResponse toUserResponse(User user);

    User toUser(UserResponse request);

    @Mapping(target = "roles", ignore = true)
    void updateUser(@MappingTarget User user, UserUpdateRequest request);
}