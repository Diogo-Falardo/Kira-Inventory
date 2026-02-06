import { Request, Response, NextFunction } from "express";
import { HttpError } from "../..";
import { ShopOwnerId } from "../..";
import { ProductCreateSchema } from "../../db/schemas/product.schema";
import { ProductService } from "../service/product.service";

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

      const newProduct = await ProductService.create(ShopOwnerId, dto);

      res.status(201).json(newProduct);
    } catch (err) {
      next(err);
    }
  },
};
