package com.app.backend.entities;

import com.app.backend.common.enums.RecordType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.type.PostgreSQLEnumJdbcType;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "customers", schema = "business")
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @NotNull
    @ColumnDefault("uuidv7()")
    @Column(name = "uuid", nullable = false)
    private UUID uuid;

    @Size(max = 50)
    @NotNull
    @Column(name = "code", nullable = false, length = 50)
    private String code;

    @Size(max = 255)
    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @Size(max = 30)
    @Column(name = "phone", length = 30)
    private String phone;

    @Size(max = 255)
    @Column(name = "email")
    private String email;

    @Column(name = "address", length = Integer.MAX_VALUE)
    private String address;

    @Size(max = 50)
    @Column(name = "rank_name", length = 50)
    private String rankName;

    @ColumnDefault("0")
    @Column(name = "debt_amount", nullable = false, precision = 18, scale = 2)
    private BigDecimal debtAmount;

    @ColumnDefault("'active'")
    @Enumerated(EnumType.STRING)
    @JdbcType(PostgreSQLEnumJdbcType.class)
    @Column(name = "status", columnDefinition = "record_type not null")
    private RecordType status;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;
}
