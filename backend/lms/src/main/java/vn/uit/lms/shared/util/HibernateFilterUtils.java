package vn.uit.lms.shared.util;

import jakarta.persistence.EntityManager;
import org.hibernate.Filter;
import org.hibernate.Session;
import org.springframework.stereotype.Component;

@Component
public class HibernateFilterUtils {

    private final EntityManager entityManager;

    public HibernateFilterUtils(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    public void enableSoftDeleteFilter() {
        Session session = entityManager.unwrap(Session.class);
        session.enableFilter("deletedFilter");
    }

    public void disableSoftDeleteFilter() {
        Session session = entityManager.unwrap(Session.class);
        session.disableFilter("deletedFilter");
    }
}

