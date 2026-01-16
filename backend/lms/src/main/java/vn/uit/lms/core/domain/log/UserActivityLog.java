package vn.uit.lms.core.domain.log;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "user_activity_log")
public class UserActivityLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long accountId;
    private String actionType;
    private String referenceType;
    private String referenceId;

    @Column(columnDefinition = "JSON")
    private String metadata;

}
