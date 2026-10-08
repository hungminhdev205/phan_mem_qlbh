package com.app.backend.features.business.repositories;

import com.app.backend.entities.SaleTransaction;
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
public interface SaleTransactionRepository extends JpaRepository<SaleTransaction, Long> {
    Optional<SaleTransaction> findByUuid(UUID uuid);

    @Query(value = """
            SELECT * FROM sales.transactions
            ORDER BY created_at DESC, id DESC
            LIMIT 100
            """, nativeQuery = true)
    List<SaleTransaction> findRecentNative();

    @Modifying
    @Query(value = """
            INSERT INTO sales.transactions (
                uuid, fk_customer_id, fk_employee_id, code, transaction_type,
                payment_method, total_amount, paid_amount, status, created_at, updated_at
            ) VALUES (
                :uuid, :customerId, :employeeId, :code, CAST(:transactionType AS public.transaction_type),
                :paymentMethod, :totalAmount, :paidAmount, CAST(:status AS public.transaction_status),
                CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
            )
            """, nativeQuery = true)
    int insertTransactionNative(
            @Param("uuid") UUID uuid,
            @Param("customerId") Long customerId,
            @Param("employeeId") Long employeeId,
            @Param("code") String code,
            @Param("transactionType") String transactionType,
            @Param("paymentMethod") String paymentMethod,
            @Param("totalAmount") BigDecimal totalAmount,
            @Param("paidAmount") BigDecimal paidAmount,
            @Param("status") String status
    );

    @Modifying
    @Query(value = """
            INSERT INTO sales.transaction_details (
                fk_transaction_id, fk_product_id, fk_warehouse_id, quantity, unit_price, discount_amount, total_amount
            ) VALUES (
                :transactionId, :productId, :warehouseId, :quantity, :unitPrice, :discountAmount, :totalAmount
            )
            """, nativeQuery = true)
    int insertDetailNative(
            @Param("transactionId") Long transactionId,
            @Param("productId") Long productId,
            @Param("warehouseId") Long warehouseId,
            @Param("quantity") BigDecimal quantity,
            @Param("unitPrice") BigDecimal unitPrice,
            @Param("discountAmount") BigDecimal discountAmount,
            @Param("totalAmount") BigDecimal totalAmount
    );

    @Modifying
    @Query(value = """
            UPDATE sales.transactions
            SET status = CAST(:status AS public.transaction_status),
                updated_at = CURRENT_TIMESTAMP
            WHERE uuid = :uuid
            """, nativeQuery = true)
    int updateStatusNative(@Param("uuid") UUID uuid, @Param("status") String status);

    @Modifying
    @Query(value = """
            DELETE FROM sales.transactions
            WHERE uuid = :uuid
            """, nativeQuery = true)
    int deleteNative(@Param("uuid") UUID uuid);
}
