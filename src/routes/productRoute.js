import productController from "../controllers/productController.js";
import express from "express";
import upload from "../middleware/multer.js";
import verifyUserToken from "../middleware/verifyUserToken.js";
import { validate } from "../validation/index.js";
import {
  createProductValidationRules,
  updateProductValidationRules,
} from "../validation/productValidation.js";

const router = express.Router();

router.post(
  "/create",
  verifyUserToken,
  validate(createProductValidationRules),
  upload.array("images"),
  productController.createProductController
);
router.get("/", productController.getProductsController);
router.put(
  "/:productId",
  verifyUserToken,
  validate(updateProductValidationRules),
  upload.array("images"),
  productController.updateProductController
);
router.get("/:productId", productController.getProductByIdController);
router.delete(
  "/:productId",
  verifyUserToken,
  productController.deleteProductController
);

export default router;
