package com.app.backend.features.auth.repositories;

import com.app.backend.entities.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AuthRepository extends JpaRepository<Account, Long> {
    Optional<Account> findByUsername(String username);

    @Modifying
    @Query(value = """
            INSERT INTO auth.accounts (uuid, username, password, status, created_at, updated_at)
            VALUES (:uuid, :username, :password, CAST(:status AS public.record_type), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            """, nativeQuery = true)
    int insertNative(
            @Param("uuid") UUID uuid,
            @Param("username") String username,
            @Param("password") String password,
            @Param("status") String status
    );

    @Modifying
    @Query(value = """
            UPDATE auth.accounts
            SET username = :username,
                status = CAST(:status AS public.record_type),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = :id
            """, nativeQuery = true)
    int updateNative(
            @Param("id") Long id,
            @Param("username") String username,
            @Param("status") String status
    );

    @Modifying
    @Query(value = """
            UPDATE auth.accounts
            SET username = :username,
                password = :password,
                status = CAST(:status AS public.record_type),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = :id
            """, nativeQuery = true)
    int updateWithPasswordNative(
            @Param("id") Long id,
            @Param("username") String username,
            @Param("password") String password,
            @Param("status") String status
    );

    @Modifying
    @Query(value = """
            UPDATE auth.accounts
            SET status = CAST('deleted' AS public.record_type),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = :id
            """, nativeQuery = true)
    int softDeleteNative(@Param("id") Long id);
}
