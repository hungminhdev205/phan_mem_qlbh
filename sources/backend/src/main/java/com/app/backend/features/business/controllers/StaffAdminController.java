package com.app.backend.features.business.controllers;

import com.app.backend.common.response.ApiResponse;
import com.app.backend.features.business.dtos.StaffAdminDto;
import com.app.backend.features.business.services.StaffAdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/staff")
@RequiredArgsConstructor
public class StaffAdminController {
    private final StaffAdminService staffAdminService;

    @GetMapping("/employees")
    public ResponseEntity<ApiResponse.Success<List<StaffAdminDto.EmployeeResponse>>> getEmployees() {
        return ResponseEntity.ok(ApiResponse.Success.ok("Get employees successfully", staffAdminService.getEmployees()));
    }

    @PostMapping("/employees")
    public ResponseEntity<ApiResponse.Success<StaffAdminDto.EmployeeResponse>> createEmployee(
            @Valid @RequestBody StaffAdminDto.EmployeeRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.Success.ok("Create employee successfully", staffAdminService.createEmployee(request)));
    }

    @PutMapping("/employees/{uuid}")
    public ResponseEntity<ApiResponse.Success<StaffAdminDto.EmployeeResponse>> updateEmployee(
            @PathVariable UUID uuid,
            @Valid @RequestBody StaffAdminDto.EmployeeRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.Success.ok("Update employee successfully", staffAdminService.updateEmployee(uuid, request)));
    }

    @DeleteMapping("/employees/{uuid}")
    public ResponseEntity<ApiResponse.Success<Void>> deleteEmployee(@PathVariable UUID uuid) {
        staffAdminService.deleteEmployee(uuid);
        return ResponseEntity.ok(ApiResponse.Success.ok("Delete employee successfully", null));
    }

    @GetMapping("/roles")
    public ResponseEntity<ApiResponse.Success<List<StaffAdminDto.RoleResponse>>> getRoles() {
        return ResponseEntity.ok(ApiResponse.Success.ok("Get roles successfully", staffAdminService.getRoles()));
    }

    @GetMapping("/permissions")
    public ResponseEntity<ApiResponse.Success<List<StaffAdminDto.PermissionResponse>>> getPermissions() {
        return ResponseEntity.ok(ApiResponse.Success.ok("Get permissions successfully", staffAdminService.getPermissions()));
    }
}
