package vn.uit.lms.core.domain.system;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import vn.uit.lms.shared.entity.BaseEntity;

@Getter
@Setter
@Entity
@Table(name = "system_setting")
public class SystemSetting extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "key_name", nullable = false, unique = true)
    private String keyName;

    @Column(columnDefinition = "TEXT")
    private String value;

    @Column(columnDefinition = "TEXT")
    private String description;
}
