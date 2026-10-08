package com.app.backend.features.business.repositories;

import com.app.backend.entities.Warehouse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WarehouseRepository extends JpaRepository<Warehouse, Long> {
    Optional<Warehouse> findByUuid(UUID uuid);

    @Query(value = """
            SELECT * FROM inventory.warehouses
            WHERE status != 'deleted'
              AND (:search = '' OR LOWER(name) LIKE LOWER(CONCAT('%', :search, '%'))
                                 OR LOWER(code) LIKE LOWER(CONCAT('%', :search, '%')))
            ORDER BY name ASC
            LIMIT 100
            """, nativeQuery = true)
    List<Warehouse> searchNative(@Param("search") String search);

    @Modifying
    @Query(value = """
            INSERT INTO inventory.warehouses (uuid, code, name, address, status, created_at, updated_at)
            VALUES (:uuid, :code, :name, :address, CAST(:status AS public.record_type), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            """, nativeQuery = true)
    int insertNative(
            @Param("uuid") UUID uuid,
            @Param("code") String code,
            @Param("name") String name,
            @Param("address") String address,
            @Param("status") String status
    );

    @Modifying
    @Query(value = """
            UPDATE inventory.warehouses
            SET code = :code,
                name = :name,
                address = :address,
                status = CAST(:status AS public.record_type),
                updated_at = CURRENT_TIMESTAMP
            WHERE uuid = :uuid
            """, nativeQuery = true)
    int updateNative(
            @Param("uuid") UUID uuid,
            @Param("code") String code,
            @Param("name") String name,
            @Param("address") String address,
            @Param("status") String status
    );

    @Modifying
    @Query(value = """
            UPDATE inventory.warehouses
            SET status = CAST('deleted' AS public.record_type),
                updated_at = CURRENT_TIMESTAMP
            WHERE uuid = :uuid
            """, nativeQuery = true)
    int softDeleteNative(@Param("uuid") UUID uuid);
}
