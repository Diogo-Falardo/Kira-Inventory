import {
  mysqlTable,
  mysqlSchema,
  tinyint,
  AnyMySqlColumn,
  foreignKey,
  primaryKey,
  bigint,
  int,
  index,
  varchar,
  text,
  json,
  timestamp,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const productSettings = mysqlTable(
  "product_settings",
  {
    productId: bigint("product_id", { mode: "number" })
      .notNull()
      .primaryKey()
      .references(() => products.productId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    productUnitPrice: bigint("product_unit_price", { mode: "number" }),
    productCurrentStock: int("product_current_stock").default(0).notNull(),
    productLowStockQuantity: int("product_low_stock_quantity")
      .default(5)
      .notNull(),
    productMoneyMade: bigint("product_money_made", {
      mode: "number",
    }).notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.productId],
      name: "product_settings_product_id",
    }),
  ],
);

export const products = mysqlTable(
  "products",
  {
    productId: bigint("product_id", { mode: "number" })
      .autoincrement()
      .notNull()
      .primaryKey(),
    shopOwnerId: bigint("shop_owner_id", { mode: "number" }).notNull(),
    productName: varchar("product_name", { length: 255 }).notNull(),
    productPrice: bigint("product_price", { mode: "number" }).notNull(),
    productDescription: text("product_description"),
    productImages: json("product_images"),
    productStockQuantity: int("product_stock_quantity"),
    productCategories: json("product_categories"),
    productDiscountPrice: bigint("product_discount_price", { mode: "number" }),
    isVisible: tinyint("is_visible").default(1).notNull(),
    isActive: tinyint("is_active").default(1).notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .onUpdateNow()
      .notNull(),
  },
  (table) => [
    index("idx_active_visible").on(table.isVisible, table.isActive),
    index("idx_shop_owner").on(table.shopOwnerId),
    primaryKey({ columns: [table.productId], name: "products_product_id" }),
  ],
);
