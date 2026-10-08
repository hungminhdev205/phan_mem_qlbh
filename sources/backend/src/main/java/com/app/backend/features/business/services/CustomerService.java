package com.app.backend.features.business.services;

import com.app.backend.common.enums.RecordType;
import com.app.backend.common.exception.AppException;
import com.app.backend.common.exception.ErrorCode;
import com.app.backend.entities.Customer;
import com.app.backend.features.business.dtos.CustomerDto;
import com.app.backend.features.business.repositories.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CustomerService {
    private final CustomerRepository customerRepository;

    public List<CustomerDto.Response> getCustomers(String keyword) {
        String search = keyword == null ? "" : keyword.trim();
        List<Customer> rows = customerRepository.searchNative(search);
        return rows.stream().map(CustomerDto.Response::from).toList();
    }

    @Transactional
    public CustomerDto.Response createCustomer(CustomerDto.Request request) {
        UUID uuid = UUID.randomUUID();
        customerRepository.insertNative(
                uuid,
                request.code().trim().toUpperCase(),
                request.name().trim(),
                blankToNull(request.phone()),
                blankToNull(request.email()),
                blankToNull(request.address()),
                blankToNull(request.rankName()),
                request.debtAmount() == null ? BigDecimal.ZERO : request.debtAmount(),
                (request.status() == null ? RecordType.active : request.status()).name()
        );
        return CustomerDto.Response.from(getActiveCustomer(uuid));
    }

    @Transactional
    public CustomerDto.Response updateCustomer(UUID uuid, CustomerDto.Request request) {
        getActiveCustomer(uuid);
        customerRepository.updateNative(
                uuid,
                request.code().trim().toUpperCase(),
                request.name().trim(),
                blankToNull(request.phone()),
                blankToNull(request.email()),
                blankToNull(request.address()),
                blankToNull(request.rankName()),
                request.debtAmount() == null ? BigDecimal.ZERO : request.debtAmount(),
                (request.status() == null ? RecordType.active : request.status()).name()
        );
        return CustomerDto.Response.from(getActiveCustomer(uuid));
    }

    @Transactional
    public void deleteCustomer(UUID uuid) {
        getActiveCustomer(uuid);
        customerRepository.softDeleteNative(uuid);
    }

    public Customer getActiveCustomer(UUID uuid) {
        Customer customer = customerRepository.findByUuid(uuid)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
        if (customer.getStatus() == RecordType.deleted) {
            throw new AppException(ErrorCode.RESOURCE_NOT_FOUND);
        }
        return customer;
    }

    private void applyRequest(Customer customer, CustomerDto.Request request) {
        customer.setCode(request.code().trim().toUpperCase());
        customer.setName(request.name().trim());
        customer.setPhone(blankToNull(request.phone()));
        customer.setEmail(blankToNull(request.email()));
        customer.setAddress(blankToNull(request.address()));
        customer.setRankName(blankToNull(request.rankName()));
        customer.setDebtAmount(request.debtAmount() == null ? BigDecimal.ZERO : request.debtAmount());
        customer.setStatus(request.status() == null ? RecordType.active : request.status());
    }

    private String blankToNull(String value) {
        if (value == null || value.trim().isBlank()) {
            return null;
        }
        return value.trim();
    }
}
