package com.app.backend.features.business.services;

import com.app.backend.common.enums.RecordType;
import com.app.backend.common.exception.AppException;
import com.app.backend.common.exception.ErrorCode;
import com.app.backend.entities.Warehouse;
import com.app.backend.features.business.dtos.WarehouseDto;
import com.app.backend.features.business.repositories.WarehouseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class WarehouseService {
    private final WarehouseRepository warehouseRepository;

    public List<WarehouseDto.Response> getWarehouses(String keyword) {
        String search = keyword == null ? "" : keyword.trim();
        List<Warehouse> rows = warehouseRepository.searchNative(search);
        return rows.stream().map(WarehouseDto.Response::from).toList();
    }

    @Transactional
    public WarehouseDto.Response createWarehouse(WarehouseDto.Request request) {
        UUID uuid = UUID.randomUUID();
        String code = request.code().trim().toUpperCase();
        String name = request.name().trim();
        String address = blankToNull(request.address());
        RecordType status = request.status() == null ? RecordType.active : request.status();

        warehouseRepository.insertNative(uuid, code, name, address, status.name());
        return WarehouseDto.Response.from(getActiveWarehouse(uuid));
    }

    @Transactional
    public WarehouseDto.Response updateWarehouse(UUID uuid, WarehouseDto.Request request) {
        getActiveWarehouse(uuid);
        String code = request.code().trim().toUpperCase();
        String name = request.name().trim();
        String address = blankToNull(request.address());
        RecordType status = request.status() == null ? RecordType.active : request.status();

        warehouseRepository.updateNative(uuid, code, name, address, status.name());
        return WarehouseDto.Response.from(getActiveWarehouse(uuid));
    }

    @Transactional
    public void deleteWarehouse(UUID uuid) {
        getActiveWarehouse(uuid);
        warehouseRepository.softDeleteNative(uuid);
    }

    public Warehouse getActiveWarehouse(UUID uuid) {
        Warehouse warehouse = warehouseRepository.findByUuid(uuid)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
        if (warehouse.getStatus() == RecordType.deleted) {
            throw new AppException(ErrorCode.RESOURCE_NOT_FOUND);
        }
        return warehouse;
    }

    private String blankToNull(String value) {
        if (value == null || value.trim().isBlank()) {
            return null;
        }
        return value.trim();
    }
}
