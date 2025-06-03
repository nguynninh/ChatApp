package com.nguyenvanninh.chat.repository;

import com.nguyenvanninh.chat.entity.Member;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface MemberRepository extends MongoRepository<Member, String> {
    List<Member> findByRoomId(String roomId);
    Optional<Member> findByRoomIdAndUserId(String roomId, String userId);

    List<Member> findByUserId(String userId);

    List<Member> findByUserIdAndRoomIdIn(String userId, Collection<String> roomId);
}
