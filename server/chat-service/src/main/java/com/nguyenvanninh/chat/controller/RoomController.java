package com.nguyenvanninh.chat.controller;

import com.nguyenvanninh.chat.dto.ApiResponse;
import com.nguyenvanninh.chat.dto.request.CreateRoomRequest;
import com.nguyenvanninh.chat.dto.response.CreateRoomResponse;
import com.nguyenvanninh.chat.dto.response.GetRoomsResponse;
import com.nguyenvanninh.chat.service.RoomService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/rooms")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoomController {
    RoomService roomService;

    @PostMapping
    public ApiResponse<CreateRoomResponse> createRoom(@RequestBody CreateRoomRequest request){
        var room = roomService.create(request);
        return ApiResponse.<CreateRoomResponse>builder()
                .data(room)
                .build();
    }

    @PostMapping("/join/{roomToken}")
    public void joinRoom(@PathVariable String roomToken) {
        roomService.join(roomToken);
    }

    @PostMapping("/leave/{roomId}")
    public void leaveRoom(@PathVariable String roomId) {}

    @GetMapping
    public ApiResponse<GetRoomsResponse> getRooms(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int pageSize
    ) {
        var result = roomService.gets(page, pageSize);
        return ApiResponse.<GetRoomsResponse>builder()
                .data(result)
                .build();
    }

    @GetMapping("/{roomId}")
    public void getRoom(@PathVariable String roomId) {}

    @GetMapping("/room/{roomId}")
    public void getMembersByRoom(@PathVariable String roomId) {}

    @DeleteMapping("/{roomId}")
    public void deleteRoom(@PathVariable String roomId) {}

    @PutMapping("/{roomId}")
    public void updateRoom(@PathVariable String roomId) {}
}
