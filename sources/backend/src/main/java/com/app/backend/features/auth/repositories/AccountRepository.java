package com.app.backend.features.auth.repositories;

import com.app.backend.entities.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AccountRepository extends JpaRepository<Account, Long> {
    /**
     * Get user infor by accountId
     * @param accountId The account id
     * @return String
     */
    @Query(value = "SELECT auth.get_account_info(:accountId)::text", nativeQuery = true)
    String getAccountInfo(@Param("accountId") Long accountId);
}
