package com.nguyenvanninh.chat.service;

import com.nguyenvanninh.chat.constant.ERole;
import com.nguyenvanninh.chat.dto.request.CreateRoomRequest;
import com.nguyenvanninh.chat.dto.response.CreateRoomResponse;
import com.nguyenvanninh.chat.dto.response.GetNameUserProfileResponse;
import com.nguyenvanninh.chat.dto.response.GetRoomsResponse;
import com.nguyenvanninh.chat.entity.Member;
import com.nguyenvanninh.chat.entity.Message;
import com.nguyenvanninh.chat.entity.Room;
import com.nguyenvanninh.chat.mapper.RoomMapper;
import com.nguyenvanninh.chat.repository.MemberRepository;
import com.nguyenvanninh.chat.repository.MessageRepository;
import com.nguyenvanninh.chat.repository.RoomRepository;
import com.nguyenvanninh.chat.repository.custom.MessageRepositoryCustom;
import com.nguyenvanninh.chat.repository.httpclient.ProfileClient;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class RoomService {
    RoomRepository roomRepository;
    ProfileClient profileClient;
    MemberRepository memberRepository;

    MongoTemplate mongoTemplate;

    RoomMapper roomMapper;

    public CreateRoomResponse create(CreateRoomRequest request) {
        if (request.getUserIds().isEmpty() || request.getUserIds().size() < 3)
            throw new RuntimeException("Room must have at least 3 members");

        var context = SecurityContextHolder.getContext();
        String id = context.getAuthentication().getName();

        Room savedRoom;
        try {
            var room = roomMapper.toRoom(request);
            room.setRoomId(UUID.randomUUID().toString());
            room.setLinkShare(UUID.randomUUID().toString());
            savedRoom = roomRepository.save(room);

            List<Member> members = request.getUserIds().stream()
                    .map(userId -> Member.builder()
                            .roomId(savedRoom.getId())
                            .userId(userId)
                            .nickname(null)
                            .role(userId.equals(id)
                                    ? ERole.ADMIN
                                    : ERole.MEMBER)
                            .addById(id)
                            .joinedAt(LocalDateTime.now())
                            .build())
                    .toList();

            memberRepository.saveAll(members);
        } catch (Exception e) {
            throw new RuntimeException("Create room failed");
        }

        return roomMapper.toRoomResponse(savedRoom);
    }

    public void join(String roomToken) {
        var context = SecurityContextHolder.getContext();
        String id = context.getAuthentication().getName();

        var room = roomRepository.findByLinkShare(roomToken);


    }

    public GetRoomsResponse gets(int page, int pageSize) {
        var context = SecurityContextHolder.getContext();
        String userId = context.getAuthentication().getName();

        List<Member> joinedRooms = memberRepository.findByUserId(userId);
        List<String> roomIds = joinedRooms.stream()
                .map(Member::getRoomId)
                .toList();

        if (roomIds.isEmpty())
            return (GetRoomsResponse) List.of();

        Aggregation agg = Aggregation.newAggregation(
                Aggregation.match(Criteria.where("roomId").in(roomIds)),
                Aggregation.sort(Sort.by(Sort.Direction.DESC, "timestamp")),
                Aggregation.group("roomId").first(Aggregation.ROOT).as("lastMessage"),
                Aggregation.replaceRoot("lastMessage"),
                Aggregation.sort(Sort.by(Sort.Direction.DESC, "timestamp")),
                Aggregation.skip((long) page * pageSize),
                Aggregation.limit(pageSize)
        );

        AggregationResults<Message> results = mongoTemplate.aggregate(agg, "messages", Message.class);
        List<Message> latestMessages = results.getMappedResults();

        List<String> selectedRoomIds = latestMessages.stream()
                .map(Message::getRoomId)
                .toList();

        Map<String, Room> rooms = roomRepository.findAllById(selectedRoomIds).stream()
                .collect(Collectors.toMap(Room::getId, r -> r));

        Map<String, Member> memberMap = memberRepository.findByUserIdAndRoomIdIn(userId, selectedRoomIds).stream()
                .collect(Collectors.toMap(Member::getRoomId, m -> m));

        List<String> senderIds = latestMessages.stream()
                .map(Message::getSenderId)
                .distinct()
                .collect(Collectors.toList());

        Map<String, String> senderIdToNameMap = profileClient.getName(senderIds).getProfiles().stream()
                .collect(Collectors.toMap(
                        GetNameUserProfileResponse.Profile::getId,
                        GetNameUserProfileResponse.Profile::getFirstName
                ));


        return (GetRoomsResponse) latestMessages.stream().map(msg -> {
            Room room = rooms.get(msg.getRoomId());
            Member member = memberMap.get(msg.getRoomId());

            return GetRoomsResponse.builder()
                    .id(UUID.randomUUID().toString())
                    .roomId(room.getId())
                    .name(room.getName())
                    .photoUrl(room.getPhotoUrl())
                    .roomType(room.getRoomType())
                    .linkShare(room.getLinkShare())
                    .lastMessage(msg.getContent().toString())
                    .lastMessageSenderName(senderIdToNameMap.getOrDefault(msg.getSenderId(), "Unknown"))
                    .lastMessageStatus(msg.getStatus().name())
                    .lastMessageAt(msg.getTimestamp())
                    .unreadCount(0) // TODO: tính số tin chưa đọc để sau
                    .isNotificationEnabled(member.isNotificationEnabled())
                    .isPinEnabled(member.isPinEnabled())
                    .build();
        }).toList();
    }
}
