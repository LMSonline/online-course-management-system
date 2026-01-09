package vn.uit.lms.controller.admin;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import vn.uit.lms.service.system.SystemSettingService;
import vn.uit.lms.shared.dto.ApiResponse;
import vn.uit.lms.shared.dto.request.system.SystemSettingRequest;
import vn.uit.lms.shared.util.annotation.AdminOnly;

import java.time.Instant;

@RestController
@RequestMapping("/api/v1/admin/settings")
@RequiredArgsConstructor
public class SystemSettingController {

    private final SystemSettingService service;

    @GetMapping
    public ApiResponse<?> getAll() {
        return ApiResponse.builder()
                .success(true)
                .status(HttpStatus.OK.value())
                .message("System settings loaded successfully")
                .code("SYSTEM_SETTING_LIST")
                .data(service.getAll())
                .timestamp(Instant.now())
                .meta(ApiResponse.Meta.builder()
                        .author("LMS System")
                        .version("1.0.0")
                        .license("MIT")
                        .build())
                .build();
    }

    @PostMapping
    public ApiResponse<?> create(@RequestBody SystemSettingRequest req) {
        return ApiResponse.builder()
                .success(true)
                .status(HttpStatus.CREATED.value())
                .message("System setting created successfully")
                .code("SYSTEM_SETTING_CREATED")
                .data(service.create(req))
                .timestamp(Instant.now())
                .meta(ApiResponse.Meta.builder()
                        .author("LMS System")
                        .version("1.0.0")
                        .license("MIT")
                        .build())
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<?> update(@PathVariable Long id,
                                 @RequestBody SystemSettingRequest req) {

        return ApiResponse.builder()
                .success(true)
                .status(HttpStatus.OK.value())
                .message("System setting updated successfully")
                .code("SYSTEM_SETTING_UPDATED")
                .data(service.update(id, req))
                .timestamp(Instant.now())
                .meta(ApiResponse.Meta.builder()
                        .author("LMS System")
                        .version("1.0.0")
                        .license("MIT")
                        .build())
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<?> delete(@PathVariable Long id) {

        service.delete(id);

        return ApiResponse.builder()
                .success(true)
                .status(HttpStatus.NO_CONTENT.value())
                .message("System setting deleted")
                .code("SYSTEM_SETTING_DELETED")
                .timestamp(Instant.now())
                .meta(ApiResponse.Meta.builder()
                        .author("LMS System")
                        .version("1.0.0")
                        .license("MIT")
                        .build())
                .build();
    }
}
