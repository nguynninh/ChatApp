package com.nguyenvanninh.identity.service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.concurrent.TimeUnit;

import com.nguyenvanninh.identity.constant.LoginType;
import com.nguyenvanninh.identity.dto.request.*;
import com.nguyenvanninh.identity.dto.response.*;
import com.nguyenvanninh.identity.entity.ResetPassword;
import com.nguyenvanninh.identity.repository.ResetPasswordRepository;
import com.nguyenvanninh.identity.repository.httpclient.FacebookAccessTokenClient;
import com.nguyenvanninh.identity.repository.httpclient.FacebookUserInfoClient;
import com.nguyenvanninh.identity.repository.httpclient.GoogleAccessTokenClient;
import com.nguyenvanninh.identity.repository.httpclient.GoogleUserInfoClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.nguyenvanninh.identity.entity.InvalidatedToken;
import com.nguyenvanninh.identity.entity.User;
import com.nguyenvanninh.identity.exception.AppException;
import com.nguyenvanninh.identity.exception.ErrorCode;
import com.nguyenvanninh.identity.repository.InvalidatedTokenRepository;
import com.nguyenvanninh.identity.repository.UserRepository;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationService {
    UserRepository userRepository;
    UserService userService;
    InvalidatedTokenRepository invalidatedTokenRepository;
    ResetPasswordRepository resetPasswordRepository;

    GoogleAccessTokenClient googleAccessTokenClient;
    FacebookAccessTokenClient facebookAccessTokenClient;
    GoogleUserInfoClient googleUserInfoClient;
    FacebookUserInfoClient facebookUserInfoClient;

    PasswordEncoder passwordEncoder;

    @NonFinal
    @Value("${jwt.signerKey}")
    protected String SIGNER_KEY;

    @NonFinal
    @Value("${jwt.refreshKey}")
    protected String REFRESH_KEY;

    @NonFinal
    @Value("${jwt.valid-duration}")
    protected long VALID_DURATION;

    @NonFinal
    @Value("${jwt.refreshable-duration}")
    protected long REFRESHABLE_DURATION;

    @NonFinal
    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    protected String GOOGLE_CLIENT_ID;

    @NonFinal
    @Value("${spring.security.oauth2.client.registration.google.client-secret}")
    protected String GOOGLE_CLIENT_SECRET;

    @NonFinal
    @Value("${spring.security.oauth2.client.registration.google.redirect-uri}")
    protected String GOOGLE_REDIRECT_URI;

    @NonFinal
    @Value("${spring.security.oauth2.client.registration.facebook.client-id}")
    protected String FACEBOOK_CLIENT_ID;

    @NonFinal
    @Value("${spring.security.oauth2.client.registration.facebook.client-secret}")
    protected String FACEBOOK_CLIENT_SECRET;

    @NonFinal
    @Value("${spring.security.oauth2.client.registration.facebook.redirect-uri}")
    protected String FACEBOOK_REDIRECT_URI;

    public IntrospectResponse introspect(IntrospectRequest request) {
        var token = request.getToken();
        boolean isValid = true;

        try {
            verifyToken(token, false);
        } catch (AppException | JOSEException | ParseException e) {
            isValid = false;
        }

        return IntrospectResponse.builder().valid(isValid).build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        var user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        boolean authenticated = passwordEncoder.matches(request.getPassword(), user.getPassword());
        if (!authenticated)
            throw new AppException(ErrorCode.UNAUTHENTICATED);

        return AuthenticationResponse.builder()
                .token(generateToken(user, SIGNER_KEY, VALID_DURATION))
                .refreshToken(generateToken(user, REFRESH_KEY, REFRESHABLE_DURATION))
                .build();
    }

    public SocialResponse sociallyAuthenticate(String loginType) {
        if (loginType.equalsIgnoreCase(LoginType.GOOGLE)) {
            return SocialResponse.builder()
                    .redirectUrl("https://accounts.google.com/o/oauth2/v2/auth?"
                            + "client_id=" + GOOGLE_CLIENT_ID
                            + "&redirect_uri=" + URLEncoder.encode(GOOGLE_REDIRECT_URI, StandardCharsets.UTF_8)
                            + "&response_type=code"
                            + "&scope=" + "openid%20profile%20email")
                    .build();
        }

        if (loginType.equalsIgnoreCase(LoginType.FACEBOOK)) {
            return SocialResponse.builder()
                    .redirectUrl("https://www.facebook.com/v2.12/dialog/oauth?"
                            + "client_id=" + FACEBOOK_CLIENT_ID
                            + "&redirect_uri=" + FACEBOOK_REDIRECT_URI
                            + "&response_type=" + "code"
                            + "&scope=email public_profile")
                    .build();
        }

        throw new IllegalArgumentException("Unsupported social login type");
    }

    public AuthenticationResponse sociallyAuthenticateCallback(
            String code,
            String loginType
    ) {
        String accessToken;
        UserCreationRequest userCreationRequest;

        if (loginType.equalsIgnoreCase(LoginType.GOOGLE)) {
            MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
            form.add("code", code);
            form.add("client_id", GOOGLE_CLIENT_ID);
            form.add("client_secret", GOOGLE_CLIENT_SECRET);
            form.add("redirect_uri", GOOGLE_REDIRECT_URI);
            form.add("grant_type", "authorization_code");

            accessToken = googleAccessTokenClient.getAccessToken(form)
                    .getAccessToken();
            var userInfo = googleUserInfoClient.getUserInfo("Bearer " + accessToken);

            userCreationRequest = UserCreationRequest.builder()
                    .email((String) userInfo.get("email"))
                    .firstName((String) userInfo.get("given_name"))
                    .lastName((String) userInfo.get("family_name"))
                    .photoUrl((String) userInfo.get("picture"))
                    .build();
        } else if (loginType.equalsIgnoreCase(LoginType.FACEBOOK)) {
            accessToken = facebookAccessTokenClient.getAccessToken(
                    FACEBOOK_CLIENT_ID,
                    FACEBOOK_REDIRECT_URI,
                    FACEBOOK_CLIENT_SECRET,
                    code
            ).getAccessToken();
            Map<String, Object> userInfo = facebookUserInfoClient.getUserInfo(
                    "id,first_name,last_name,email,picture",
                    accessToken
            );

            String photoUrl = null;
            if (userInfo.containsKey("picture")) {
                Map<String, Object> picture = (Map<String, Object>) userInfo.get("picture");
                if (picture.containsKey("data")) {
                    Map<String, Object> data = (Map<String, Object>) picture.get("data");
                    photoUrl = (String) data.get("url");
                }
            }

            userCreationRequest = UserCreationRequest.builder()
                    .email((String) userInfo.get("email"))
                    .firstName((String) userInfo.get("first_name"))
                    .lastName((String) userInfo.get("last_name"))
                    .photoUrl(photoUrl)
                    .build();
        } else throw new IllegalArgumentException("Unsupported social login type");

        var user = userService.createUserFromSocial(userCreationRequest, loginType);

        return AuthenticationResponse.builder()
                .token(generateToken(user, SIGNER_KEY, VALID_DURATION))
                .refreshToken(generateToken(user, REFRESH_KEY, REFRESHABLE_DURATION))
                .build();
    }

    public void logout(LogoutRequest request) throws ParseException, JOSEException {
        try {
            var signToken = verifyToken(request.getToken(), true);

            String jit = signToken.getJWTClaimsSet().getJWTID();
            Date expiryTime = signToken.getJWTClaimsSet().getExpirationTime();

            InvalidatedToken invalidatedToken =
                    InvalidatedToken.builder().id(jit).expiryTime(expiryTime).build();

            invalidatedTokenRepository.save(invalidatedToken);
        } catch (AppException exception) {
            log.info("Token already expired");
        }
    }

    public AuthenticationResponse refreshToken(RefreshRequest request) throws ParseException, JOSEException {
        var signedJWT = verifyToken(request.getToken(), true);

        var jit = signedJWT.getJWTClaimsSet().getJWTID();
        var expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime();

        InvalidatedToken invalidatedToken =
                InvalidatedToken.builder().id(jit).expiryTime(expiryTime).build();

        invalidatedTokenRepository.save(invalidatedToken);

        var username = signedJWT.getJWTClaimsSet().getSubject();

        var user =
                userRepository.findByEmail(username).orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));

        return AuthenticationResponse.builder()
                .token(generateToken(user, SIGNER_KEY, VALID_DURATION))
                .refreshToken(generateToken(user, REFRESH_KEY, REFRESHABLE_DURATION))
                .build();
    }

    public void forgotPassword(ForgotPasswordRequest request) {
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        var resetPassword = ResetPassword.builder()
                .email(user.getEmail())
                .token(UUID.randomUUID().toString())
                .code(generateResetCode())
                .failedAttempts(3)
                .expiration(TimeUnit.MINUTES.toSeconds(5))
                .build();

        resetPasswordRepository.save(resetPassword);
    }

    public ResetPasswordResponse resetPassword(ResetPasswordRequest request) {
        ResetPassword resetPassword;
        if (request.getEmail() != null && !request.getEmail().isEmpty()) {
            resetPassword = resetPasswordRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new AppException(ErrorCode.CODE_RESET_PASSWORD_NOT_EXISTED));

            if (resetPassword.getFailedAttempts() <= 0) {
                resetPasswordRepository.delete(resetPassword);
                throw new AppException(ErrorCode.CODE_RESET_PASSWORD_NOT_EXISTED);
            }

            if (!Objects.equals(resetPassword.getCode(), request.getToken())) {
                resetPassword.setFailedAttempts(resetPassword.getFailedAttempts() - 1);
                resetPasswordRepository.save(resetPassword);
                return ResetPasswordResponse.builder()
                        .success(false)
                        .remainingAttempts(resetPassword.getFailedAttempts())
                        .build();
            }

            var user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

            user.setPassword(passwordEncoder.encode(request.getPassword()));
            userRepository.save(user);

        } else {
            resetPassword = resetPasswordRepository.findByToken(request.getToken())
                    .orElseThrow(() -> new AppException(ErrorCode.TOKEN_RESET_PASSWORD_NOT_EXISTED));

            var user = userRepository.findByEmail(resetPassword.getEmail())
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

            user.setPassword(passwordEncoder.encode(request.getPassword()));
            userRepository.save(user);

        }
        resetPasswordRepository.delete(resetPassword);
        return ResetPasswordResponse.builder()
                .success(true)
                .build();
    }

    private String generateToken(User user, String key, long duration) {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);

        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(user.getId())
                .issuer("nguyenvanninh.id.vn")
                .issueTime(new Date())
                .expirationTime(new Date(
                        Instant.now().plus(duration, ChronoUnit.SECONDS).toEpochMilli()
                ))
                .jwtID(UUID.randomUUID().toString())
                .claim("scope", buildScope(user))
                .build();

        Payload payload = new Payload(jwtClaimsSet.toJSONObject());

        JWSObject jwsObject = new JWSObject(header, payload);

        try {
            jwsObject.sign(new MACSigner(key.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            log.error("Cannot create token", e);
            throw new RuntimeException(e);
        }
    }

    private SignedJWT verifyToken(String token, boolean isRefresh) throws JOSEException, ParseException {
        JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());

        SignedJWT signedJWT = SignedJWT.parse(token);

        Date expiryTime = (isRefresh)
                ? new Date(signedJWT.getJWTClaimsSet().getIssueTime()
                .toInstant().plus(REFRESHABLE_DURATION, ChronoUnit.SECONDS).toEpochMilli())
                : signedJWT.getJWTClaimsSet().getExpirationTime();

        var verified = signedJWT.verify(verifier);

        if (!(verified && expiryTime.after(new Date()))) throw new AppException(ErrorCode.UNAUTHENTICATED);

        if (invalidatedTokenRepository.existsById(signedJWT.getJWTClaimsSet().getJWTID()))
            throw new AppException(ErrorCode.UNAUTHENTICATED);

        return signedJWT;
    }

    private String buildScope(User user) {
        StringJoiner stringJoiner = new StringJoiner(" ");

        if (!CollectionUtils.isEmpty(user.getRoles()))
            user.getRoles().forEach(role -> {
                stringJoiner.add("ROLE_" + role.getName());
                if (!CollectionUtils.isEmpty(role.getPermissions()))
                    role.getPermissions().forEach(permission -> stringJoiner.add(permission.getName()));
            });

        return stringJoiner.toString();
    }

    private record TokenInfo(String token, Date expiryDate) {
    }

    private String generateResetCode() {
        int code = 100_000 + new SecureRandom().nextInt(900_000); // [100000, 999999]
        return String.valueOf(code);
    }
}
