package com.nguyenvanninh.chat.controller;

import com.nguyenvanninh.chat.dto.ApiResponse;
import com.nguyenvanninh.chat.dto.request.SendMessageRequest;
import com.nguyenvanninh.chat.dto.response.SendMessageResponse;
import com.nguyenvanninh.chat.entity.Message;
import com.nguyenvanninh.chat.service.MessageService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/messages")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MessageController {
    MessageService messageService;

    @PostMapping
    ApiResponse<SendMessageResponse> sendMessage(@RequestBody SendMessageRequest request) {
        var message = messageService.send(request);
        return ApiResponse.<SendMessageResponse>builder()
                .data(message)
                .build();
    }

    @GetMapping("/{messageId}")
    public ApiResponse<Message> getMessage(
            @PathVariable String messageId) {
        var message = messageService.getMessagesById(messageId);
        return ApiResponse.<Message>builder()
                .data(message)
                .build();
    }

    @GetMapping("/room/{roomId}")
    public ApiResponse<List<Message>> getMessagesByRoom(
            @PathVariable String roomId,
            @RequestParam(defaultValue = "0") Integer start,
            @RequestParam(defaultValue = "10") Integer limit,
            @RequestParam(defaultValue = "false") Boolean reverse) {
        var messages = messageService.getMessagesByRoom(roomId);

        return ApiResponse.<List<Message>>builder()
                .data(messages)
                .build();
    }
}
