package com.app.backend.features.business.repositories;

import com.app.backend.entities.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, Long> {
    Optional<Profile> findByAccountId(Long accountId);

    @Modifying
    @Query(value = """
            INSERT INTO auth.profiles (uuid, fk_account_id, full_name, email, phone, created_at, updated_at)
            VALUES (:uuid, :accountId, :fullName, :email, :phone, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            """, nativeQuery = true)
    int insertNative(
            @Param("uuid") UUID uuid,
            @Param("accountId") Long accountId,
            @Param("fullName") String fullName,
            @Param("email") String email,
            @Param("phone") String phone
    );

    @Modifying
    @Query(value = """
            UPDATE auth.profiles
            SET full_name = :fullName,
                email = :email,
                phone = :phone,
                updated_at = CURRENT_TIMESTAMP
            WHERE fk_account_id = :accountId
            """, nativeQuery = true)
    int updateByAccountIdNative(
            @Param("accountId") Long accountId,
            @Param("fullName") String fullName,
            @Param("email") String email,
            @Param("phone") String phone
    );
}
