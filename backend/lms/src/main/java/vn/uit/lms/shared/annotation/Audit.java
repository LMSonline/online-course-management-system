package vn.uit.lms.shared.annotation;

import vn.uit.lms.shared.constant.AuditAction;
import java.lang.annotation.*;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface Audit {
    String table();
    AuditAction action();
}
