import { CONFIG } from '@renderer/libs/config'

const BASE_URL = `${CONFIG.DEFAULT_BACKEND_URL}${CONFIG.API_PREFIX}`

export type RecordStatus = 'active' | 'inactive' | 'deleted'

export interface TagCategory {
  uuid: string
  code: string
  name: string
  description?: string | null
  status: RecordStatus
  createdAt?: string
  updatedAt?: string
}

export interface Supplier {
  uuid: string
  code: string
  name: string
  phone?: string | null
  email?: string | null
  address?: string | null
  taxCode?: string | null
  status: RecordStatus
  tagCategory: TagCategory
  createdAt?: string
  updatedAt?: string
}

export interface GoldType {
  uuid: string
  code: string
  name: string
  purity?: number | string | null
  description?: string | null
  status: RecordStatus
}

export interface Product {
  uuid: string
  code: string
  name: string
  categoryName: string
  unitName: string
  weight: number
  goldWeight: number
  stoneWeight: number
  laborCost: number
  stoneCost: number
  baseLaborCost: number
  baseStoneCost: number
  costPrice: number
  purchasePrice: number
  salePrice: number
  fixedPrice: boolean
  vatRate: number
  status: RecordStatus
  goldType?: GoldType | null
  supplier?: Supplier | null
}

export interface Customer {
  uuid: string
  code: string
  name: string
  phone?: string | null
  email?: string | null
  address?: string | null
  rankName?: string | null
  debtAmount: number
  status: RecordStatus
}

export interface Warehouse {
  uuid: string
  code: string
  name: string
  address?: string | null
  status: RecordStatus
}

export interface StockBalance {
  uuid: string
  warehouse: Warehouse
  product: Product
  quantity: number
  minQuantity: number
  locationCode?: string | null
  updatedAt?: string
}

export type InventoryMovementType = 'import' | 'transfer'

export interface InventoryMovement {
  uuid: string
  code: string
  movementType: InventoryMovementType
  sourceWarehouse?: Warehouse | null
  targetWarehouse?: Warehouse | null
  product: Product
  quantity: number
  unitCost?: number | null
  note?: string | null
  createdAt?: string
}

export type TransactionStatus = 'draft' | 'completed' | 'cancelled'
export type TransactionType = 'sale' | 'purchase' | 'returns' | 'adjustment'

export interface SaleTransactionDetail {
  product: Product
  warehouse?: Warehouse | null
  quantity: number
  unitPrice: number
  discountAmount: number
  totalAmount: number
}

export interface SaleTransaction {
  uuid: string
  code: string
  transactionType: TransactionType
  paymentMethod?: string | null
  totalAmount: number
  paidAmount: number
  changeAmount: number
  status: TransactionStatus
  customer?: Customer | null
  details: SaleTransactionDetail[]
  createdAt?: string
  updatedAt?: string
}

export type CashBookEntryType = 'income' | 'expense'

export interface CashBookEntry {
  uuid: string
  code: string
  entryType: CashBookEntryType
  paymentMethod?: string | null
  amount: number
  title: string
  description?: string | null
  status: RecordStatus
  occurredAt?: string
  createdAt?: string
  updatedAt?: string
}

export interface StaffRole {
  uuid: string
  code: string
  name: string
  description?: string | null
  status: RecordStatus
}

export interface StaffPermission {
  uuid: string
  code: string
  name: string
  description?: string | null
  scope?: string | null
}

export interface StaffEmployee {
  uuid: string
  employeeCode: string
  username: string
  fullName: string
  email?: string | null
  phone?: string | null
  positionName?: string | null
  status: RecordStatus
  role?: StaffRole | null
  createdAt?: string
  updatedAt?: string
}

export interface TagCategoryPayload {
  code: string
  name: string
  description?: string
  status?: RecordStatus
}

export interface SupplierPayload {
  tagCategoryUuid: string
  code: string
  name: string
  phone?: string
  email?: string
  address?: string
  taxCode?: string
  status?: RecordStatus
}

export interface GoldTypePayload {
  code: string
  name: string
  purity?: number | string
  description?: string
  status?: RecordStatus
}

export interface ProductPayload {
  goldTypeUuid?: string | null
  supplierUuid?: string | null
  code: string
  name: string
  categoryName: string
  unitName?: string
  weight?: number | string
  goldWeight?: number | string
  stoneWeight?: number | string
  laborCost?: number | string
  stoneCost?: number | string
  baseLaborCost?: number | string
  baseStoneCost?: number | string
  costPrice?: number | string
  purchasePrice?: number | string
  salePrice?: number | string
  fixedPrice?: boolean
  vatRate?: number | string
  status?: RecordStatus
}

export interface CustomerPayload {
  code: string
  name: string
  phone?: string
  email?: string
  address?: string
  rankName?: string
  debtAmount?: number | string
  status?: RecordStatus
}

export interface WarehousePayload {
  code: string
  name: string
  address?: string
  status?: RecordStatus
}

export interface StockBalancePayload {
  warehouseUuid: string
  productUuid: string
  quantity?: number | string
  minQuantity?: number | string
  locationCode?: string
}

export interface InventoryMovementPayload {
  movementType: InventoryMovementType
  sourceWarehouseUuid?: string | null
  targetWarehouseUuid?: string | null
  productUuid: string
  quantity?: number | string
  unitCost?: number | string
  note?: string
}

export interface SaleTransactionPayload {
  customerUuid?: string | null
  paymentMethod?: string
  discountAmount?: number | string
  paidAmount?: number | string
  details: Array<{
    productUuid: string
    warehouseUuid?: string | null
    quantity?: number | string
    unitPrice?: number | string
    discountAmount?: number | string
  }>
}

export interface CashBookEntryPayload {
  entryType: CashBookEntryType
  paymentMethod?: string
  amount?: number | string
  title: string
  description?: string
  occurredAt?: string
  status?: RecordStatus
}

export interface StaffEmployeePayload {
  employeeCode: string
  username: string
  password?: string
  fullName: string
  email?: string
  phone?: string
  positionName?: string
  roleUuid?: string | null
  status?: RecordStatus
}

async function requestApi<T>(path: string, token: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(init?.headers || {})
    }
  })

  const result = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(result?.detail || result?.msg || result?.message || 'Không thể xử lý dữ liệu')
  }

  return (result?.data ?? result) as T
}

export function getTagCategories(token: string, keyword = ''): Promise<TagCategory[]> {
  const query = keyword.trim() ? `?keyword=${encodeURIComponent(keyword.trim())}` : ''
  return requestApi<TagCategory[]>(`/catalog/tag-categories${query}`, token)
}

export function createTagCategory(
  token: string,
  payload: TagCategoryPayload
): Promise<TagCategory> {
  return requestApi<TagCategory>('/catalog/tag-categories', token, {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export function updateTagCategory(
  token: string,
  uuid: string,
  payload: TagCategoryPayload
): Promise<TagCategory> {
  return requestApi<TagCategory>(`/catalog/tag-categories/${uuid}`, token, {
    method: 'PUT',
    body: JSON.stringify(payload)
  })
}

export function deleteTagCategory(token: string, uuid: string): Promise<void> {
  return requestApi<void>(`/catalog/tag-categories/${uuid}`, token, { method: 'DELETE' })
}

export function getSuppliers(token: string, keyword = ''): Promise<Supplier[]> {
  const query = keyword.trim() ? `?keyword=${encodeURIComponent(keyword.trim())}` : ''
  return requestApi<Supplier[]>(`/business/suppliers${query}`, token)
}

export function createSupplier(token: string, payload: SupplierPayload): Promise<Supplier> {
  return requestApi<Supplier>('/business/suppliers', token, {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export function updateSupplier(
  token: string,
  uuid: string,
  payload: SupplierPayload
): Promise<Supplier> {
  return requestApi<Supplier>(`/business/suppliers/${uuid}`, token, {
    method: 'PUT',
    body: JSON.stringify(payload)
  })
}

export function deleteSupplier(token: string, uuid: string): Promise<void> {
  return requestApi<void>(`/business/suppliers/${uuid}`, token, { method: 'DELETE' })
}

export function getGoldTypes(token: string, keyword = ''): Promise<GoldType[]> {
  const query = keyword.trim() ? `?keyword=${encodeURIComponent(keyword.trim())}` : ''
  return requestApi<GoldType[]>(`/catalog/gold-types${query}`, token)
}

export function createGoldType(token: string, payload: GoldTypePayload): Promise<GoldType> {
  return requestApi<GoldType>('/catalog/gold-types', token, {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export function updateGoldType(
  token: string,
  uuid: string,
  payload: GoldTypePayload
): Promise<GoldType> {
  return requestApi<GoldType>(`/catalog/gold-types/${uuid}`, token, {
    method: 'PUT',
    body: JSON.stringify(payload)
  })
}

export function deleteGoldType(token: string, uuid: string): Promise<void> {
  return requestApi<void>(`/catalog/gold-types/${uuid}`, token, { method: 'DELETE' })
}

export function getProducts(token: string, keyword = ''): Promise<Product[]> {
  const query = keyword.trim() ? `?keyword=${encodeURIComponent(keyword.trim())}` : ''
  return requestApi<Product[]>(`/catalog/products${query}`, token)
}

export function createProduct(token: string, payload: ProductPayload): Promise<Product> {
  return requestApi<Product>('/catalog/products', token, {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export function updateProduct(
  token: string,
  uuid: string,
  payload: ProductPayload
): Promise<Product> {
  return requestApi<Product>(`/catalog/products/${uuid}`, token, {
    method: 'PUT',
    body: JSON.stringify(payload)
  })
}

export function deleteProduct(token: string, uuid: string): Promise<void> {
  return requestApi<void>(`/catalog/products/${uuid}`, token, { method: 'DELETE' })
}

export function getCustomers(token: string, keyword = ''): Promise<Customer[]> {
  const query = keyword.trim() ? `?keyword=${encodeURIComponent(keyword.trim())}` : ''
  return requestApi<Customer[]>(`/business/customers${query}`, token)
}

export function createCustomer(token: string, payload: CustomerPayload): Promise<Customer> {
  return requestApi<Customer>('/business/customers', token, {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export function updateCustomer(
  token: string,
  uuid: string,
  payload: CustomerPayload
): Promise<Customer> {
  return requestApi<Customer>(`/business/customers/${uuid}`, token, {
    method: 'PUT',
    body: JSON.stringify(payload)
  })
}

export function deleteCustomer(token: string, uuid: string): Promise<void> {
  return requestApi<void>(`/business/customers/${uuid}`, token, { method: 'DELETE' })
}

export function getWarehouses(token: string, keyword = ''): Promise<Warehouse[]> {
  const query = keyword.trim() ? `?keyword=${encodeURIComponent(keyword.trim())}` : ''
  return requestApi<Warehouse[]>(`/inventory/warehouses${query}`, token)
}

export function createWarehouse(token: string, payload: WarehousePayload): Promise<Warehouse> {
  return requestApi<Warehouse>('/inventory/warehouses', token, {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export function updateWarehouse(
  token: string,
  uuid: string,
  payload: WarehousePayload
): Promise<Warehouse> {
  return requestApi<Warehouse>(`/inventory/warehouses/${uuid}`, token, {
    method: 'PUT',
    body: JSON.stringify(payload)
  })
}

export function deleteWarehouse(token: string, uuid: string): Promise<void> {
  return requestApi<void>(`/inventory/warehouses/${uuid}`, token, { method: 'DELETE' })
}

export function getStockBalances(token: string): Promise<StockBalance[]> {
  return requestApi<StockBalance[]>('/inventory/stock-balances', token)
}

export function createStockBalance(
  token: string,
  payload: StockBalancePayload
): Promise<StockBalance> {
  return requestApi<StockBalance>('/inventory/stock-balances', token, {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export function updateStockBalance(
  token: string,
  uuid: string,
  payload: StockBalancePayload
): Promise<StockBalance> {
  return requestApi<StockBalance>(`/inventory/stock-balances/${uuid}`, token, {
    method: 'PUT',
    body: JSON.stringify(payload)
  })
}

export function deleteStockBalance(token: string, uuid: string): Promise<void> {
  return requestApi<void>(`/inventory/stock-balances/${uuid}`, token, { method: 'DELETE' })
}

export function getInventoryMovements(token: string): Promise<InventoryMovement[]> {
  return requestApi<InventoryMovement[]>('/inventory/movements', token)
}

export function createInventoryMovement(
  token: string,
  payload: InventoryMovementPayload
): Promise<InventoryMovement> {
  return requestApi<InventoryMovement>('/inventory/movements', token, {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export function getSaleTransactions(token: string): Promise<SaleTransaction[]> {
  return requestApi<SaleTransaction[]>('/sales/transactions', token)
}

export function createSaleTransaction(
  token: string,
  payload: SaleTransactionPayload
): Promise<SaleTransaction> {
  return requestApi<SaleTransaction>('/sales/transactions', token, {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export function getCashBookEntries(token: string): Promise<CashBookEntry[]> {
  return requestApi<CashBookEntry[]>('/finance/cash-book', token)
}

export function createCashBookEntry(
  token: string,
  payload: CashBookEntryPayload
): Promise<CashBookEntry> {
  return requestApi<CashBookEntry>('/finance/cash-book', token, {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export function updateCashBookEntry(
  token: string,
  uuid: string,
  payload: CashBookEntryPayload
): Promise<CashBookEntry> {
  return requestApi<CashBookEntry>(`/finance/cash-book/${uuid}`, token, {
    method: 'PUT',
    body: JSON.stringify(payload)
  })
}

export function deleteCashBookEntry(token: string, uuid: string): Promise<void> {
  return requestApi<void>(`/finance/cash-book/${uuid}`, token, { method: 'DELETE' })
}

export function getStaffEmployees(token: string): Promise<StaffEmployee[]> {
  return requestApi<StaffEmployee[]>('/admin/staff/employees', token)
}

export function createStaffEmployee(
  token: string,
  payload: StaffEmployeePayload
): Promise<StaffEmployee> {
  return requestApi<StaffEmployee>('/admin/staff/employees', token, {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export function updateStaffEmployee(
  token: string,
  uuid: string,
  payload: StaffEmployeePayload
): Promise<StaffEmployee> {
  return requestApi<StaffEmployee>(`/admin/staff/employees/${uuid}`, token, {
    method: 'PUT',
    body: JSON.stringify(payload)
  })
}

export function deleteStaffEmployee(token: string, uuid: string): Promise<void> {
  return requestApi<void>(`/admin/staff/employees/${uuid}`, token, { method: 'DELETE' })
}

export function getStaffRoles(token: string): Promise<StaffRole[]> {
  return requestApi<StaffRole[]>('/admin/staff/roles', token)
}

export function getStaffPermissions(token: string): Promise<StaffPermission[]> {
  return requestApi<StaffPermission[]>('/admin/staff/permissions', token)
}

export interface Company {
  uuid: string
  name: string
  address?: string | null
  phone?: string | null
  email?: string | null
  taxCode: string
  status: RecordStatus
  createdAt?: string
  updatedAt?: string
}

export interface CompanyPayload {
  name: string
  address?: string
  phone?: string
  email?: string
  taxCode: string
  status?: RecordStatus
}

export function getCompanies(token: string, keyword = ''): Promise<Company[]> {
  const query = keyword.trim() ? `?keyword=${encodeURIComponent(keyword.trim())}` : ''
  return requestApi<Company[]>(`/business/companies${query}`, token)
}

export function createCompany(token: string, payload: CompanyPayload): Promise<Company> {
  return requestApi<Company>('/business/companies', token, {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export function updateCompany(
  token: string,
  uuid: string,
  payload: CompanyPayload
): Promise<Company> {
  return requestApi<Company>(`/business/companies/${uuid}`, token, {
    method: 'PUT',
    body: JSON.stringify(payload)
  })
}

export function deleteCompany(token: string, uuid: string): Promise<void> {
  return requestApi<void>(`/business/companies/${uuid}`, token, { method: 'DELETE' })
}

