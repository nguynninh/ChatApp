package com.nguyenvanninh.profile.repository;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

import com.nguyenvanninh.profile.entity.UserProfile;

import java.util.Collection;
import java.util.Optional;

@Repository
public interface UserProfileRepository extends Neo4jRepository<UserProfile, String> {
    Optional<UserProfile> findByUserId(String userId);
    Optional<UserProfile> findAllByUserIdIn(Collection<String> userId);
}