import cloudinary from "../config/Cloudinary.js";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "../services/productService.js";
import CustomError from "../utils/customError.js";
import { errorResponse, successResponse } from "../utils/response.js";

const getProductsController = async (req, res) => {
  try {
    const products = await getProducts();
    successResponse(res, products, "Products retrieved successfully");
  } catch (error) {
    if (error instanceof CustomError) {
      errorResponse(res, error.message, error.message, error.statusCode);
    } else {
      errorResponse(res, error.message, "Failed to create user");
    }
  }
};

const getProductByIdController = async (req, res) => {
  try {
    const product = await getProductById(req.params.productId);
    successResponse(res, product, "Product retrieved successfully");
  } catch (error) {
    if (error instanceof CustomError) {
      errorResponse(res, error.message, error.message, error.statusCode);
    } else {
      errorResponse(res, error.message, "Failed to create user");
    }
  }
};

const createProductController = async (req, res) => {
  try {
    const newProduct = await createProduct(req);
    successResponse(res, newProduct, "Product created successfully", 201);
  } catch (error) {
    if (error instanceof CustomError) {
      errorResponse(res, error.message, error.message, error.statusCode);
    } else {
      errorResponse(res, error.message, "Failed to create product");
    }
  }
};

const updateProductController = async (req, res) => {
  try {
    const updatedProduct = await updateProduct(req);
    successResponse(res, updatedProduct, "Product updated successfully");
  } catch (error) {
    if (error instanceof CustomError) {
      errorResponse(res, error.message, error.message, error.statusCode);
    } else {
      errorResponse(res, error.message, "Failed to create user");
    }
  }
};

const deleteProductController = async (req, res) => {
  try {
    await deleteProduct(req.params.productId);
    successResponse(res, null, "Product deleted successfully");
  } catch (error) {
    if (error instanceof CustomError) {
      errorResponse(res, error.message, error.message, error.statusCode);
    } else {
      errorResponse(res, error.message, "Failed to create user");
    }
  }
};

export default {
  getProductsController,
  getProductByIdController,
  createProductController,
  updateProductController,
  deleteProductController,
};
