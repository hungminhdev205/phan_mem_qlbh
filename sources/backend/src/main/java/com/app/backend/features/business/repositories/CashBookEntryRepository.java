package com.app.backend.features.business.repositories;

import com.app.backend.entities.CashBookEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CashBookEntryRepository extends JpaRepository<CashBookEntry, Long> {
    Optional<CashBookEntry> findByUuid(UUID uuid);

    @Query(value = """
            SELECT * FROM finance.cash_book_entries
            WHERE status != 'deleted'
            ORDER BY occurred_at DESC, id DESC
            LIMIT 200
            """, nativeQuery = true)
    List<CashBookEntry> findRecentNative();

    @Modifying
    @Query(value = """
            INSERT INTO finance.cash_book_entries (
                uuid, code, entry_type, payment_method, amount, title, description,
                status, occurred_at, created_at, updated_at
            ) VALUES (
                :uuid, :code, :entryType, :paymentMethod, :amount, :title, :description,
                CAST(:status AS public.record_type), :occurredAt, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
            )
            """, nativeQuery = true)
    int insertNative(
            @Param("uuid") UUID uuid,
            @Param("code") String code,
            @Param("entryType") String entryType,
            @Param("paymentMethod") String paymentMethod,
            @Param("amount") BigDecimal amount,
            @Param("title") String title,
            @Param("description") String description,
            @Param("status") String status,
            @Param("occurredAt") OffsetDateTime occurredAt
    );

    @Modifying
    @Query(value = """
            UPDATE finance.cash_book_entries
            SET entry_type = :entryType,
                payment_method = :paymentMethod,
                amount = :amount,
                title = :title,
                description = :description,
                status = CAST(:status AS public.record_type),
                occurred_at = :occurredAt,
                updated_at = CURRENT_TIMESTAMP
            WHERE uuid = :uuid
            """, nativeQuery = true)
    int updateNative(
            @Param("uuid") UUID uuid,
            @Param("entryType") String entryType,
            @Param("paymentMethod") String paymentMethod,
            @Param("amount") BigDecimal amount,
            @Param("title") String title,
            @Param("description") String description,
            @Param("status") String status,
            @Param("occurredAt") OffsetDateTime occurredAt
    );

    @Modifying
    @Query(value = """
            UPDATE finance.cash_book_entries
            SET status = CAST('deleted' AS public.record_type),
                updated_at = CURRENT_TIMESTAMP
            WHERE uuid = :uuid
            """, nativeQuery = true)
    int softDeleteNative(@Param("uuid") UUID uuid);
}
