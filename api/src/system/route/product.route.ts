import { Router } from "express";
const router = Router();

import { ProductController } from "../controller/product.controller";

router.post("/create", ProductController.createProduct);

export default router;
