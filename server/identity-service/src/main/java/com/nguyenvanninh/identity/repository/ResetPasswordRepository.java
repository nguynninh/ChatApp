package com.nguyenvanninh.identity.repository;

import com.nguyenvanninh.identity.entity.ResetPassword;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ResetPasswordRepository extends CrudRepository<ResetPassword, String> {
    Optional<ResetPassword> findByToken(String token);
    Optional<ResetPassword> findByEmail(String email);
}
