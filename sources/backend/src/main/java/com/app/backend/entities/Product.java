package com.app.backend.entities;

import com.app.backend.common.enums.RecordType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.JdbcType;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.hibernate.dialect.type.PostgreSQLEnumJdbcType;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "products", schema = "catalog")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @NotNull
    @ColumnDefault("uuidv7()")
    @Column(name = "uuid", nullable = false)
    private UUID uuid;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.SET_NULL)
    @JoinColumn(name = "fk_gold_type_id")
    private GoldType goldType;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.SET_NULL)
    @JoinColumn(name = "fk_supplier_id")
    private Supplier supplier;

    @Size(max = 50)
    @NotNull
    @Column(name = "code", nullable = false, length = 50)
    private String code;

    @Size(max = 255)
    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @Size(max = 100)
    @NotNull
    @Column(name = "category_name", nullable = false, length = 100)
    private String categoryName;

    @Size(max = 50)
    @NotNull
    @ColumnDefault("'chiếc'")
    @Column(name = "unit_name", nullable = false, length = 50)
    private String unitName;

    @ColumnDefault("0")
    @Column(name = "weight", nullable = false, precision = 18, scale = 3)
    private BigDecimal weight;

    @ColumnDefault("0")
    @Column(name = "gold_weight", nullable = false, precision = 18, scale = 3)
    private BigDecimal goldWeight;

    @ColumnDefault("0")
    @Column(name = "stone_weight", nullable = false, precision = 18, scale = 3)
    private BigDecimal stoneWeight;

    @ColumnDefault("0")
    @Column(name = "labor_cost", nullable = false, precision = 18, scale = 2)
    private BigDecimal laborCost;

    @ColumnDefault("0")
    @Column(name = "stone_cost", nullable = false, precision = 18, scale = 2)
    private BigDecimal stoneCost;

    @ColumnDefault("0")
    @Column(name = "base_labor_cost", nullable = false, precision = 18, scale = 2)
    private BigDecimal baseLaborCost;

    @ColumnDefault("0")
    @Column(name = "base_stone_cost", nullable = false, precision = 18, scale = 2)
    private BigDecimal baseStoneCost;

    @ColumnDefault("0")
    @Column(name = "cost_price", nullable = false, precision = 18, scale = 2)
    private BigDecimal costPrice;

    @ColumnDefault("0")
    @Column(name = "purchase_price", nullable = false, precision = 18, scale = 2)
    private BigDecimal purchasePrice;

    @ColumnDefault("0")
    @Column(name = "sale_price", nullable = false, precision = 18, scale = 2)
    private BigDecimal salePrice;

    @ColumnDefault("false")
    @Column(name = "is_fixed_price", nullable = false)
    private Boolean fixedPrice;

    @ColumnDefault("0")
    @Column(name = "vat_rate", nullable = false, precision = 5, scale = 2)
    private BigDecimal vatRate;

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
