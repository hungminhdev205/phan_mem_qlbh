package com.app.backend.features.business.services;

import com.app.backend.common.exception.AppException;
import com.app.backend.common.exception.ErrorCode;
import com.app.backend.entities.Product;
import com.app.backend.entities.StockBalance;
import com.app.backend.entities.Warehouse;
import com.app.backend.features.business.dtos.StockBalanceDto;
import com.app.backend.features.business.repositories.StockBalanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StockBalanceService {
    private static final BigDecimal ZERO = BigDecimal.ZERO;

    private final StockBalanceRepository stockBalanceRepository;
    private final WarehouseService warehouseService;
    private final ProductService productService;

    public List<StockBalanceDto.Response> getStockBalances() {
        return stockBalanceRepository.findTop200Native()
                .stream()
                .map(StockBalanceDto.Response::from)
                .toList();
    }

    @Transactional
    public StockBalanceDto.Response createStockBalance(StockBalanceDto.Request request) {
        UUID uuid = UUID.randomUUID();
        Warehouse warehouse = warehouseService.getActiveWarehouse(request.warehouseUuid());
        Product product = productService.getActiveProduct(request.productUuid());
        BigDecimal quantity = request.quantity() == null ? ZERO : request.quantity();
        BigDecimal minQuantity = request.minQuantity() == null ? ZERO : request.minQuantity();
        String locationCode = blankToNull(request.locationCode());

        stockBalanceRepository.insertNative(uuid, warehouse.getId(), product.getId(), quantity, minQuantity, locationCode);
        return StockBalanceDto.Response.from(stockBalanceRepository.findByUuid(uuid).orElseThrow());
    }

    @Transactional
    public StockBalanceDto.Response updateStockBalance(UUID uuid, StockBalanceDto.Request request) {
        stockBalanceRepository.findByUuid(uuid)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
        Warehouse warehouse = warehouseService.getActiveWarehouse(request.warehouseUuid());
        Product product = productService.getActiveProduct(request.productUuid());
        BigDecimal quantity = request.quantity() == null ? ZERO : request.quantity();
        BigDecimal minQuantity = request.minQuantity() == null ? ZERO : request.minQuantity();
        String locationCode = blankToNull(request.locationCode());

        stockBalanceRepository.updateNative(uuid, warehouse.getId(), product.getId(), quantity, minQuantity, locationCode);
        return StockBalanceDto.Response.from(stockBalanceRepository.findByUuid(uuid).orElseThrow());
    }

    @Transactional
    public void deleteStockBalance(UUID uuid) {
        stockBalanceRepository.findByUuid(uuid)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
        stockBalanceRepository.deleteNative(uuid);
    }

    public StockBalance getByWarehouseAndProduct(Long warehouseId, Long productId) {
        return stockBalanceRepository.findByWarehouseIdAndProductId(warehouseId, productId)
                .orElseThrow(() -> new AppException(ErrorCode.BAD_REQUEST, "Sản phẩm chưa có tồn kho trong kho được chọn."));
    }

    @Transactional
    public StockBalance getOrCreate(Warehouse warehouse, Product product) {
        return stockBalanceRepository.findByWarehouseIdAndProductId(warehouse.getId(), product.getId())
                .orElseGet(() -> {
                    UUID uuid = UUID.randomUUID();
                    stockBalanceRepository.insertNative(uuid, warehouse.getId(), product.getId(), ZERO, ZERO, null);
                    return stockBalanceRepository.findByUuid(uuid).orElseThrow();
                });
    }

    @Transactional
    public void increase(StockBalance stockBalance, BigDecimal quantity) {
        BigDecimal safeQuantity = quantity == null ? ZERO : quantity;
        if (safeQuantity.compareTo(ZERO) <= 0) {
            throw new AppException(ErrorCode.BAD_REQUEST, "Số lượng nhập/chuyển phải lớn hơn 0.");
        }
        BigDecimal newQuantity = stockBalance.getQuantity().add(safeQuantity);
        stockBalanceRepository.updateQuantityNative(stockBalance.getUuid(), newQuantity);
        stockBalance.setQuantity(newQuantity);
    }

    @Transactional
    public void decrease(StockBalance stockBalance, BigDecimal quantity) {
        BigDecimal safeQuantity = quantity == null ? ZERO : quantity;
        if (safeQuantity.compareTo(ZERO) <= 0) {
            throw new AppException(ErrorCode.BAD_REQUEST, "Số lượng bán phải lớn hơn 0.");
        }
        BigDecimal newQuantity = stockBalance.getQuantity().subtract(safeQuantity);
        if (newQuantity.compareTo(ZERO) < 0) {
            throw new AppException(ErrorCode.BAD_REQUEST, "Không đủ tồn kho để bán sản phẩm này.");
        }
        stockBalanceRepository.updateQuantityNative(stockBalance.getUuid(), newQuantity);
        stockBalance.setQuantity(newQuantity);
    }

    private String blankToNull(String value) {
        if (value == null || value.trim().isBlank()) {
            return null;
        }
        return value.trim();
    }
}
