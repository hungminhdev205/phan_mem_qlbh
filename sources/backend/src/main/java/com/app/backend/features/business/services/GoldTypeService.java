package com.app.backend.features.business.services;

import com.app.backend.common.enums.RecordType;
import com.app.backend.common.exception.AppException;
import com.app.backend.common.exception.ErrorCode;
import com.app.backend.entities.GoldType;
import com.app.backend.features.business.dtos.GoldTypeDto;
import com.app.backend.features.business.repositories.GoldTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GoldTypeService {
    private final GoldTypeRepository goldTypeRepository;

    public List<GoldTypeDto.Response> getGoldTypes(String keyword) {
        String search = keyword == null ? "" : keyword.trim();
        List<GoldType> rows = goldTypeRepository.searchNative(search);
        return rows.stream().map(GoldTypeDto.Response::from).toList();
    }

    @Transactional
    public GoldTypeDto.Response createGoldType(GoldTypeDto.Request request) {
        UUID uuid = UUID.randomUUID();
        goldTypeRepository.insertNative(
                uuid,
                request.code().trim().toUpperCase(),
                request.name().trim(),
                request.purity(),
                blankToNull(request.description()),
                (request.status() == null ? RecordType.active : request.status()).name()
        );
        return GoldTypeDto.Response.from(getActiveGoldType(uuid));
    }

    @Transactional
    public GoldTypeDto.Response updateGoldType(UUID uuid, GoldTypeDto.Request request) {
        getActiveGoldType(uuid);
        goldTypeRepository.updateNative(
                uuid,
                request.code().trim().toUpperCase(),
                request.name().trim(),
                request.purity(),
                blankToNull(request.description()),
                (request.status() == null ? RecordType.active : request.status()).name()
        );
        return GoldTypeDto.Response.from(getActiveGoldType(uuid));
    }

    @Transactional
    public void deleteGoldType(UUID uuid) {
        getActiveGoldType(uuid);
        goldTypeRepository.softDeleteNative(uuid);
    }

    public GoldType getActiveGoldType(UUID uuid) {
        GoldType goldType = goldTypeRepository.findByUuid(uuid)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
        if (goldType.getStatus() == RecordType.deleted) {
            throw new AppException(ErrorCode.RESOURCE_NOT_FOUND);
        }
        return goldType;
    }

    private void applyRequest(GoldType goldType, GoldTypeDto.Request request) {
        goldType.setCode(request.code().trim().toUpperCase());
        goldType.setName(request.name().trim());
        goldType.setPurity(request.purity());
        goldType.setDescription(blankToNull(request.description()));
        goldType.setStatus(request.status() == null ? RecordType.active : request.status());
    }

    private String blankToNull(String value) {
        if (value == null || value.trim().isBlank()) {
            return null;
        }
        return value.trim();
    }
}
