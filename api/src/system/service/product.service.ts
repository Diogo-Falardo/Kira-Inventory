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
   * @param ShopOwnerId
   * @param productName
   * @returns boolean
   */
  async _hasProductWithName(
    ShopOwnerId: number,
    productName: string,
  ): Promise<Boolean> {
    try {
      const product = await db
        .select()
        .from(products)
        .where(
          and(
            eq(products.shopOwnerId, ShopOwnerId),
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
   * Get a product by id
   * @param productId
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
      throw new HttpError(500, "finding product");
    }
  },

  async create(
    ShopOwnerId: number,
    dto: ProductCreateDto,
  ): Promise<ProductOutOwner> {
    // validates if user has alredy a product with that name
    const hasProduct = await this._hasProductWithName(
      ShopOwnerId,
      dto.productName,
    );
    if (hasProduct === true) throw new HttpError(400, "product already exists");

    const newProduct = await db
      .insert(products)
      .values({
        shopOwnerId: ShopOwnerId,
        productName: dto.productName,
        productPrice: dto.productPrice.toFixed(),
        productCategories: dto.productCategories ?? null,
        productDescription: dto.productDescription ?? null,
        productDiscountPrice: dto.productDiscountPrice?.toFixed(2) ?? null,
        productImages: dto.productImages ?? [],
        productStockQuantity: dto.productStockQuantity ?? null,
      })
      .$returningId();

    const id = newProduct[0].productId;
    const product = await this.getProductById(id);

    return ProductOutOwner.parse(product);
  },
};
