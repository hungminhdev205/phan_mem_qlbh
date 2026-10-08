CREATE TABLE IF NOT EXISTS inventory.inventory_movements (
    id BIGINT GENERATED ALWAYS AS IDENTITY,
    uuid UUID NOT NULL DEFAULT uuidv7(),
    code VARCHAR(50) NOT NULL,
    movement_type VARCHAR(30) NOT NULL,
    fk_source_warehouse_id BIGINT,
    fk_target_warehouse_id BIGINT,
    fk_product_id BIGINT NOT NULL,
    quantity NUMERIC(18, 3) NOT NULL,
    unit_cost NUMERIC(18, 2),
    note VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_inventory_movements PRIMARY KEY (id),
    CONSTRAINT uq_inventory_movements_code UNIQUE (code),
    CONSTRAINT ck_inventory_movements_type CHECK (movement_type IN ('import', 'transfer')),
    CONSTRAINT ck_inventory_movements_quantity CHECK (quantity > 0),
    CONSTRAINT fk_inventory_movements_source_warehouse FOREIGN KEY (fk_source_warehouse_id)
        REFERENCES inventory.warehouses (id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_inventory_movements_target_warehouse FOREIGN KEY (fk_target_warehouse_id)
        REFERENCES inventory.warehouses (id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_inventory_movements_product FOREIGN KEY (fk_product_id)
        REFERENCES catalog.products (id) ON DELETE RESTRICT ON UPDATE CASCADE
);
