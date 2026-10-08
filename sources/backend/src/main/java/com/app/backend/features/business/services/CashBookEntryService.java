package com.app.backend.features.business.services;

import com.app.backend.common.enums.RecordType;
import com.app.backend.common.exception.AppException;
import com.app.backend.common.exception.ErrorCode;
import com.app.backend.entities.CashBookEntry;
import com.app.backend.features.business.dtos.CashBookEntryDto;
import com.app.backend.features.business.repositories.CashBookEntryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CashBookEntryService {
    private static final BigDecimal ZERO = BigDecimal.ZERO;

    private final CashBookEntryRepository cashBookEntryRepository;

    public List<CashBookEntryDto.Response> getEntries() {
        return cashBookEntryRepository.findRecentNative()
                .stream()
                .map(CashBookEntryDto.Response::from)
                .toList();
    }

    @Transactional
    public CashBookEntryDto.Response createEntry(CashBookEntryDto.Request request) {
        String entryType = request.entryType().trim().toLowerCase();
        if (!entryType.equals("income") && !entryType.equals("expense")) {
            throw new AppException(ErrorCode.BAD_REQUEST, "Loại phiếu chỉ nhận income hoặc expense.");
        }
        BigDecimal amount = request.amount() == null ? ZERO : request.amount();
        if (amount.compareTo(ZERO) <= 0) {
            throw new AppException(ErrorCode.BAD_REQUEST, "Số tiền phải lớn hơn 0.");
        }
        OffsetDateTime now = OffsetDateTime.now();
        UUID uuid = UUID.randomUUID();
        String code = "SQ-" + now.format(DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss"));
        String paymentMethod = blankDefault(request.paymentMethod(), "cash");
        String title = request.title().trim();
        String description = blankToNull(request.description());
        RecordType status = request.status() == null ? RecordType.active : request.status();
        OffsetDateTime occurredAt = request.occurredAt() == null ? now : request.occurredAt();

        cashBookEntryRepository.insertNative(
                uuid,
                code,
                entryType,
                paymentMethod,
                amount,
                title,
                description,
                status.name(),
                occurredAt
        );
        return CashBookEntryDto.Response.from(getActiveEntry(uuid));
    }

    @Transactional
    public CashBookEntryDto.Response updateEntry(UUID uuid, CashBookEntryDto.Request request) {
        getActiveEntry(uuid);
        String entryType = request.entryType().trim().toLowerCase();
        if (!entryType.equals("income") && !entryType.equals("expense")) {
            throw new AppException(ErrorCode.BAD_REQUEST, "Loại phiếu chỉ nhận income hoặc expense.");
        }
        BigDecimal amount = request.amount() == null ? ZERO : request.amount();
        if (amount.compareTo(ZERO) <= 0) {
            throw new AppException(ErrorCode.BAD_REQUEST, "Số tiền phải lớn hơn 0.");
        }
        OffsetDateTime now = OffsetDateTime.now();
        String paymentMethod = blankDefault(request.paymentMethod(), "cash");
        String title = request.title().trim();
        String description = blankToNull(request.description());
        RecordType status = request.status() == null ? RecordType.active : request.status();
        OffsetDateTime occurredAt = request.occurredAt() == null ? now : request.occurredAt();

        cashBookEntryRepository.updateNative(
                uuid,
                entryType,
                paymentMethod,
                amount,
                title,
                description,
                status.name(),
                occurredAt
        );
        return CashBookEntryDto.Response.from(getActiveEntry(uuid));
    }

    @Transactional
    public void deleteEntry(UUID uuid) {
        getActiveEntry(uuid);
        cashBookEntryRepository.softDeleteNative(uuid);
    }

    private CashBookEntry getActiveEntry(UUID uuid) {
        CashBookEntry entry = cashBookEntryRepository.findByUuid(uuid)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
        if (entry.getStatus() == RecordType.deleted) {
            throw new AppException(ErrorCode.RESOURCE_NOT_FOUND);
        }
        return entry;
    }

    private String blankDefault(String value, String fallback) {
        if (value == null || value.trim().isBlank()) {
            return fallback;
        }
        return value.trim();
    }

    private String blankToNull(String value) {
        if (value == null || value.trim().isBlank()) {
            return null;
        }
        return value.trim();
    }
}
