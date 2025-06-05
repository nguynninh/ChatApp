package com.nguyenvanninh.payment.repository.htttpclient;

import com.nguyenvanninh.payment.dto.request.MomoCreateRequestBody;
import com.nguyenvanninh.payment.dto.response.MomoCreateResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "momoClient",
        url = "https://test-payment.momo.vn")
public interface MomoClient {
    @PostMapping(value = "/v2/gateway/api/create", consumes = MediaType.APPLICATION_JSON_VALUE)
    MomoCreateResponse createPayment(@RequestBody MomoCreateRequestBody requestBody);
}
