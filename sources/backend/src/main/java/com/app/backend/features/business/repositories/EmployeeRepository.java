package com.app.backend.features.business.repositories;

import com.app.backend.entities.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Optional<Employee> findByAccountId(Long accountId);

    Optional<Employee> findByUuid(UUID uuid);

    @Query(value = """
            SELECT * FROM business.employees
            WHERE status != 'deleted'
            ORDER BY employee_code ASC
            """, nativeQuery = true)
    List<Employee> findForAdminListNative();

    @Modifying
    @Query(value = """
            INSERT INTO business.employees (
                uuid, fk_account_id, fk_company_id, fk_role_id, employee_code, position_name, status, created_at, updated_at
            ) VALUES (
                :uuid, :accountId, :companyId, :roleId, :employeeCode, :positionName, CAST(:status AS public.record_type), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
            )
            """, nativeQuery = true)
    int insertNative(
            @Param("uuid") UUID uuid,
            @Param("accountId") Long accountId,
            @Param("companyId") Long companyId,
            @Param("roleId") Long roleId,
            @Param("employeeCode") String employeeCode,
            @Param("positionName") String positionName,
            @Param("status") String status
    );

    @Modifying
    @Query(value = """
            UPDATE business.employees
            SET fk_role_id = :roleId,
                employee_code = :employeeCode,
                position_name = :positionName,
                status = CAST(:status AS public.record_type),
                updated_at = CURRENT_TIMESTAMP
            WHERE uuid = :uuid
            """, nativeQuery = true)
    int updateNative(
            @Param("uuid") UUID uuid,
            @Param("roleId") Long roleId,
            @Param("employeeCode") String employeeCode,
            @Param("positionName") String positionName,
            @Param("status") String status
    );

    @Modifying
    @Query(value = """
            UPDATE business.employees
            SET status = CAST('deleted' AS public.record_type),
                updated_at = CURRENT_TIMESTAMP
            WHERE uuid = :uuid
            """, nativeQuery = true)
    int softDeleteNative(@Param("uuid") UUID uuid);
}
