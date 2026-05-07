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
    let shouldSave = false;

    if (existing.role !== "admin") {
      existing.role = "admin";
      shouldSave = true;
    }

    if (existing.full_name !== adminFullName) {
      existing.full_name = adminFullName;
      shouldSave = true;
    }

    const hasStoredPassword = typeof existing.password === "string" && existing.password.length > 0;
    const passwordMatches = hasStoredPassword
      ? await bcrypt.compare(adminPassword, existing.password)
      : false;
    if (!passwordMatches) {
      existing.password = await bcrypt.hash(adminPassword, 10);
      shouldSave = true;
    }

    if (shouldSave) {
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
