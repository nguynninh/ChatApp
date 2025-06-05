package com.nguyenvanninh.payment.controller;

import com.nguyenvanninh.payment.dto.ApiResponse;
import com.nguyenvanninh.payment.dto.request.MomoCreateRequest;
import com.nguyenvanninh.payment.dto.response.MomoCreateResponse;
import com.nguyenvanninh.payment.service.MomoService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/momo")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MomoController {
    MomoService momoService;

    @PostMapping
    ApiResponse<MomoCreateResponse> create(@RequestBody MomoCreateRequest request){
        var result = momoService.create(request);
        return ApiResponse.<MomoCreateResponse>builder()
                .data(result)
                .message("Create Momo payment successfully")
                .build();
    }
}
