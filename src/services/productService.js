import cloudinary from "../config/Cloudinary.js";
import Product from "../models/productModel.js";
import CustomError from "../utils/customError.js";

const getProducts = async (query) => {
  const { productName } = query;
  let products;

  if (productName) {
    // Fetch related data based on the productName query parameter
    products = await Product.find({
      productName: new RegExp(productName, "i"),
    });
  } else {
    // Fetch all data
    products = await Product.find();
  }

  if (!products.length) {
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
  const { quantity, productName, description, price, SKU } = req.body;

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
    price,
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
  const { quantity, productName, description, price, SKU } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    throw new CustomError("Product not found", 404);
  }

  // Get file images
  let newImages = [];
  if (req.files && req.files.length > 0) {
    console.log("req.files", req.files);
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
  product.price = price || product.price;
  product.SKU = SKU || product.SKU;
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
