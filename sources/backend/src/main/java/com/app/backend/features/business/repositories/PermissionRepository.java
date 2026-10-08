package com.app.backend.features.business.repositories;

import com.app.backend.entities.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, Long> {
    List<Permission> findTop200ByOrderByCode();

    @Query(value = """
            SELECT * FROM auth.permissions
            ORDER BY code ASC
            LIMIT 200
            """, nativeQuery = true)
    List<Permission> findPermissionsNative();
}
