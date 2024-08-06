import productController from "../controllers/productController.js";
import express from "express";
import upload from "../middleware/multer.js";

const router = express.Router();

router.post(
  "/create",
  upload.array("images"),
  productController.createProductController
);
router.get("/", productController.getProductsController);
router.put(
  "/:productId",
  upload.array("images"),
  productController.updateProductController
);
router.get("/:productId", productController.getProductByIdController);
router.delete("/:productId", productController.deleteProductController);

export default router;
