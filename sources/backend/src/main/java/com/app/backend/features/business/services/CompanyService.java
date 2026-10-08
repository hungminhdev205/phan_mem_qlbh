package com.app.backend.features.business.services;

import com.app.backend.common.enums.RecordType;
import com.app.backend.common.exception.AppException;
import com.app.backend.common.exception.ErrorCode;
import com.app.backend.entities.Company;
import com.app.backend.features.business.dtos.CompanyDto;
import com.app.backend.features.business.repositories.CompanyRepository;
import com.app.backend.security.token.JwtClaim;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CompanyService {
    private final CompanyRepository companyRepository;

    public List<CompanyDto.Response> getCompanies(String keyword) {
        String search = keyword == null ? "" : keyword.trim();
        List<Company> companies = companyRepository.searchNative(search);
        return companies.stream().map(CompanyDto.Response::from).toList();
    }

    @Transactional
    public CompanyDto.Response createCompany(CompanyDto.Request request, JwtClaim claim) {
        Long accountId = currentAccountId(claim);
        UUID uuid = UUID.randomUUID();
        companyRepository.insertNative(
                uuid,
                request.name().trim(),
                blankToNull(request.address()),
                blankToNull(request.phone()),
                blankToNull(request.email()),
                request.taxCode().trim(),
                statusValue(request.status()).name(),
                accountId
        );
        Company company = companyRepository.findByUuid(uuid)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
        return CompanyDto.Response.from(company);
    }

    @Transactional
    public CompanyDto.Response updateCompany(UUID uuid, CompanyDto.Request request, JwtClaim claim) {
        Long accountId = currentAccountId(claim);
        if (companyRepository.findByUuid(uuid).isEmpty()) {
            throw new AppException(ErrorCode.RESOURCE_NOT_FOUND);
        }
        companyRepository.updateNative(
                uuid,
                request.name().trim(),
                blankToNull(request.address()),
                blankToNull(request.phone()),
                blankToNull(request.email()),
                request.taxCode().trim(),
                statusValue(request.status()).name(),
                accountId
        );
        Company company = companyRepository.findByUuid(uuid)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
        return CompanyDto.Response.from(company);
    }

    @Transactional
    public void deleteCompany(UUID uuid) {
        if (companyRepository.findByUuid(uuid).isEmpty()) {
            throw new AppException(ErrorCode.RESOURCE_NOT_FOUND);
        }
        companyRepository.deleteNative(uuid);
    }

    private Long currentAccountId(JwtClaim claim) {
        if (claim == null || claim.accountId() == null) {
            throw new AppException(ErrorCode.AUTH_UNAUTHORIZED);
        }
        return claim.accountId();
    }

    private RecordType statusValue(RecordType status) {
        return status == null ? RecordType.active : status;
    }

    private String blankToNull(String value) {
        if (value == null || value.trim().isBlank()) {
            return null;
        }
        return value.trim();
    }
}
