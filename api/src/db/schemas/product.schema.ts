import { z } from "zod";
import { PriceInEuros } from "../../system/utils/helpers";

/**
 * Product table
 */

// Product category enum
export const ProductCategoryEnum = z.enum([
  "category_1",
  "category_2",
  "category_3",
]);

/**
 * Base of the product
 * All items that are:
 * - Aplication Controlled
 * - Not null
 */
export const ProductBase = z.object({
  productId: z.number(),
  shopOwnerId: z.number(),
  productName: z.string().trim().min(1).max(40),
  productPrice: PriceInEuros,
  isVisible: z.number().int().min(1).max(1),
  isActive: z.number().int().min(1).max(1),
  createdAt: z.string().trim(),
  updatedAt: z.string().trim(),
});

/**
 * Extended Base of the products
 * Optional items
 */
export const ProductBaseExtended = ProductBase.extend({
  productDescription: z.string().trim().max(500).nullable().optional(),
  productImages: z
    .array(
      z.string().trim().min(1, { message: "Image entry cannot be empty" }),
      // No .url() — accept file_id, relative path, temp name, anything
    )
    .max(10, { message: "Maximum 10 images per product" })
    .optional()
    .default([]),
  productStockQuantity: z
    .number()
    .int()
    .positive({ message: "Price must be positive!" })
    .nullable()
    .optional(),
  productCategories: ProductCategoryEnum.optional().nullable(),
  productDiscountPrice: PriceInEuros.optional().nullable(),
});

// Simple Product Visualization
export const ProductOut = ProductBaseExtended.omit({
  shopOwnerId: true,
  isVisible: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
});

/**
 * Complex Product Visualization
 * Only the owner or alloweds should see this output
 */
export const ProductOutOwner = ProductBaseExtended.omit({
  shopOwnerId: true,
});
export type ProductOutOwner = z.infer<typeof ProductOutOwner>;

// Product Create
export const ProductCreateSchema = ProductBaseExtended.omit({
  productId: true,
  shopOwnerId: true,
  isVisible: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
});
export type ProductCreateDto = z.infer<typeof ProductCreateSchema>;

// Product Patch
export const ProductPatchSchema = ProductBaseExtended.omit({
  productId: true,
  shopOwnerId: true,
  createdAt: true,
  updatedAt: true,
}).partial({
  productName: true,
  productPrice: true,
  isActive: true,
  isVisible: true,
});
export type ProductPatchDto = z.infer<typeof ProductPatchSchema>;
