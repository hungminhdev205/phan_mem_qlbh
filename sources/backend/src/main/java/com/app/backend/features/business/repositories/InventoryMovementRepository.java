package com.app.backend.features.business.repositories;

import com.app.backend.entities.InventoryMovement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface InventoryMovementRepository extends JpaRepository<InventoryMovement, Long> {
    Optional<InventoryMovement> findByUuid(UUID uuid);

    @Query(value = """
            SELECT m.* FROM inventory.inventory_movements m
            ORDER BY m.created_at DESC, m.id DESC
            LIMIT 100
            """, nativeQuery = true)
    List<InventoryMovement> findRecentNative();

    @Modifying
    @Query(value = """
            INSERT INTO inventory.inventory_movements (
                uuid, code, movement_type, fk_source_warehouse_id, fk_target_warehouse_id,
                fk_product_id, quantity, unit_cost, note, created_at
            ) VALUES (
                :uuid, :code, :movementType, :sourceWarehouseId, :targetWarehouseId,
                :productId, :quantity, :unitCost, :note, CURRENT_TIMESTAMP
            )
            """, nativeQuery = true)
    int insertNative(
            @Param("uuid") UUID uuid,
            @Param("code") String code,
            @Param("movementType") String movementType,
            @Param("sourceWarehouseId") Long sourceWarehouseId,
            @Param("targetWarehouseId") Long targetWarehouseId,
            @Param("productId") Long productId,
            @Param("quantity") BigDecimal quantity,
            @Param("unitCost") BigDecimal unitCost,
            @Param("note") String note
    );
}
