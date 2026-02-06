import { relations } from "drizzle-orm/relations";
import { products, productSettings } from "./schema";

export const productSettingsRelations = relations(productSettings, ({one}) => ({
	product: one(products, {
		fields: [productSettings.productId],
		references: [products.productId]
	}),
}));

export const productsRelations = relations(products, ({many}) => ({
	productSettings: many(productSettings),
}));