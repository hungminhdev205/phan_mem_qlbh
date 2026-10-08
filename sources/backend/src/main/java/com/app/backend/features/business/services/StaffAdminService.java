package com.app.backend.features.business.services;

import com.app.backend.common.enums.RecordType;
import com.app.backend.common.exception.AppException;
import com.app.backend.common.exception.ErrorCode;
import com.app.backend.entities.Account;
import com.app.backend.entities.Employee;
import com.app.backend.entities.Profile;
import com.app.backend.entities.Role;
import com.app.backend.features.auth.repositories.AuthRepository;
import com.app.backend.features.business.dtos.StaffAdminDto;
import com.app.backend.features.business.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StaffAdminService {
    private final EmployeeRepository employeeRepository;
    private final ProfileRepository profileRepository;
    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final CompanyRepository companyRepository;
    private final AuthRepository authRepository;
    private final PasswordEncoder passwordEncoder;

    public List<StaffAdminDto.EmployeeResponse> getEmployees() {
        return employeeRepository.findForAdminListNative()
                .stream()
                .map(employee -> StaffAdminDto.EmployeeResponse.from(
                        employee,
                        profileRepository.findByAccountId(employee.getAccount().getId()).orElse(null)
                ))
                .toList();
    }

    public List<StaffAdminDto.RoleResponse> getRoles() {
        return roleRepository.findRolesNative()
                .stream()
                .map(StaffAdminDto.RoleResponse::from)
                .toList();
    }

    public List<StaffAdminDto.PermissionResponse> getPermissions() {
        return permissionRepository.findPermissionsNative()
                .stream()
                .map(StaffAdminDto.PermissionResponse::from)
                .toList();
    }

    @Transactional
    public StaffAdminDto.EmployeeResponse createEmployee(StaffAdminDto.EmployeeRequest request) {
        if (authRepository.findByUsername(request.username().trim()).isPresent()) {
            throw new AppException(ErrorCode.BAD_REQUEST, "Tên đăng nhập đã tồn tại.");
        }
        UUID accountUuid = UUID.randomUUID();
        String username = request.username().trim();
        String encodedPassword = passwordEncoder.encode(blankDefault(request.password(), "123456"));
        authRepository.insertNative(accountUuid, username, encodedPassword, RecordType.active.name());
        Account account = authRepository.findByUsername(username).orElseThrow();

        UUID profileUuid = UUID.randomUUID();
        String fullName = request.fullName().trim();
        String email = blankDefault(request.email(), username + "@local");
        String phone = blankToNull(request.phone());
        profileRepository.insertNative(profileUuid, account.getId(), fullName, email, phone);

        UUID employeeUuid = UUID.randomUUID();
        Role role = resolveRole(request.roleUuid());
        Long companyId = 1L;
        String employeeCode = request.employeeCode().trim().toUpperCase();
        String positionName = blankToNull(request.positionName());
        RecordType status = request.status() == null ? RecordType.active : request.status();

        employeeRepository.insertNative(
                employeeUuid,
                account.getId(),
                companyId,
                role == null ? null : role.getId(),
                employeeCode,
                positionName,
                status.name()
        );

        Employee employee = employeeRepository.findByUuid(employeeUuid).orElseThrow();
        Profile profile = profileRepository.findByAccountId(account.getId()).orElse(null);
        return StaffAdminDto.EmployeeResponse.from(employee, profile);
    }

    @Transactional
    public StaffAdminDto.EmployeeResponse updateEmployee(UUID uuid, StaffAdminDto.EmployeeRequest request) {
        Employee employee = employeeRepository.findByUuid(uuid)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
        Account account = employee.getAccount();
        String username = request.username().trim();
        RecordType status = request.status() == null ? RecordType.active : request.status();

        if (request.password() != null && !request.password().trim().isBlank()) {
            String encodedPassword = passwordEncoder.encode(request.password().trim());
            authRepository.updateWithPasswordNative(account.getId(), username, encodedPassword, status.name());
        } else {
            authRepository.updateNative(account.getId(), username, status.name());
        }

        String fullName = request.fullName().trim();
        String email = blankDefault(request.email(), username + "@local");
        String phone = blankToNull(request.phone());
        if (profileRepository.findByAccountId(account.getId()).isPresent()) {
            profileRepository.updateByAccountIdNative(account.getId(), fullName, email, phone);
        } else {
            profileRepository.insertNative(UUID.randomUUID(), account.getId(), fullName, email, phone);
        }

        Role role = resolveRole(request.roleUuid());
        String employeeCode = request.employeeCode().trim().toUpperCase();
        String positionName = blankToNull(request.positionName());

        employeeRepository.updateNative(
                uuid,
                role == null ? null : role.getId(),
                employeeCode,
                positionName,
                status.name()
        );

        Employee updatedEmployee = employeeRepository.findByUuid(uuid).orElseThrow();
        Profile profile = profileRepository.findByAccountId(account.getId()).orElse(null);
        return StaffAdminDto.EmployeeResponse.from(updatedEmployee, profile);
    }

    @Transactional
    public void deleteEmployee(UUID uuid) {
        Employee employee = employeeRepository.findByUuid(uuid)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
        employeeRepository.softDeleteNative(uuid);
        authRepository.softDeleteNative(employee.getAccount().getId());
    }

    private Role resolveRole(UUID roleUuid) {
        if (roleUuid == null) {
            return null;
        }
        return roleRepository.findByUuid(roleUuid)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
    }

    private String blankDefault(String value, String fallback) {
        if (value == null || value.trim().isBlank()) {
            return fallback;
        }
        return value.trim();
    }

    private String blankToNull(String value) {
        if (value == null || value.trim().isBlank()) {
            return null;
        }
        return value.trim();
    }
}
