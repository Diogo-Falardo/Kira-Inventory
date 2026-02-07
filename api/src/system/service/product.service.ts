import { db } from "../../db/index";
import { eq, and } from "drizzle-orm";

// schemas
import { products } from "../../db/_drizzle/schema";
// types
import {
  ProductOutOwner,
  ProductCreateDto,
  ProductPatchDto,
} from "../../db/schemas/product.schema";
import { HttpError } from "../..";

/**
 * Service for table: Product Service
 */
export const ProductService = {
  /**
   * Checks if the user has already a product with that name
   * @param shopOwnerId
   * @param productName
   * @returns boolean
   */
  async hasProductWithName(
    shopOwnerId: number,
    productName: string,
  ): Promise<Boolean> {
    try {
      const product = await db
        .select()
        .from(products)
        .where(
          and(
            eq(products.shopOwnerId, shopOwnerId),
            eq(products.productName, productName),
          ),
        )
        .limit(1);
      const row = product[0];
      if (!row) return false;
      else return true;
    } catch (err) {
      throw new HttpError(500, "finding product!");
    }
  },

  /**
   * Verify if the user owns that product
   * @param shopOwnerId
   * @param productId
   * @returns
   */
  async itsProductOwnedByUser(
    shopOwnerId: number,
    productId: number,
  ): Promise<ProductOutOwner | Boolean> {
    try {
      const product = await db
        .select()
        .from(products)
        .where(
          and(
            eq(products.shopOwnerId, shopOwnerId),
            eq(products.productId, productId),
          ),
        )
        .limit(1);
      const row = product[0];
      if (!row) return false;
      else return ProductOutOwner.parse(row);
    } catch (err) {
      throw new HttpError(500, "Error finding product!");
    }
  },

  /**
   * Get a product by id
   * @param productId
   * @param shopOwnerId
   * @returns product
   */
  async getProductById(productId: number): Promise<ProductOutOwner> {
    try {
      const product = await db
        .select()
        .from(products)
        .where(eq(products.productId, productId))
        .limit(1);
      const row = product[0];
      if (!row) {
        throw new HttpError(404, "product not found!");
      }

      return ProductOutOwner.parse(row);
    } catch (err) {
      throw new HttpError(500, "Error finding product");
    }
  },

  // create a product
  async create(
    shopOwnerId: number,
    dto: ProductCreateDto,
  ): Promise<ProductOutOwner> {
    try {
      const newProduct = await db
        .insert(products)
        .values({
          shopOwnerId: shopOwnerId,
          productName: dto.productName,
          productPrice: dto.productPrice,
          productCategories: dto.productCategories ?? null,
          productDescription: dto.productDescription ?? null,
          productDiscountPrice: dto.productDiscountPrice ?? null,
          productImages: dto.productImages ?? [],
          productStockQuantity: dto.productStockQuantity ?? null,
        })
        .$returningId();

      const id = newProduct[0].productId;
      const product = await this.getProductById(id);

      return ProductOutOwner.parse(product);
    } catch (err) {
      throw new HttpError(500, "Error creating new product!");
    }
  },

  // updates a product
  async patch(
    productId: number,
    dto: ProductPatchDto,
  ): Promise<ProductOutOwner> {
    try {
      await db
        .update(products)
        .set(dto)
        .where(eq(products.productId, productId));

      const updated = await this.getProductById(productId);

      return ProductOutOwner.parse(updated);
    } catch (err) {
      throw new HttpError(500, "Error updating product");
    }
  },

  // deletes a product
  async delete(productId: number): Promise<boolean> {
    try {
      await db.delete(products).where(eq(products.productId, productId));

      return true;
    } catch (err) {
      throw new HttpError(500, "Error creating product");
    }
  },
};
