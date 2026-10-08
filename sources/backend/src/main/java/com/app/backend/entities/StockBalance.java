package com.app.backend.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
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
@Table(name = "stock_balances", schema = "inventory")
public class StockBalance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @NotNull
    @ColumnDefault("uuidv7()")
    @Column(name = "uuid", nullable = false)
    private UUID uuid;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "fk_warehouse_id", nullable = false)
    private Warehouse warehouse;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "fk_product_id", nullable = false)
    private Product product;

    @ColumnDefault("0")
    @Column(name = "quantity", nullable = false, precision = 18, scale = 3)
    private BigDecimal quantity;

    @ColumnDefault("0")
    @Column(name = "min_quantity", nullable = false, precision = 18, scale = 3)
    private BigDecimal minQuantity;

    @Column(name = "location_code", length = 100)
    private String locationCode;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;
}
