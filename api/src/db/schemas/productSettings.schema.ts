import { z } from "zod";
import { PriceInEuros } from "../../system/utils/helpers";

/**
 * Product Settings table
 */

// Base of Product Settings
export const ProductSettingsBase = z.object({
  productId: z.number(),
  productCurrentStock: z.number().int(),
  productMoneyMade: PriceInEuros,
});

// Extended Base of the product settings
export const ProductSettingsBaseExtended = ProductSettingsBase.extend({
  productUnitPrice: PriceInEuros.optional().nullable(),
  productLowStockQuantity: z
    .number()
    .positive({ message: "Price must be positive!" })
    .nullable()
    .optional(),
});
