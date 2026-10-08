package com.app.backend.features.business.dtos;

import com.app.backend.common.enums.TransactionStatus;
import com.app.backend.common.enums.TransactionType;
import com.app.backend.entities.SaleTransaction;
import com.app.backend.entities.TransactionDetail;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public class SaleTransactionDto {
    public record DetailRequest(
            @NotNull(message = "{validation.product.required}")
            UUID productUuid,
            UUID warehouseUuid,
            BigDecimal quantity,
            BigDecimal unitPrice,
            BigDecimal discountAmount
    ) {
    }

    public record Request(
            UUID customerUuid,

            @Size(max = 50, message = "{validation.payment_method.max}")
            String paymentMethod,

            BigDecimal discountAmount,
            BigDecimal paidAmount,

            @NotEmpty(message = "{validation.transaction.details.required}")
            List<@Valid DetailRequest> details
    ) {
    }

    public record DetailResponse(
            ProductDto.Response product,
            WarehouseDto.Response warehouse,
            BigDecimal quantity,
            BigDecimal unitPrice,
            BigDecimal discountAmount,
            BigDecimal totalAmount
    ) {
        public static DetailResponse from(TransactionDetail detail) {
            return new DetailResponse(
                    ProductDto.Response.from(detail.getProduct()),
                    detail.getWarehouse() == null ? null : WarehouseDto.Response.from(detail.getWarehouse()),
                    detail.getQuantity(),
                    detail.getUnitPrice(),
                    detail.getDiscountAmount(),
                    detail.getTotalAmount()
            );
        }
    }

    public record Response(
            UUID uuid,
            String code,
            TransactionType transactionType,
            String paymentMethod,
            BigDecimal totalAmount,
            BigDecimal paidAmount,
            BigDecimal changeAmount,
            TransactionStatus status,
            CustomerDto.Response customer,
            List<DetailResponse> details,
            OffsetDateTime createdAt,
            OffsetDateTime updatedAt
    ) {
        public static Response from(SaleTransaction transaction) {
            BigDecimal paidAmount = transaction.getPaidAmount() == null ? BigDecimal.ZERO : transaction.getPaidAmount();
            BigDecimal totalAmount = transaction.getTotalAmount() == null ? BigDecimal.ZERO : transaction.getTotalAmount();
            BigDecimal changeAmount = paidAmount.subtract(totalAmount).max(BigDecimal.ZERO);
            return new Response(
                    transaction.getUuid(),
                    transaction.getCode(),
                    transaction.getTransactionType(),
                    transaction.getPaymentMethod(),
                    totalAmount,
                    paidAmount,
                    changeAmount,
                    transaction.getStatus(),
                    transaction.getCustomer() == null ? null : CustomerDto.Response.from(transaction.getCustomer()),
                    transaction.getDetails().stream().map(DetailResponse::from).toList(),
                    transaction.getCreatedAt(),
                    transaction.getUpdatedAt()
            );
        }
    }
}
