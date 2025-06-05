package com.nguyenvanninh.payment.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MomoCreateResponse {
    String payUrl;
    String deeplink;
    int resultCode;
    String message;
}
