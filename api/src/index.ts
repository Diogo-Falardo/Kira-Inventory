// dev config
const port = 999;
export const shopOwnerId = "000001";

// error constructor
export class HttpError extends Error {
  status: number;
  details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

// express
const express = require("express");
var cors = require("cors");
import { Request, Response, NextFunction } from "express";

const app = express();
app.use(express.json());

// use http Error
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof HttpError) {
    return res.status(err.status).json({
      message: err.message,
      details: err.details ?? null,
    });
  }

  console.error(err);
  return res.status(500).json({ message: "Internal server error" });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

// product router
import productRouter from "./system/route/product.route";
app.use("/product", productRouter);
