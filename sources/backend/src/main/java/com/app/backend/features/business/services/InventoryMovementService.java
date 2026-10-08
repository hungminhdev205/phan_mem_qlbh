package com.app.backend.features.business.services;

import com.app.backend.common.exception.AppException;
import com.app.backend.common.exception.ErrorCode;
import com.app.backend.entities.Product;
import com.app.backend.entities.StockBalance;
import com.app.backend.entities.Warehouse;
import com.app.backend.features.business.dtos.InventoryMovementDto;
import com.app.backend.features.business.repositories.InventoryMovementRepository;
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
public class InventoryMovementService {
    private static final BigDecimal ZERO = BigDecimal.ZERO;

    private final InventoryMovementRepository inventoryMovementRepository;
    private final WarehouseService warehouseService;
    private final ProductService productService;
    private final StockBalanceService stockBalanceService;

    public List<InventoryMovementDto.Response> getMovements() {
        return inventoryMovementRepository.findRecentNative()
                .stream()
                .map(InventoryMovementDto.Response::from)
                .toList();
    }

    @Transactional
    public InventoryMovementDto.Response createMovement(InventoryMovementDto.Request request) {
        String type = request.movementType().trim().toLowerCase();
        BigDecimal quantity = request.quantity() == null ? ZERO : request.quantity();
        if (quantity.compareTo(ZERO) <= 0) {
            throw new AppException(ErrorCode.BAD_REQUEST, "Số lượng phải lớn hơn 0.");
        }

        Product product = productService.getActiveProduct(request.productUuid());
        Warehouse source = request.sourceWarehouseUuid() == null ? null : warehouseService.getActiveWarehouse(request.sourceWarehouseUuid());
        Warehouse target = request.targetWarehouseUuid() == null ? null : warehouseService.getActiveWarehouse(request.targetWarehouseUuid());

        if (type.equals("import")) {
            if (target == null) {
                throw new AppException(ErrorCode.BAD_REQUEST, "Phiếu nhập cần chọn kho nhận.");
            }
            StockBalance targetBalance = stockBalanceService.getOrCreate(target, product);
            stockBalanceService.increase(targetBalance, quantity);
        } else if (type.equals("transfer")) {
            if (source == null || target == null) {
                throw new AppException(ErrorCode.BAD_REQUEST, "Phiếu chuyển kho cần chọn kho nguồn và kho đích.");
            }
            if (source.getId().equals(target.getId())) {
                throw new AppException(ErrorCode.BAD_REQUEST, "Kho nguồn và kho đích phải khác nhau.");
            }
            StockBalance sourceBalance = stockBalanceService.getByWarehouseAndProduct(source.getId(), product.getId());
            StockBalance targetBalance = stockBalanceService.getOrCreate(target, product);
            stockBalanceService.decrease(sourceBalance, quantity);
            stockBalanceService.increase(targetBalance, quantity);
        } else {
            throw new AppException(ErrorCode.BAD_REQUEST, "Loại phiếu kho chỉ nhận import hoặc transfer.");
        }

        UUID uuid = UUID.randomUUID();
        String code = (type.equals("import") ? "NK-" : "CK-") + OffsetDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss"));
        BigDecimal unitCost = request.unitCost() == null ? ZERO : request.unitCost();
        String note = blankToNull(request.note());

        inventoryMovementRepository.insertNative(
                uuid,
                code,
                type,
                source == null ? null : source.getId(),
                target == null ? null : target.getId(),
                product.getId(),
                quantity,
                unitCost,
                note
        );
        return InventoryMovementDto.Response.from(inventoryMovementRepository.findByUuid(uuid).orElseThrow());
    }

    private String blankToNull(String value) {
        if (value == null || value.trim().isBlank()) {
            return null;
        }
        return value.trim();
    }
}
