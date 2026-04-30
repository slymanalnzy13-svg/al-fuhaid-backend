import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    full_name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["visitor", "admin"],
      default: "visitor"
    }
  },
  {
    timestamps: true
  }
);

export const User = mongoose.model("User", userSchema);
