package com.nguyenvanninh.payment.service;

import com.nguyenvanninh.payment.dto.request.MomoCreateRequest;
import com.nguyenvanninh.payment.dto.request.MomoCreateRequestBody;
import com.nguyenvanninh.payment.dto.response.MomoCreateResponse;
import com.nguyenvanninh.payment.repository.htttpclient.MomoClient;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class MomoService {
    MomoClient momoClient;

    @NonFinal
    @Value("${app.payment.momo.accessKey}")
    protected String ACCESS_KEY;

    @NonFinal
    @Value("${app.payment.momo.secretKey}")
    protected String SECRET_KEY;

    @NonFinal
    @Value("${app.payment.momo.redirectUrl}")
    protected String REDIRECT_URL;

    @NonFinal
    @Value("${app.payment.momo.language}")
    protected String LANGUAGE;

    public MomoCreateResponse create(MomoCreateRequest request) {
        String partnerCode = "MOMO";
        String requestType = "payWithMethod";
        String ipnUrl = "https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b";
        Boolean autoCapture = true;
        String requestId = UUID.randomUUID().toString();

        String rawSignature =
                "accessKey=" + ACCESS_KEY
                        + "&amount=" + request.getAmount()
                        + "&extraData="
                        + "&ipnUrl=" + ipnUrl
                        + "&orderId=" + request.getOrderId()
                        + "&orderInfo=" + request.getOrderInfo()
                        + "&partnerCode=" + partnerCode
                        + "&redirectUrl=" + REDIRECT_URL
                        + "&requestId=" + requestId
                        + "&requestType=" + requestType;

        String signature = generateSignature(rawSignature, SECRET_KEY);

        MomoCreateRequestBody requestBody = MomoCreateRequestBody.builder()
                .partnerCode(partnerCode)
                .partnerName("Test")
                .storeId("MomoTestStore")
                .requestId(requestId)
                .amount(request.getAmount())
                .orderId(request.getOrderId())
                .orderInfo(request.getOrderInfo())
                .redirectUrl(REDIRECT_URL)
                .ipnUrl(ipnUrl)
                .lang(LANGUAGE)
                .requestType(requestType)
                .autoCapture(autoCapture)
                .extraData("")
                .orderGroupId("")
                .signature(signature)
                .build();

        return momoClient.createPayment(requestBody);
    }


    private String generateSignature(String data, String secretKey) {
        try {
            Mac hmacSHA256 = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            hmacSHA256.init(secretKeySpec);
            byte[] hash = hmacSHA256.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : hash) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate HMAC SHA256 signature", e);
        }
    }
}