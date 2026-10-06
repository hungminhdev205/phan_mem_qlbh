package com.app.backend.features.auth.repositories;

import com.app.backend.entities.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AuthRepository extends JpaRepository<Account, Long> {
    /**
     * Find account by username
     * @param username The username by user
     * @return Account
     */
    Optional<Account> findByUsername(String username);

}
