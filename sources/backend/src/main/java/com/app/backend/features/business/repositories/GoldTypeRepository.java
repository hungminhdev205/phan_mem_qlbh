package com.app.backend.features.business.repositories;

import com.app.backend.entities.GoldType;
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
public interface GoldTypeRepository extends JpaRepository<GoldType, Long> {
    Optional<GoldType> findByUuid(UUID uuid);

    @Query(value = """
            SELECT * FROM catalog.gold_types
            WHERE status != 'deleted'
              AND (:search = '' OR LOWER(name) LIKE LOWER(CONCAT('%', :search, '%'))
                                 OR LOWER(code) LIKE LOWER(CONCAT('%', :search, '%')))
            ORDER BY name ASC
            LIMIT 100
            """, nativeQuery = true)
    List<GoldType> searchNative(@Param("search") String search);

    @Modifying
    @Query(value = """
            INSERT INTO catalog.gold_types (uuid, code, name, purity, description, status, created_at, updated_at)
            VALUES (:uuid, :code, :name, :purity, :description, CAST(:status AS public.record_type), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            """, nativeQuery = true)
    int insertNative(
            @Param("uuid") UUID uuid,
            @Param("code") String code,
            @Param("name") String name,
            @Param("purity") BigDecimal purity,
            @Param("description") String description,
            @Param("status") String status
    );

    @Modifying
    @Query(value = """
            UPDATE catalog.gold_types
            SET code = :code,
                name = :name,
                purity = :purity,
                description = :description,
                status = CAST(:status AS public.record_type),
                updated_at = CURRENT_TIMESTAMP
            WHERE uuid = :uuid
            """, nativeQuery = true)
    int updateNative(
            @Param("uuid") UUID uuid,
            @Param("code") String code,
            @Param("name") String name,
            @Param("purity") BigDecimal purity,
            @Param("description") String description,
            @Param("status") String status
    );

    @Modifying
    @Query(value = """
            UPDATE catalog.gold_types
            SET status = CAST('deleted' AS public.record_type),
                updated_at = CURRENT_TIMESTAMP
            WHERE uuid = :uuid
            """, nativeQuery = true)
    int softDeleteNative(@Param("uuid") UUID uuid);
}
