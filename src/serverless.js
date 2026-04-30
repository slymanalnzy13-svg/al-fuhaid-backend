import mongoose from "mongoose";
import app from "./app.js";
import { connectDatabase } from "./config/db.js";
import { ensureAdminUser } from "./utils/ensureAdminUser.js";
import { ensureRootPerson } from "./utils/ensureRootPerson.js";

let isConnected = false;

const initialize = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  await connectDatabase();
  isConnected = true;
  await ensureRootPerson();
  await ensureAdminUser();
};

export default async function handler(req, res) {
  try {
    await initialize();
    return app(req, res);
  } catch (error) {
    console.error("Init error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}
