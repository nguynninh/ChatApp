package com.nguyenvanninh.chat.service;

import com.nguyenvanninh.chat.constant.EMessageStatus;
import com.nguyenvanninh.chat.constant.EMessageType;
import com.nguyenvanninh.chat.constant.ERoomType;
import com.nguyenvanninh.chat.dto.request.SendMessageRequest;
import com.nguyenvanninh.chat.dto.response.SendMessageResponse;
import com.nguyenvanninh.chat.dto.response.UserProfileExistResponse;
import com.nguyenvanninh.chat.entity.Member;
import com.nguyenvanninh.chat.entity.Message;
import com.nguyenvanninh.chat.entity.Room;
import com.nguyenvanninh.chat.entity.content.ImageContent;
import com.nguyenvanninh.chat.entity.content.TextContent;
import com.nguyenvanninh.chat.mapper.MessageMapper;
import com.nguyenvanninh.chat.repository.MemberRepository;
import com.nguyenvanninh.chat.repository.MessageRepository;
import com.nguyenvanninh.chat.repository.RoomRepository;
import com.nguyenvanninh.chat.repository.httpclient.ProfileClient;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class MessageService {
    MessageRepository messageRepository;
    RoomRepository roomRepository;
    MemberRepository memberRepository;

    ProfileClient profileClient;

    MessageMapper messageMapper;

    public SendMessageResponse send(SendMessageRequest request) {
        if (request.getContent() == null)
            throw new RuntimeException("Message content is required");

        var context = SecurityContextHolder.getContext();
        String senderId = context.getAuthentication().getName();
        String inputRoomId = request.getRoomId();

        if (inputRoomId == null || inputRoomId.isEmpty())
            throw new RuntimeException("Room id is required");

        String resolvedRoomId;

        // B1: Kiểm tra xem inputRoomId có phải room thật không
        Optional<Room> existingRoom = roomRepository.findById(inputRoomId);
        if (existingRoom.isPresent())
            // Dùng luôn nếu tồn tại
            resolvedRoomId = existingRoom.get().getId();
        else {
            // B2: Nếu không phải room, kiểm tra xem có phải là userId
            UserProfileExistResponse recipientOpt =
                    profileClient.checkUsersHaveProfiles(List.of(inputRoomId));
            if (recipientOpt.getUsers().isEmpty())
                throw new RuntimeException("Invalid room id: neither a room nor a user.");

            // B3: Tìm room cá nhân giữa sender và recipient
            Optional<Room> privateRoom = roomRepository.findPrivateRoom(senderId, inputRoomId);
            if (privateRoom.isPresent())
                resolvedRoomId = privateRoom.get().getId();
            else {
                // B4: Chưa có thì tạo room cá nhân
                Room newRoom = Room.builder()
                        .roomId(UUID.randomUUID().toString())
                        .roomType(ERoomType.PERSONAL)
                        .build();

                Member member1 = Member.builder()
                        .roomId(newRoom.getRoomId())
                        .userId(senderId)
                        .nickname(null)
                        .addById(senderId)
                        .build();

                Member member2 = Member.builder()
                        .roomId(newRoom.getRoomId())
                        .userId(inputRoomId)
                        .nickname(null)
                        .addById(senderId)
                        .build();

                roomRepository.save(newRoom);
                memberRepository.saveAll(List.of(member1, member2));

                resolvedRoomId = newRoom.getRoomId();
            }
        }

        // B5: Xử lý content và lưu message
        Message message;
        if (request.getContent() instanceof TextContent textContent) {
            textContent.setText(textContent.getText().trim());
            if (textContent.getText().isEmpty())
                throw new RuntimeException("Text content is empty");

            message = Message.builder()
                    .senderId(senderId)
                    .roomId(resolvedRoomId)
                    .content(textContent)
                    .type(EMessageType.TEXT)
                    .status(EMessageStatus.SENT)
                    .build();

        } else if (request.getContent() instanceof ImageContent imageContent) {
            imageContent.setUrl(imageContent.getUrl().trim());
            if (imageContent.getUrl().isEmpty())
                throw new RuntimeException("Image URL is empty");

            message = Message.builder()
                    .senderId(senderId)
                    .roomId(resolvedRoomId)
                    .content(imageContent)
                    .type(EMessageType.IMAGE)
                    .status(EMessageStatus.SENT)
                    .build();

        } else throw new RuntimeException("Unsupported message type");

        return messageMapper.toSendMessageResponse(
                messageRepository.save(message));
    }

    public Message getMessagesById(String messageId) {
        return messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));
    }

    public List<Message> getMessagesByRoom(String roomId) {
        return messageRepository.findAllByRoomId(roomId);
    }
}
