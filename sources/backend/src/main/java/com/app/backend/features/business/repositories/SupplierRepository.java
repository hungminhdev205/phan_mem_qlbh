package com.app.backend.features.business.repositories;

import com.app.backend.entities.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Long> {
    Optional<Supplier> findByUuid(UUID uuid);

    @Query(value = """
            SELECT * FROM business.suppliers
            WHERE status != 'deleted'
              AND (:search = '' OR LOWER(name) LIKE LOWER(CONCAT('%', :search, '%'))
                                 OR LOWER(code) LIKE LOWER(CONCAT('%', :search, '%')))
            ORDER BY name ASC
            LIMIT 100
            """, nativeQuery = true)
    List<Supplier> searchNative(@Param("search") String search);

    @Modifying
    @Query(value = """
            INSERT INTO business.suppliers (uuid, fk_tag_category_id, code, name, phone, email, address, tax_code, status, created_at, updated_at)
            VALUES (:uuid, :tagCategoryId, :code, :name, :phone, :email, :address, :taxCode, CAST(:status AS public.record_type), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            """, nativeQuery = true)
    int insertNative(
            @Param("uuid") UUID uuid,
            @Param("tagCategoryId") Long tagCategoryId,
            @Param("code") String code,
            @Param("name") String name,
            @Param("phone") String phone,
            @Param("email") String email,
            @Param("address") String address,
            @Param("taxCode") String taxCode,
            @Param("status") String status
    );

    @Modifying
    @Query(value = """
            UPDATE business.suppliers
            SET fk_tag_category_id = :tagCategoryId,
                code = :code,
                name = :name,
                phone = :phone,
                email = :email,
                address = :address,
                tax_code = :taxCode,
                status = CAST(:status AS public.record_type),
                updated_at = CURRENT_TIMESTAMP
            WHERE uuid = :uuid
            """, nativeQuery = true)
    int updateNative(
            @Param("uuid") UUID uuid,
            @Param("tagCategoryId") Long tagCategoryId,
            @Param("code") String code,
            @Param("name") String name,
            @Param("phone") String phone,
            @Param("email") String email,
            @Param("address") String address,
            @Param("taxCode") String taxCode,
            @Param("status") String status
    );

    @Modifying
    @Query(value = """
            UPDATE business.suppliers
            SET status = CAST('deleted' AS public.record_type),
                updated_at = CURRENT_TIMESTAMP
            WHERE uuid = :uuid
            """, nativeQuery = true)
    int softDeleteNative(@Param("uuid") UUID uuid);
}
