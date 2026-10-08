package com.app.backend.features.business.repositories;

import com.app.backend.common.enums.RecordType;
import com.app.backend.entities.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByUuid(UUID uuid);

    List<Role> findTop100ByStatusNotOrderByName(RecordType status);

    @Query(value = """
            SELECT * FROM auth.roles
            WHERE status != 'deleted'
            ORDER BY name ASC
            LIMIT 100
            """, nativeQuery = true)
    List<Role> findRolesNative();
}
