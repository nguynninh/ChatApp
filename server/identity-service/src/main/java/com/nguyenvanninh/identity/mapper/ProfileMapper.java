package com.nguyenvanninh.identity.mapper;

import org.mapstruct.Mapper;

import com.nguyenvanninh.identity.dto.request.ProfileCreationRequest;
import com.nguyenvanninh.identity.dto.request.UserCreationRequest;

@Mapper(componentModel = "spring")
public interface ProfileMapper {
    ProfileCreationRequest toProfileCreationRequest(UserCreationRequest request);
}