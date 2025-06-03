package com.nguyenvanninh.chat.mapper;

import com.nguyenvanninh.chat.dto.request.CreateRoomRequest;
import com.nguyenvanninh.chat.dto.response.CreateRoomResponse;
import com.nguyenvanninh.chat.entity.Room;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface RoomMapper {
    CreateRoomResponse toRoomResponse(Room room);

    Room toRoom(CreateRoomRequest request);
}
