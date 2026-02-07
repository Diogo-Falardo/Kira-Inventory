import { Router } from "express";
const router = Router();

import { ProductController } from "../controller/product.controller";

router.post("/create", ProductController.createProduct);

router.patch("/update/:id", ProductController.patchProduct);

router.delete("/delete/:id", ProductController.deleteProduct);

export default router;
