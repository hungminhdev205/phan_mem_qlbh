package com.app.backend.features.business.repositories;

import com.app.backend.entities.Customer;
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
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Optional<Customer> findByUuid(UUID uuid);

    @Query(value = """
            SELECT * FROM business.customers
            WHERE status != 'deleted'
              AND (:search = '' OR LOWER(name) LIKE LOWER(CONCAT('%', :search, '%'))
                                 OR LOWER(code) LIKE LOWER(CONCAT('%', :search, '%'))
                                 OR LOWER(COALESCE(phone, '')) LIKE LOWER(CONCAT('%', :search, '%')))
            ORDER BY name ASC
            LIMIT 100
            """, nativeQuery = true)
    List<Customer> searchNative(@Param("search") String search);

    @Modifying
    @Query(value = """
            INSERT INTO business.customers (uuid, code, name, phone, email, address, rank_name, debt_amount, status, created_at, updated_at)
            VALUES (:uuid, :code, :name, :phone, :email, :address, :rankName, :debtAmount, CAST(:status AS public.record_type), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            """, nativeQuery = true)
    int insertNative(
            @Param("uuid") UUID uuid,
            @Param("code") String code,
            @Param("name") String name,
            @Param("phone") String phone,
            @Param("email") String email,
            @Param("address") String address,
            @Param("rankName") String rankName,
            @Param("debtAmount") BigDecimal debtAmount,
            @Param("status") String status
    );

    @Modifying
    @Query(value = """
            UPDATE business.customers
            SET code = :code,
                name = :name,
                phone = :phone,
                email = :email,
                address = :address,
                rank_name = :rankName,
                debt_amount = :debtAmount,
                status = CAST(:status AS public.record_type),
                updated_at = CURRENT_TIMESTAMP
            WHERE uuid = :uuid
            """, nativeQuery = true)
    int updateNative(
            @Param("uuid") UUID uuid,
            @Param("code") String code,
            @Param("name") String name,
            @Param("phone") String phone,
            @Param("email") String email,
            @Param("address") String address,
            @Param("rankName") String rankName,
            @Param("debtAmount") BigDecimal debtAmount,
            @Param("status") String status
    );

    @Modifying
    @Query(value = """
            UPDATE business.customers
            SET status = CAST('deleted' AS public.record_type),
                updated_at = CURRENT_TIMESTAMP
            WHERE uuid = :uuid
            """, nativeQuery = true)
    int softDeleteNative(@Param("uuid") UUID uuid);
}
