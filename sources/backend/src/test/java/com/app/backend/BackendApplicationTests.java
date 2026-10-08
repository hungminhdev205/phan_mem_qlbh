package com.app.backend;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.app.backend.features.business.repositories.*;

import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
class BackendApplicationTests {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private WarehouseRepository warehouseRepository;

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private GoldTypeRepository goldTypeRepository;

    @Autowired
    private TagCategoryRepository tagCategoryRepository;

    @Autowired
    private SaleTransactionRepository saleTransactionRepository;

    @Autowired
    private CashBookEntryRepository cashBookEntryRepository;

    @Autowired
    private StockBalanceRepository stockBalanceRepository;

    @Autowired
    private InventoryMovementRepository inventoryMovementRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Test
    void contextLoadsAndDataSeededProperly() {
        assertTrue(companyRepository.count() >= 1, "Company count should be at least 1");
        assertTrue(productRepository.count() >= 18, "Product count should be at least 18");
        assertTrue(customerRepository.count() >= 10, "Customer count should be at least 10");
        assertTrue(warehouseRepository.count() >= 4, "Warehouse count should be at least 4");
        assertTrue(supplierRepository.count() >= 6, "Supplier count should be at least 6");
        assertTrue(goldTypeRepository.count() >= 7, "Gold type count should be at least 7");
        assertTrue(tagCategoryRepository.count() >= 6, "Tag category count should be at least 6");
        assertTrue(saleTransactionRepository.count() >= 8, "Sale transaction count should be at least 8");
        assertTrue(cashBookEntryRepository.count() >= 12, "Cash book entry count should be at least 12");
        assertTrue(stockBalanceRepository.count() >= 18, "Stock balance count should be at least 18");
        assertTrue(inventoryMovementRepository.count() >= 8, "Inventory movement count should be at least 8");
    }
}
