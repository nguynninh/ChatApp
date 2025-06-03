package com.nguyenvanninh.chat.repository;

import com.nguyenvanninh.chat.entity.Room;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoomRepository extends MongoRepository<Room, String> {
    List<Room> findByCreateBy(String userId);
    Optional<Room> findPrivateRoom(String senderId, String recipientId);
    Optional<Room> findByLinkShare(String roomId);
}
