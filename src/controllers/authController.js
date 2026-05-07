import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { User } from "../models/User.js";

const generateToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  });

export const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      _id: req.user._id,
      full_name: req.user.full_name,
      email: req.user.email,
      role: req.user.role
    }
  });
};

export const register = async (req, res, next) => {
  try {
    const { full_name, email, password } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ success: false, message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      full_name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "visitor"
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          _id: user._id,
          full_name: user.full_name,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    if (!user.password) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          _id: user._id,
          full_name: user.full_name,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    next(error);
  }
};
