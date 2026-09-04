import mongoose from "mongoose";
import config from "../config";
import { AdminModel } from "../modules/admin/admin.model";

async function run() {
  await mongoose.connect(config.database_url as string);

  const exists = await AdminModel.findOne({ email: "admin@yourapp.com" });
  if (exists) {
    console.log("Admin already exists");
    process.exit(0);
  }

  await AdminModel.create({
    name: "Admin",
    email: "admin@gmail.com",
    password: "admin@123",
  });

  console.log("Admin created");
  process.exit(0);
}

run();
