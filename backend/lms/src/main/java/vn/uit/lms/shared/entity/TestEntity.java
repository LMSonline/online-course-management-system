package vn.uit.lms.shared.entity;

import jakarta.persistence.*;
import lombok.Data;


@Data
@lombok.EqualsAndHashCode(callSuper=false)
@Entity
public class TestEntity extends BaseEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private int age;

}
