package com.nguyenvanninh.chat.repository;

import com.nguyenvanninh.chat.entity.Message;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends MongoRepository<Message, String> {
    List<Message> findAllByRoomId(String roomId);

    List<Message> findAllByRoomIdOrderByTimestampAsc(String roomId, String userId);
}
