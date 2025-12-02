package vn.uit.lms.shared.aop;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.*;
import org.aspectj.lang.annotation.*;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;
import vn.uit.lms.core.entity.log.AuditLog;
import vn.uit.lms.core.repository.log.AuditLogRepository;
import vn.uit.lms.shared.annotation.Audit;
import vn.uit.lms.shared.constant.AuditAction;
import vn.uit.lms.shared.util.SecurityUtils;

import java.time.LocalDateTime;
import java.util.Optional;

@Slf4j
@Aspect
@Component
@RequiredArgsConstructor
public class AuditAspect {

    private final AuditLogRepository auditRepo;
    private final AuditHelper helper;
    private final HttpServletRequest request;

    @Around("@annotation(vn.uit.lms.shared.annotation.Audit)")
    public Object audit(ProceedingJoinPoint joinPoint) throws Throwable {

        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Audit audit = signature.getMethod().getAnnotation(Audit.class);

        String table = audit.table();
        AuditAction action = audit.action();

        Object result = joinPoint.proceed();

        String recordId = extractRecordId(result);
        String ip = request.getRemoteAddr();
        Optional<Long> userId = SecurityUtils.getCurrentUserId();

        AuditLog logEntry = new AuditLog();
        logEntry.setAction(action);
        logEntry.setIpAddress(ip);
        logEntry.setRecordId(recordId);
        logEntry.setTableName(table);
        logEntry.setUserAccountId(userId.orElse(null));

        // changedData = đối tượng mới (JSON)
        logEntry.setChangedData(helper.toJson(result));
        logEntry.setCreatedAt(LocalDateTime.now());

        auditRepo.save(logEntry);

        return result;
    }

    private String extractRecordId(Object result) {
        if (result == null) return null;

        try {
            var idField = result.getClass().getDeclaredField("id");
            idField.setAccessible(true);
            return String.valueOf(idField.get(result));
        } catch (Exception e) {
            return null;
        }
    }
}
