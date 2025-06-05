package com.nguyenvanninh.payment.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MomoCreateRequestBody {
    String partnerCode;
    String partnerName;
    String storeId;
    String requestId;
    String amount;
    String orderId;
    String orderInfo;
    String redirectUrl;
    String ipnUrl;
    String lang;
    String requestType;
    Boolean autoCapture;
    String extraData;
    String orderGroupId;
    String signature;
}
