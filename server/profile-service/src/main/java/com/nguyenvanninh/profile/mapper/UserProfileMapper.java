package com.nguyenvanninh.profile.mapper;

import com.nguyenvanninh.profile.dto.response.UserProfileResponse;
import org.mapstruct.Mapper;

import com.nguyenvanninh.profile.dto.request.ProfileCreationRequest;
import com.nguyenvanninh.profile.entity.UserProfile;

@Mapper(componentModel = "spring")
public interface UserProfileMapper {
    UserProfile toUserProfile(ProfileCreationRequest request);

    UserProfileResponse toUserProfileReponse(UserProfile entity);
}