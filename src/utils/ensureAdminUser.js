import bcrypt from "bcryptjs";

import { User } from "../models/User.js";

export const ensureAdminUser = async () => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminFullName = process.env.ADMIN_FULL_NAME || "مدير النظام";

  if (!adminEmail || !adminPassword) {
    return null;
  }

  const existing = await User.findOne({ email: adminEmail.toLowerCase() });

  if (existing) {
    if (existing.role !== "admin") {
      existing.role = "admin";
      await existing.save();
    }
    return existing;
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const admin = await User.create({
    full_name: adminFullName,
    email: adminEmail.toLowerCase(),
    password: hashedPassword,
    role: "admin"
  });

  return admin;
};
