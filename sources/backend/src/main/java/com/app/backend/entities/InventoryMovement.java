package com.app.backend.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "inventory_movements", schema = "inventory")
public class InventoryMovement {
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

    @Size(max = 30)
    @NotNull
    @Column(name = "movement_type", nullable = false, length = 30)
    private String movementType;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.SET_NULL)
    @JoinColumn(name = "fk_source_warehouse_id")
    private Warehouse sourceWarehouse;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.SET_NULL)
    @JoinColumn(name = "fk_target_warehouse_id")
    private Warehouse targetWarehouse;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JoinColumn(name = "fk_product_id", nullable = false)
    private Product product;

    @NotNull
    @Column(name = "quantity", nullable = false, precision = 18, scale = 3)
    private BigDecimal quantity;

    @Column(name = "unit_cost", precision = 18, scale = 2)
    private BigDecimal unitCost;

    @Size(max = 255)
    @Column(name = "note")
    private String note;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "created_at")
    private OffsetDateTime createdAt;
}
