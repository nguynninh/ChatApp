package com.nguyenvanninh.identity.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.nguyenvanninh.identity.dto.request.PermissionRequest;
import com.nguyenvanninh.identity.dto.response.PermissionResponse;
import com.nguyenvanninh.identity.entity.Permission;
import com.nguyenvanninh.identity.mapper.PermissionMapper;
import com.nguyenvanninh.identity.repository.PermissionRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PermissionService {
    PermissionRepository permissionRepository;
    PermissionMapper permissionMapper;

    public PermissionResponse create(PermissionRequest request) {
        Permission permission = permissionMapper.toPermission(request);
        permission = permissionRepository.save(permission);
        return permissionMapper.toPermissionResponse(permission);
    }

    public List<PermissionResponse> getAll() {
        var permissions = permissionRepository.findAll();
        return permissions.stream().map(permissionMapper::toPermissionResponse).toList();
    }

    public void delete(String permission) {
        permissionRepository.deleteById(permission);
    }
}
