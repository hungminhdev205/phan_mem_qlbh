package com.app.backend.features.business.services;

import com.app.backend.common.enums.TransactionStatus;
import com.app.backend.common.enums.TransactionType;
import com.app.backend.common.exception.AppException;
import com.app.backend.common.exception.ErrorCode;
import com.app.backend.entities.Customer;
import com.app.backend.entities.Product;
import com.app.backend.entities.SaleTransaction;
import com.app.backend.entities.StockBalance;
import com.app.backend.entities.Warehouse;
import com.app.backend.features.business.dtos.SaleTransactionDto;
import com.app.backend.features.business.repositories.SaleTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SaleTransactionService {
    private static final BigDecimal ZERO = BigDecimal.ZERO;

    private final SaleTransactionRepository saleTransactionRepository;
    private final ProductService productService;
    private final WarehouseService warehouseService;
    private final CustomerService customerService;
    private final StockBalanceService stockBalanceService;

    public List<SaleTransactionDto.Response> getRecentTransactions() {
        return saleTransactionRepository.findRecentNative()
                .stream()
                .map(SaleTransactionDto.Response::from)
                .toList();
    }

    public SaleTransactionDto.Response getTransaction(UUID uuid) {
        return SaleTransactionDto.Response.from(getByUuid(uuid));
    }

    private record PreparedDetail(
            Product product,
            Warehouse warehouse,
            BigDecimal quantity,
            BigDecimal unitPrice,
            BigDecimal discountAmount,
            BigDecimal totalAmount
    ) {}

    @Transactional
    public SaleTransactionDto.Response createSale(SaleTransactionDto.Request request) {
        UUID uuid = UUID.randomUUID();
        OffsetDateTime now = OffsetDateTime.now();
        String code = "HD-" + now.format(DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss"));
        Customer customer = request.customerUuid() == null ? null : customerService.getActiveCustomer(request.customerUuid());
        String paymentMethod = blankDefault(request.paymentMethod(), "cash");
        BigDecimal paidAmount = valueOrZero(request.paidAmount());

        List<PreparedDetail> preparedDetails = new ArrayList<>();
        BigDecimal lineTotal = ZERO;

        for (SaleTransactionDto.DetailRequest detailRequest : request.details()) {
            Product product = productService.getActiveProduct(detailRequest.productUuid());
            Warehouse warehouse = detailRequest.warehouseUuid() == null
                    ? getDefaultWarehouse()
                    : warehouseService.getActiveWarehouse(detailRequest.warehouseUuid());
            BigDecimal quantity = valueOrDefault(detailRequest.quantity(), BigDecimal.ONE);
            if (quantity.compareTo(ZERO) <= 0) {
                throw new AppException(ErrorCode.BAD_REQUEST, "Số lượng bán phải lớn hơn 0.");
            }

            StockBalance stockBalance = stockBalanceService.getByWarehouseAndProduct(warehouse.getId(), product.getId());
            stockBalanceService.decrease(stockBalance, quantity);

            BigDecimal unitPrice = valueOrDefault(detailRequest.unitPrice(), product.getSalePrice());
            BigDecimal discountAmount = valueOrZero(detailRequest.discountAmount());
            BigDecimal totalAmount = unitPrice.multiply(quantity).subtract(discountAmount).max(ZERO);

            preparedDetails.add(new PreparedDetail(product, warehouse, quantity, unitPrice, discountAmount, totalAmount));
            lineTotal = lineTotal.add(totalAmount);
        }

        BigDecimal transactionDiscount = valueOrZero(request.discountAmount());
        BigDecimal totalAmount = lineTotal.subtract(transactionDiscount).max(ZERO);

        saleTransactionRepository.insertTransactionNative(
                uuid,
                customer == null ? null : customer.getId(),
                null,
                code,
                TransactionType.sale.name(),
                paymentMethod,
                totalAmount,
                paidAmount,
                TransactionStatus.completed.name()
        );

        SaleTransaction transaction = getByUuid(uuid);
        for (PreparedDetail detail : preparedDetails) {
            saleTransactionRepository.insertDetailNative(
                    transaction.getId(),
                    detail.product().getId(),
                    detail.warehouse().getId(),
                    detail.quantity(),
                    detail.unitPrice(),
                    detail.discountAmount(),
                    detail.totalAmount()
            );
        }

        return SaleTransactionDto.Response.from(getByUuid(uuid));
    }

    private SaleTransaction getByUuid(UUID uuid) {
        return saleTransactionRepository.findByUuid(uuid)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
    }

    private Warehouse getDefaultWarehouse() {
        List<Warehouse> warehouses = warehouseService.getWarehouses("").stream()
                .map(response -> warehouseService.getActiveWarehouse(response.uuid()))
                .toList();
        if (warehouses.isEmpty()) {
            throw new AppException(ErrorCode.BAD_REQUEST, "Chưa có kho để ghi nhận bán hàng.");
        }
        return warehouses.get(0);
    }

    private BigDecimal valueOrZero(BigDecimal value) {
        return value == null ? ZERO : value;
    }

    private BigDecimal valueOrDefault(BigDecimal value, BigDecimal fallback) {
        return value == null ? fallback : value;
    }

    private String blankDefault(String value, String fallback) {
        if (value == null || value.trim().isBlank()) {
            return fallback;
        }
        return value.trim();
    }
}
