package vn.uit.lms.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.server.resource.web.BearerTokenAuthenticationEntryPoint;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;
import vn.uit.lms.shared.constant.ErrorCode;
import vn.uit.lms.shared.dto.ApiResponse;

import java.io.IOException;
import java.time.Instant;
import java.util.Optional;

@Component
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final AuthenticationEntryPoint delegate = new BearerTokenAuthenticationEntryPoint();

    private final ObjectMapper mapper;

    public CustomAuthenticationEntryPoint(ObjectMapper mapper) {
        this.mapper = mapper;
    }

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {
        this.delegate.commence(request, response, authException);
        response.setContentType("application/json;charset=UTF-8");

        ApiResponse<Object> res= new ApiResponse<>();
        res.setStatus(HttpStatus.UNAUTHORIZED.value());
        String errorMessage = Optional.ofNullable(authException.getCause())
                .map(Throwable::getMessage).orElse(authException.getMessage());
        res.setMessage("Token is not valid: " + errorMessage);
        res.setCode(ErrorCode.UNAUTHORIZED);
        res.setSuccess(Boolean.FALSE);
        res.setTimestamp(Instant.now());
        mapper.writeValue(response.getWriter(), res);



    }
}