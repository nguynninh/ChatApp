package com.nguyenvanninh.profile.service;

import com.nguyenvanninh.profile.dto.request.GetProfileByNameRequest;
import com.nguyenvanninh.profile.dto.request.UserProfileExistRequest;
import com.nguyenvanninh.profile.dto.response.GetProfileByNameResponse;
import com.nguyenvanninh.profile.dto.response.UserProfileResponse;
import com.nguyenvanninh.profile.dto.response.UserProfileExistResponse;
import com.nguyenvanninh.profile.exception.AppException;
import com.nguyenvanninh.profile.exception.ErrorCode;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.nguyenvanninh.profile.dto.request.ProfileCreationRequest;
import com.nguyenvanninh.profile.entity.UserProfile;
import com.nguyenvanninh.profile.mapper.UserProfileMapper;
import com.nguyenvanninh.profile.repository.UserProfileRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class UserProfileService {
    UserProfileRepository userProfileRepository;
    UserProfileMapper userProfileMapper;

    public UserProfileResponse createProfile(ProfileCreationRequest request) {
        UserProfile userProfile = userProfileMapper.toUserProfile(request);
        userProfile = userProfileRepository.save(userProfile);

        return userProfileMapper.toUserProfileReponse(userProfile);
    }

    public UserProfileResponse getByUserId(String userId) {
        UserProfile userProfile =
                userProfileRepository.findByUserId(userId)
                        .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        return userProfileMapper.toUserProfileReponse(userProfile);
    }

    public UserProfileResponse getProfile(String id) {
        UserProfile userProfile =
                userProfileRepository.findById(id).orElseThrow(
                        () -> new AppException(ErrorCode.USER_NOT_EXISTED));

        return userProfileMapper.toUserProfileReponse(userProfile);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public List<UserProfileResponse> getAllProfiles() {
        var profiles = userProfileRepository.findAll();

        return profiles.stream().map(userProfileMapper::toUserProfileReponse).toList();
    }

    public UserProfileResponse getMyProfile() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication.getName();

        var profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        return userProfileMapper.toUserProfileReponse(profile);
    }

    public UserProfileExistResponse checkUsersHaveProfiles(UserProfileExistRequest request) {
        List<String> userIds = request.getUserIds();

        Set<String> existedSet = userProfileRepository.findAllByUserIdIn(userIds)
                .stream()
                .map(UserProfile::getUserId)
                .collect(Collectors.toSet());

        Map<String, Boolean> usersStatus = new HashMap<>();
        int success = 0;
        int failed = 0;

        for (String userId : userIds) {
            boolean hasProfile = existedSet.contains(userId);
            usersStatus.put(userId, hasProfile);
            if (hasProfile) {
                success++;
            } else {
                failed++;
            }
        }

        return UserProfileExistResponse.builder()
                .quantity(userIds.size())
                .success(success)
                .failed(failed)
                .users(usersStatus)
                .build();
    }

    public GetProfileByNameResponse getNames(GetProfileByNameRequest request) {
        List<String> userIds = request.getUserIds();

        Optional<UserProfile> userProfiles = userProfileRepository
                .findAllByUserIdIn(userIds);

        List<GetProfileByNameResponse.Profile> profiles = userProfiles.stream()
                .map(profile -> {
                    GetProfileByNameResponse.Profile p = new GetProfileByNameResponse.Profile();
                    p.setId(profile.getUserId());
                    p.setFirstName(profile.getFirstName());
                    p.setLastName(profile.getLastName());
                    return p;
                })
                .collect(Collectors.toList());

        GetProfileByNameResponse response = new GetProfileByNameResponse();
        response.setProfiles(profiles);
        return response;
    }
}
