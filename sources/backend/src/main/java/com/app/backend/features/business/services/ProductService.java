package com.app.backend.features.business.services;

import com.app.backend.common.enums.RecordType;
import com.app.backend.common.exception.AppException;
import com.app.backend.common.exception.ErrorCode;
import com.app.backend.entities.GoldType;
import com.app.backend.entities.Product;
import com.app.backend.entities.Supplier;
import com.app.backend.features.business.dtos.ProductDto;
import com.app.backend.features.business.repositories.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductService {
    private static final BigDecimal ZERO = BigDecimal.ZERO;

    private final ProductRepository productRepository;
    private final GoldTypeService goldTypeService;
    private final SupplierService supplierService;

    public List<ProductDto.Response> getProducts(String keyword) {
        String search = keyword == null ? "" : keyword.trim();
        List<Product> rows = productRepository.searchNative(search);
        return rows.stream().map(ProductDto.Response::from).toList();
    }

    @Transactional
    public ProductDto.Response createProduct(ProductDto.Request request) {
        UUID uuid = UUID.randomUUID();
        GoldType goldType = request.goldTypeUuid() == null ? null : goldTypeService.getActiveGoldType(request.goldTypeUuid());
        Supplier supplier = request.supplierUuid() == null ? null : supplierService.getActiveSupplier(request.supplierUuid());
        String code = request.code().trim().toUpperCase();
        String name = request.name().trim();
        String categoryName = request.categoryName().trim();
        String unitName = blankDefault(request.unitName(), "chiếc");
        BigDecimal weight = valueOrZero(request.weight());
        BigDecimal goldWeight = valueOrZero(request.goldWeight());
        BigDecimal stoneWeight = valueOrZero(request.stoneWeight());
        BigDecimal laborCost = valueOrZero(request.laborCost());
        BigDecimal stoneCost = valueOrZero(request.stoneCost());
        BigDecimal baseLaborCost = valueOrZero(request.baseLaborCost());
        BigDecimal baseStoneCost = valueOrZero(request.baseStoneCost());
        BigDecimal costPrice = valueOrZero(request.costPrice());
        BigDecimal purchasePrice = valueOrZero(request.purchasePrice());
        BigDecimal salePrice = valueOrZero(request.salePrice());
        Boolean isFixedPrice = Boolean.TRUE.equals(request.fixedPrice());
        BigDecimal vatRate = valueOrZero(request.vatRate());
        RecordType status = request.status() == null ? RecordType.active : request.status();

        productRepository.insertNative(
                uuid,
                goldType == null ? null : goldType.getId(),
                supplier == null ? null : supplier.getId(),
                code,
                name,
                categoryName,
                unitName,
                weight,
                goldWeight,
                stoneWeight,
                laborCost,
                stoneCost,
                baseLaborCost,
                baseStoneCost,
                costPrice,
                purchasePrice,
                salePrice,
                isFixedPrice,
                vatRate,
                status.name()
        );
        return ProductDto.Response.from(getActiveProduct(uuid));
    }

    @Transactional
    public ProductDto.Response updateProduct(UUID uuid, ProductDto.Request request) {
        getActiveProduct(uuid);
        GoldType goldType = request.goldTypeUuid() == null ? null : goldTypeService.getActiveGoldType(request.goldTypeUuid());
        Supplier supplier = request.supplierUuid() == null ? null : supplierService.getActiveSupplier(request.supplierUuid());
        String code = request.code().trim().toUpperCase();
        String name = request.name().trim();
        String categoryName = request.categoryName().trim();
        String unitName = blankDefault(request.unitName(), "chiếc");
        BigDecimal weight = valueOrZero(request.weight());
        BigDecimal goldWeight = valueOrZero(request.goldWeight());
        BigDecimal stoneWeight = valueOrZero(request.stoneWeight());
        BigDecimal laborCost = valueOrZero(request.laborCost());
        BigDecimal stoneCost = valueOrZero(request.stoneCost());
        BigDecimal baseLaborCost = valueOrZero(request.baseLaborCost());
        BigDecimal baseStoneCost = valueOrZero(request.baseStoneCost());
        BigDecimal costPrice = valueOrZero(request.costPrice());
        BigDecimal purchasePrice = valueOrZero(request.purchasePrice());
        BigDecimal salePrice = valueOrZero(request.salePrice());
        Boolean isFixedPrice = Boolean.TRUE.equals(request.fixedPrice());
        BigDecimal vatRate = valueOrZero(request.vatRate());
        RecordType status = request.status() == null ? RecordType.active : request.status();

        productRepository.updateNative(
                uuid,
                goldType == null ? null : goldType.getId(),
                supplier == null ? null : supplier.getId(),
                code,
                name,
                categoryName,
                unitName,
                weight,
                goldWeight,
                stoneWeight,
                laborCost,
                stoneCost,
                baseLaborCost,
                baseStoneCost,
                costPrice,
                purchasePrice,
                salePrice,
                isFixedPrice,
                vatRate,
                status.name()
        );
        return ProductDto.Response.from(getActiveProduct(uuid));
    }

    @Transactional
    public void deleteProduct(UUID uuid) {
        getActiveProduct(uuid);
        productRepository.softDeleteNative(uuid);
    }

    public Product getActiveProduct(UUID uuid) {
        Product product = productRepository.findByUuid(uuid)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
        if (product.getStatus() == RecordType.deleted) {
            throw new AppException(ErrorCode.RESOURCE_NOT_FOUND);
        }
        return product;
    }

    private BigDecimal valueOrZero(BigDecimal value) {
        return value == null ? ZERO : value;
    }

    private String blankDefault(String value, String fallback) {
        if (value == null || value.trim().isBlank()) {
            return fallback;
        }
        return value.trim();
    }
}
