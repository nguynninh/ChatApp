package com.nguyenvanninh.payment.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MomoCreateRequest {
    String amount;
    String orderId;
    String orderInfo;
}
