import { User } from "../models/User.js";

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select("_id full_name email role createdAt").sort({ createdAt: -1 }).lean();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

export const grantAdminAccess = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.role = "admin";
    await user.save();

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        full_name: user.full_name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};
