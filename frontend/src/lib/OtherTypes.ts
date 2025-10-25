export interface Product {
  /** Unique product ID */
  id: number;
  /** Product description */
  description: string;
  /** Product price (in currency units) */
  price: number;
  /** Platform the product belongs to (e.g. Shopify) */
  platform: string;
  /** Internal SKU or code */
  internal_code: string;
  /** Last update timestamp (ISO 8601) */
  updated_at: string;
  /** Current stock available */
  available_stock: number;
  /** Owning user ID */
  user_id: number;
  /** Product name */
  name: string;
  /** Product cost (for you) */
  cost: number;
  /** Image URL (may be 'noimg') */
  img_url: string;
  /** Creation timestamp (ISO 8601) */
  created_at: string;
  /** Whether the product is inactive */
  inactive: boolean;
}
