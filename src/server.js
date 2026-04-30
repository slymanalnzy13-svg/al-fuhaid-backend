import dotenv from "dotenv";

dotenv.config();

import app from "./app.js";
import { connectDatabase } from "./config/db.js";
import { ensureAdminUser } from "./utils/ensureAdminUser.js";
import { ensureRootPerson } from "./utils/ensureRootPerson.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDatabase();
  await ensureRootPerson();
  await ensureAdminUser();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
