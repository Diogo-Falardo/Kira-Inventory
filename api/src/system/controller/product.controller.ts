import { Request, Response, NextFunction } from "express";
import { HttpError } from "../..";
import { ShopOwnerId } from "../..";
import {
  ProductCreateSchema,
  ProductPatchSchema,
} from "../../db/schemas/product.schema";
import { ProductService } from "../service/product.service";
import { zId } from "../utils/helpers";
import { pickDefined } from "../utils/helpers";
import { object } from "zod";

export const ProductController = {
  /**
   * Create a new product for the user
   * @param req shopOwnerId and Requested dto for product creation
   * @param res
   * @param next
   */
  async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = ProductCreateSchema.parse(req.body);

      // validates if user has alredy a product with that name
      const hasProduct = await ProductService.hasProductWithName(
        ShopOwnerId,
        dto.productName,
      );
      if (hasProduct === true)
        throw new HttpError(400, "product already exists");

      const newProduct = await ProductService.create(ShopOwnerId, dto);

      res.status(201).json(newProduct);
    } catch (err) {
      next(err);
    }
  },

  async patchProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = ProductPatchSchema.parse(req.body);
      const productId = zId.parse(req.params.id);

      // validate if the user is owner of that product
      const product = await ProductService.itsProductOwnedByUser(
        ShopOwnerId,
        productId,
      );
      if (!product) throw new HttpError(400, "Product not found!");

      const updateData = pickDefined({
        productName: dto.productName,
        productPrice: dto.productPrice,
        productDiscountPrice: dto.productDiscountPrice,
        productDescription: dto.productDescription,
        productImages: dto.productImages,
        productStockQuantity: dto.productStockQuantity,
        productCategories: dto.productCategories,
      });

      if (Object.keys(updateData).length === 0) {
        return res.status(200).json(product);
      }

      const updated = await ProductService.patch(productId, dto);

      return res.status(200).json(updated);
    } catch (err) {
      console.log(err);
      next(err);
    }
  },

  async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const productId = zId.parse(req.params.id);

      // validate if the user is owner of that product
      const product = await ProductService.itsProductOwnedByUser(
        ShopOwnerId,
        productId,
      );
      if (!product) throw new HttpError(400, "Product not found!");

      await ProductService.delete(productId);

      return res.status(200).json("product deleted!");
    } catch (err) {
      next(err);
    }
  },
};
