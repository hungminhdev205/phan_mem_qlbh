package com.app.backend.features.business.dtos;

import com.app.backend.common.enums.RecordType;
import com.app.backend.entities.Employee;
import com.app.backend.entities.Permission;
import com.app.backend.entities.Profile;
import com.app.backend.entities.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.OffsetDateTime;
import java.util.UUID;

public class StaffAdminDto {
    public record EmployeeRequest(
            @NotBlank(message = "{validation.employee.code.required}")
            @Size(max = 50, message = "{validation.employee.code.max}")
            String employeeCode,

            @NotBlank(message = "{validation.account.username.required}")
            @Size(max = 100, message = "{validation.account.username.max}")
            String username,

            String password,

            @NotBlank(message = "{validation.profile.full_name.required}")
            @Size(max = 255, message = "{validation.profile.full_name.max}")
            String fullName,

            String email,
            String phone,
            String positionName,
            UUID roleUuid,
            RecordType status
    ) {
    }

    public record EmployeeResponse(
            UUID uuid,
            String employeeCode,
            String username,
            String fullName,
            String email,
            String phone,
            String positionName,
            RecordType status,
            RoleResponse role,
            OffsetDateTime createdAt,
            OffsetDateTime updatedAt
    ) {
        public static EmployeeResponse from(Employee employee, Profile profile) {
            return new EmployeeResponse(
                    employee.getUuid(),
                    employee.getEmployeeCode(),
                    employee.getAccount().getUsername(),
                    profile == null ? "" : profile.getFullName(),
                    profile == null ? "" : profile.getEmail(),
                    profile == null ? "" : profile.getPhone(),
                    employee.getPositionName(),
                    employee.getStatus(),
                    employee.getRole() == null ? null : RoleResponse.from(employee.getRole()),
                    employee.getCreatedAt(),
                    employee.getUpdatedAt()
            );
        }
    }

    public record RoleResponse(
            UUID uuid,
            String code,
            String name,
            String description,
            RecordType status
    ) {
        public static RoleResponse from(Role role) {
            return new RoleResponse(
                    role.getUuid(),
                    role.getCode(),
                    role.getName(),
                    role.getDescription(),
                    role.getStatus()
            );
        }
    }

    public record PermissionResponse(
            UUID uuid,
            String code,
            String name,
            String description,
            String scope
    ) {
        public static PermissionResponse from(Permission permission) {
            return new PermissionResponse(
                    permission.getUuid(),
                    permission.getCode(),
                    permission.getName(),
                    permission.getDescription(),
                    permission.getScope() == null ? null : permission.getScope().name()
            );
        }
    }
}
