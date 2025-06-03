package com.nguyenvanninh.identity.service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;

//import com.nguyenvanninh.event.dto.NotificationEvent;
import com.nguyenvanninh.identity.constant.LoginType;
import com.nguyenvanninh.identity.repository.httpclient.ProfileClient;
import org.springframework.dao.DataIntegrityViolationException;
//import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.nguyenvanninh.identity.constant.PredefinedRole;
import com.nguyenvanninh.identity.dto.request.UserCreationRequest;
import com.nguyenvanninh.identity.dto.request.UserUpdateRequest;
import com.nguyenvanninh.identity.dto.response.UserResponse;
import com.nguyenvanninh.identity.entity.Role;
import com.nguyenvanninh.identity.entity.User;
import com.nguyenvanninh.identity.exception.AppException;
import com.nguyenvanninh.identity.exception.ErrorCode;
import com.nguyenvanninh.identity.mapper.ProfileMapper;
import com.nguyenvanninh.identity.mapper.UserMapper;
import com.nguyenvanninh.identity.repository.RoleRepository;
import com.nguyenvanninh.identity.repository.UserRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class UserService {
    UserRepository userRepository;
    RoleRepository roleRepository;
    UserMapper userMapper;
    ProfileMapper profileMapper;
    PasswordEncoder passwordEncoder;
    ProfileClient profileClient;
//    KafkaTemplate<String, Object> kafkaTemplate;

    public UserResponse createUser(UserCreationRequest request) {
        User user = userMapper.toUser(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        HashSet<Role> roles = new HashSet<>();

        roleRepository.findById(PredefinedRole.USER_ROLE)
                .ifPresent(roles::add);

        user.setRoles(roles);
        user.setEmailVerified(false);

        try {
            user = userRepository.save(user);
        } catch (DataIntegrityViolationException exception){
            throw new AppException(ErrorCode.USER_EXISTED);
        }

        var profileRequest = profileMapper.toProfileCreationRequest(request);
        profileRequest.setUserId(user.getId());

        var profile = profileClient.createProfile(profileRequest);

        var userCreationResponse = userMapper.toUserResponse(user);
        userCreationResponse.setId(profile.getData().getId());

        return userCreationResponse;
    }

    public UserResponse getMyInfo() {
        var context = SecurityContextHolder.getContext();
        String id = context.getAuthentication().getName();

        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        return userMapper.toUserResponse(user);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public UserResponse updateUser(String userId, UserUpdateRequest request) {
        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        userMapper.updateUser(user, request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        var roles = roleRepository.findAllById(request.getRoles());
        user.setRoles(new HashSet<>(roles));

        return userMapper.toUserResponse(userRepository.save(user));
    }

    @PreAuthorize("hasRole('ADMIN')")
    public void deleteUser(String userId) {
        userRepository.deleteById(userId);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public List<UserResponse> getUsers() {
        log.info("In method get Users");
        return userRepository.findAll()
                .stream()
                .map(userMapper::toUserResponse)
                .toList();
    }

    @PreAuthorize("hasRole('ADMIN')")
    public UserResponse getUser(String id) {
        return userMapper.toUserResponse(
                userRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED)));
    }

    public User createUserFromSocial(UserCreationRequest request, String loginType) {
        Optional<User> existingUserOpt = userRepository.findByEmail(request.getEmail());

        if (existingUserOpt.isPresent()) {
            User existingUser = existingUserOpt.get();

            if (loginType.equalsIgnoreCase(LoginType.GOOGLE))
                existingUser.setLoginByGoogle(true);
            else if (loginType.equalsIgnoreCase(LoginType.FACEBOOK))
                existingUser.setLoginByFacebook(true);

            return userRepository.save(existingUser);
        }

        return userMapper.toUser(createUser(request));
    }
}
