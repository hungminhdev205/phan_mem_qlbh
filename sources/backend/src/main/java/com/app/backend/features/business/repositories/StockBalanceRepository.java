package com.app.backend.features.business.repositories;

import com.app.backend.entities.StockBalance;
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
public interface StockBalanceRepository extends JpaRepository<StockBalance, Long> {
    Optional<StockBalance> findByUuid(UUID uuid);

    @Query(value = """
            SELECT sb.* FROM inventory.stock_balances sb
            JOIN inventory.warehouses w ON sb.fk_warehouse_id = w.id
            JOIN catalog.products p ON sb.fk_product_id = p.id
            ORDER BY w.name ASC, p.name ASC
            LIMIT 200
            """, nativeQuery = true)
    List<StockBalance> findTop200Native();

    Optional<StockBalance> findByWarehouseIdAndProductId(Long warehouseId, Long productId);

    @Modifying
    @Query(value = """
            INSERT INTO inventory.stock_balances (uuid, fk_warehouse_id, fk_product_id, quantity, min_quantity, location_code, updated_at)
            VALUES (:uuid, :warehouseId, :productId, :quantity, :minQuantity, :locationCode, CURRENT_TIMESTAMP)
            """, nativeQuery = true)
    int insertNative(
            @Param("uuid") UUID uuid,
            @Param("warehouseId") Long warehouseId,
            @Param("productId") Long productId,
            @Param("quantity") BigDecimal quantity,
            @Param("minQuantity") BigDecimal minQuantity,
            @Param("locationCode") String locationCode
    );

    @Modifying
    @Query(value = """
            UPDATE inventory.stock_balances
            SET fk_warehouse_id = :warehouseId,
                fk_product_id = :productId,
                quantity = :quantity,
                min_quantity = :minQuantity,
                location_code = :locationCode,
                updated_at = CURRENT_TIMESTAMP
            WHERE uuid = :uuid
            """, nativeQuery = true)
    int updateNative(
            @Param("uuid") UUID uuid,
            @Param("warehouseId") Long warehouseId,
            @Param("productId") Long productId,
            @Param("quantity") BigDecimal quantity,
            @Param("minQuantity") BigDecimal minQuantity,
            @Param("locationCode") String locationCode
    );

    @Modifying
    @Query(value = """
            UPDATE inventory.stock_balances
            SET quantity = :quantity,
                updated_at = CURRENT_TIMESTAMP
            WHERE uuid = :uuid
            """, nativeQuery = true)
    int updateQuantityNative(@Param("uuid") UUID uuid, @Param("quantity") BigDecimal quantity);

    @Modifying
    @Query(value = """
            DELETE FROM inventory.stock_balances
            WHERE uuid = :uuid
            """, nativeQuery = true)
    int deleteNative(@Param("uuid") UUID uuid);
}
