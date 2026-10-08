package com.app.backend.features.business.repositories;

import com.app.backend.entities.Product;
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
public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findByUuid(UUID uuid);

    @Query(value = """
            SELECT * FROM catalog.products
            WHERE status != 'deleted'
              AND (:search = '' OR LOWER(name) LIKE LOWER(CONCAT('%', :search, '%'))
                                 OR LOWER(code) LIKE LOWER(CONCAT('%', :search, '%'))
                                 OR LOWER(category_name) LIKE LOWER(CONCAT('%', :search, '%')))
            ORDER BY name ASC
            LIMIT 100
            """, nativeQuery = true)
    List<Product> searchNative(@Param("search") String search);

    @Modifying
    @Query(value = """
            INSERT INTO catalog.products (
                uuid, fk_gold_type_id, fk_supplier_id, code, name, category_name, unit_name,
                weight, gold_weight, stone_weight, labor_cost, stone_cost, base_labor_cost, base_stone_cost,
                cost_price, purchase_price, sale_price, is_fixed_price, vat_rate, status, created_at, updated_at
            ) VALUES (
                :uuid, :goldTypeId, :supplierId, :code, :name, :categoryName, :unitName,
                :weight, :goldWeight, :stoneWeight, :laborCost, :stoneCost, :baseLaborCost, :baseStoneCost,
                :costPrice, :purchasePrice, :salePrice, :isFixedPrice, :vatRate,
                CAST(:status AS public.record_type), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
            )
            """, nativeQuery = true)
    int insertNative(
            @Param("uuid") UUID uuid,
            @Param("goldTypeId") Long goldTypeId,
            @Param("supplierId") Long supplierId,
            @Param("code") String code,
            @Param("name") String name,
            @Param("categoryName") String categoryName,
            @Param("unitName") String unitName,
            @Param("weight") BigDecimal weight,
            @Param("goldWeight") BigDecimal goldWeight,
            @Param("stoneWeight") BigDecimal stoneWeight,
            @Param("laborCost") BigDecimal laborCost,
            @Param("stoneCost") BigDecimal stoneCost,
            @Param("baseLaborCost") BigDecimal baseLaborCost,
            @Param("baseStoneCost") BigDecimal baseStoneCost,
            @Param("costPrice") BigDecimal costPrice,
            @Param("purchasePrice") BigDecimal purchasePrice,
            @Param("salePrice") BigDecimal salePrice,
            @Param("isFixedPrice") Boolean isFixedPrice,
            @Param("vatRate") BigDecimal vatRate,
            @Param("status") String status
    );

    @Modifying
    @Query(value = """
            UPDATE catalog.products
            SET fk_gold_type_id = :goldTypeId,
                fk_supplier_id = :supplierId,
                code = :code,
                name = :name,
                category_name = :categoryName,
                unit_name = :unitName,
                weight = :weight,
                gold_weight = :goldWeight,
                stone_weight = :stoneWeight,
                labor_cost = :laborCost,
                stone_cost = :stoneCost,
                base_labor_cost = :baseLaborCost,
                base_stone_cost = :baseStoneCost,
                cost_price = :costPrice,
                purchase_price = :purchasePrice,
                sale_price = :salePrice,
                is_fixed_price = :isFixedPrice,
                vat_rate = :vatRate,
                status = CAST(:status AS public.record_type),
                updated_at = CURRENT_TIMESTAMP
            WHERE uuid = :uuid
            """, nativeQuery = true)
    int updateNative(
            @Param("uuid") UUID uuid,
            @Param("goldTypeId") Long goldTypeId,
            @Param("supplierId") Long supplierId,
            @Param("code") String code,
            @Param("name") String name,
            @Param("categoryName") String categoryName,
            @Param("unitName") String unitName,
            @Param("weight") BigDecimal weight,
            @Param("goldWeight") BigDecimal goldWeight,
            @Param("stoneWeight") BigDecimal stoneWeight,
            @Param("laborCost") BigDecimal laborCost,
            @Param("stoneCost") BigDecimal stoneCost,
            @Param("baseLaborCost") BigDecimal baseLaborCost,
            @Param("baseStoneCost") BigDecimal baseStoneCost,
            @Param("costPrice") BigDecimal costPrice,
            @Param("purchasePrice") BigDecimal purchasePrice,
            @Param("salePrice") BigDecimal salePrice,
            @Param("isFixedPrice") Boolean isFixedPrice,
            @Param("vatRate") BigDecimal vatRate,
            @Param("status") String status
    );

    @Modifying
    @Query(value = """
            UPDATE catalog.products
            SET status = CAST('deleted' AS public.record_type),
                updated_at = CURRENT_TIMESTAMP
            WHERE uuid = :uuid
            """, nativeQuery = true)
    int softDeleteNative(@Param("uuid") UUID uuid);
}
