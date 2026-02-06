import { z } from "zod";

/**
 * Product Settings table
 */

// Base of Product Settings
export const ProductSettingsBase = z.object({
  productId: z.bigint(),
  productCurrentStock: z.number().int(),
  productMoneyMade: z.number().positive({ message: "Price must be positive!" }),
});

// Extended Base of the product settings
export const ProductSettingsBaseExtended = ProductSettingsBase.extend({
  productUnitPrice: z
    .number()
    .positive({ message: "Price must be positive!" })
    .nullable()
    .optional(),
  productLowStockQuantity: z
    .number()
    .positive({ message: "Price must be positive!" })
    .nullable()
    .optional(),
});
