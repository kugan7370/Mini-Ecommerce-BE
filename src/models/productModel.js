import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    SKU: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        public_id: {
          type: String,
          required: true,
        },
      },
    ],
    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
