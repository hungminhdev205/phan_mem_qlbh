package com.app.backend.features.business.services;

import com.app.backend.common.enums.RecordType;
import com.app.backend.common.exception.AppException;
import com.app.backend.common.exception.ErrorCode;
import com.app.backend.entities.Supplier;
import com.app.backend.features.business.dtos.SupplierDto;
import com.app.backend.features.business.repositories.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SupplierService {
    private final SupplierRepository supplierRepository;
    private final TagCategoryService tagCategoryService;

    public List<SupplierDto.Response> getSuppliers(String keyword) {
        String search = keyword == null ? "" : keyword.trim();
        List<Supplier> suppliers = supplierRepository.searchNative(search);
        return suppliers.stream().map(SupplierDto.Response::from).toList();
    }

    @Transactional
    public SupplierDto.Response createSupplier(SupplierDto.Request request) {
        var tagCategory = tagCategoryService.getActiveTagCategory(request.tagCategoryUuid());
        UUID uuid = UUID.randomUUID();
        String code = request.code().trim().toUpperCase();
        String name = request.name().trim();
        String phone = blankToNull(request.phone());
        String email = blankToNull(request.email());
        String address = blankToNull(request.address());
        String taxCode = blankToNull(request.taxCode());
        RecordType status = request.status() == null ? RecordType.active : request.status();

        supplierRepository.insertNative(
                uuid,
                tagCategory.getId(),
                code,
                name,
                phone,
                email,
                address,
                taxCode,
                status.name()
        );
        return SupplierDto.Response.from(getActiveSupplier(uuid));
    }

    @Transactional
    public SupplierDto.Response updateSupplier(UUID uuid, SupplierDto.Request request) {
        getActiveSupplier(uuid);
        var tagCategory = tagCategoryService.getActiveTagCategory(request.tagCategoryUuid());
        String code = request.code().trim().toUpperCase();
        String name = request.name().trim();
        String phone = blankToNull(request.phone());
        String email = blankToNull(request.email());
        String address = blankToNull(request.address());
        String taxCode = blankToNull(request.taxCode());
        RecordType status = request.status() == null ? RecordType.active : request.status();

        supplierRepository.updateNative(
                uuid,
                tagCategory.getId(),
                code,
                name,
                phone,
                email,
                address,
                taxCode,
                status.name()
        );
        return SupplierDto.Response.from(getActiveSupplier(uuid));
    }

    @Transactional
    public void deleteSupplier(UUID uuid) {
        getActiveSupplier(uuid);
        supplierRepository.softDeleteNative(uuid);
    }

    public Supplier getActiveSupplier(UUID uuid) {
        Supplier supplier = supplierRepository.findByUuid(uuid)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
        if (supplier.getStatus() == RecordType.deleted) {
            throw new AppException(ErrorCode.RESOURCE_NOT_FOUND);
        }
        return supplier;
    }

    private void applyRequest(Supplier supplier, SupplierDto.Request request) {
        supplier.setTagCategory(tagCategoryService.getActiveTagCategory(request.tagCategoryUuid()));
        supplier.setCode(request.code().trim().toUpperCase());
        supplier.setName(request.name().trim());
        supplier.setPhone(blankToNull(request.phone()));
        supplier.setEmail(blankToNull(request.email()));
        supplier.setAddress(blankToNull(request.address()));
        supplier.setTaxCode(blankToNull(request.taxCode()));
        supplier.setStatus(request.status() == null ? RecordType.active : request.status());
    }

    private String blankToNull(String value) {
        if (value == null || value.trim().isBlank()) {
            return null;
        }
        return value.trim();
    }
}
