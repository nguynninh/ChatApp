package com.nguyenvanninh.chat.mapper;

import com.nguyenvanninh.chat.dto.response.SendMessageResponse;
import com.nguyenvanninh.chat.entity.Message;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface MessageMapper {
    SendMessageResponse toSendMessageResponse(Message message);
}