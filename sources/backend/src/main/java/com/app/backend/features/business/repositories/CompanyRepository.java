package com.app.backend.features.business.repositories;

import com.app.backend.entities.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {
    Optional<Company> findByUuid(UUID uuid);

    @Query(value = """
            SELECT * FROM business.companies
            WHERE status != 'deleted'
              AND (:search = '' OR LOWER(name) LIKE LOWER(CONCAT('%', :search, '%'))
                                 OR LOWER(tax_code) LIKE LOWER(CONCAT('%', :search, '%')))
            ORDER BY name ASC
            LIMIT 100
            """, nativeQuery = true)
    List<Company> searchNative(@Param("search") String search);

    @Modifying
    @Query(value = """
            INSERT INTO business.companies (uuid, name, address, phone, email, tax_code, status, fk_create_by, created_at, updated_at)
            VALUES (:uuid, :name, :address, :phone, :email, :taxCode, CAST(:status AS public.record_type), :createBy, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            """, nativeQuery = true)
    int insertNative(
            @Param("uuid") UUID uuid,
            @Param("name") String name,
            @Param("address") String address,
            @Param("phone") String phone,
            @Param("email") String email,
            @Param("taxCode") String taxCode,
            @Param("status") String status,
            @Param("createBy") Long createBy
    );

    @Modifying
    @Query(value = """
            UPDATE business.companies
            SET name = :name,
                address = :address,
                phone = :phone,
                email = :email,
                tax_code = :taxCode,
                status = CAST(:status AS public.record_type),
                fk_update_by = :updateBy,
                updated_at = CURRENT_TIMESTAMP
            WHERE uuid = :uuid
            """, nativeQuery = true)
    int updateNative(
            @Param("uuid") UUID uuid,
            @Param("name") String name,
            @Param("address") String address,
            @Param("phone") String phone,
            @Param("email") String email,
            @Param("taxCode") String taxCode,
            @Param("status") String status,
            @Param("updateBy") Long updateBy
    );

    @Modifying
    @Query(value = """
            DELETE FROM business.companies
            WHERE uuid = :uuid
            """, nativeQuery = true)
    int deleteNative(@Param("uuid") UUID uuid);
}
