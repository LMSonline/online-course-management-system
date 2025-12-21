package vn.uit.lms.core.domain.community.notification;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import vn.uit.lms.core.domain.Account;
import vn.uit.lms.shared.entity.BaseEntity;

import java.time.Instant;

@Entity
@Getter
@Setter
@Table(name = "notification")
public class Notification extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "recipient_account_id")
    private Account recipient;

    @Column(nullable = false, length = 128)
    private String type;

    @Column(length = 255)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(name = "reference_type", length = 64)
    private String referenceType;

    @Column(name = "reference_id", length = 128)
    private String referenceId;

    @Column(name = "is_read")
    private Boolean isRead = false;

    @Column(name = "delivered_at")
    private Instant deliveredAt;

}
