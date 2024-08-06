import cloudinary from "../config/Cloudinary.js";
import Product from "../models/productModel.js";
import CustomError from "../utils/customError.js";

const getProducts = async () => {
  const products = await Product.find();
  if (!products) {
    throw new CustomError("No products found", 404);
  }
  return products;
};

const getProductById = async (productId) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new CustomError("Product not found", 404);
  }
  return product;
};

const createProduct = async (req) => {
  const { quantity, productName, description } = req.body;

  // Generate SKU randomly that will be unique and #CA-#NUMBERS
  const SKU = "#CA-" + Math.random().toString(10).substring(2, 6);

  // Check if SKU already exists
  const existingProductBySKU = await Product.findOne({ SKU });
  if (existingProductBySKU) {
    throw new CustomError("Product already exists", 409);
  }

  // Get file images
  if (!req.files || req.files.length === 0) {
    throw new CustomError("No files were uploaded", 400);
  }

  const images = req.files.map((file) => file.path);

  // Save images into Cloudinary and get the URLs
  let cloudinaryImages;
  try {
    cloudinaryImages = await Promise.all(
      images.map(async (image) => {
        const { secure_url, public_id } = await cloudinary.uploader.upload(
          image
        );
        return { url: secure_url, public_id };
      })
    );
  } catch (uploadError) {
    throw new CustomError("Failed to upload images", 500);
  }

  // Create new product
  const newProduct = new Product({
    SKU,
    quantity,
    productName,
    images: cloudinaryImages,
    description,
  });

  try {
    await newProduct.save();
  } catch (saveError) {
    // Remove uploaded files from Cloudinary if saving to DB fails
    await Promise.all(
      cloudinaryImages.map(async (img) => {
        await cloudinary.uploader.destroy(img.public_id);
      })
    );
    throw new CustomError("Failed to save product", 500);
  }

  return newProduct;
};

const updateProduct = async (req) => {
  const { productId } = req.params;
  const { quantity, productName, description } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    throw new CustomError("Product not found", 404);
  }

  // Get file images
  let newImages = [];
  if (req.files && req.files.length > 0) {
    const images = req.files.map((file) => file.path);

    // Save images into Cloudinary and get the URLs
    try {
      newImages = await Promise.all(
        images.map(async (image) => {
          const { secure_url, public_id } = await cloudinary.uploader.upload(
            image
          );
          return { url: secure_url, public_id };
        })
      );
    } catch (uploadError) {
      throw new CustomError("Failed to upload images", 500);
    }
  }

  // Remove old images from Cloudinary if new images are provided
  if (newImages.length > 0) {
    await Promise.all(
      product.images.map(async (img) => {
        await cloudinary.uploader.destroy(img.public_id);
      })
    );
  }

  // Update product details
  product.quantity = quantity || product.quantity;
  product.productName = productName || product.productName;
  product.description = description || product.description;
  product.images = newImages.length > 0 ? newImages : product.images;

  try {
    await product.save();
  } catch (saveError) {
    // Rollback Cloudinary uploads if saving to DB fails
    if (newImages.length > 0) {
      await Promise.all(
        newImages.map(async (img) => {
          await cloudinary.uploader.destroy(img.public_id);
        })
      );
    }
    throw new CustomError("Failed to update product", 500);
  }

  return product;
};

const deleteProduct = async (productId) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new CustomError("Product not found", 404);
  }

  await Product.findByIdAndDelete(productId);

  return product;
};

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
