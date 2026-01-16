package vn.uit.lms.shared.aop;

import lombok.RequiredArgsConstructor;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;
import vn.uit.lms.shared.util.HibernateFilterUtils;

@Aspect
@Component
@RequiredArgsConstructor
public class HibernateFilterAspect {

    private final HibernateFilterUtils hibernateFilterUtils;

    @Around("@annotation(vn.uit.lms.shared.annotation.EnableSoftDeleteFilter)")
    public Object aroundEnableSoftDelete(ProceedingJoinPoint joinPoint) throws Throwable {
        try {
            hibernateFilterUtils.enableSoftDeleteFilter();
            return joinPoint.proceed();
        } finally {
            hibernateFilterUtils.disableSoftDeleteFilter();
        }
    }
}

