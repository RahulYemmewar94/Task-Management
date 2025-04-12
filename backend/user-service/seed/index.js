import Role from "../models/Role.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Permission from "../models/Permission.js";

dotenv.config();

console.log("Initializing roles...", process.env.MONGO_URI);
const connectToDatabase = async () => {
  try {
    const mongoURI =
      process.env.MONGO_URI || "mongodb://localhost:27017/user-service";
    console.log("connecting to MongoDB...", mongoURI);
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

connectToDatabase();

export const initializeRoles = async () => {
  try {
    const existingRoles = await Role.find();

    if (existingRoles.length === 0) {
      await Role.insertMany([{ role: "admin" }, { role: "user" }]);
      console.log("✅ Default roles inserted: admin & user");
    } else {
      console.log("ℹ️ Roles already exist, skipping initialization.");
    }
  } catch (error) {
    console.error("❌ Error inserting default roles:", error);
  }
};

export const initializePermissions = async () => {
  try {
    const existingPermissions = await Permission.find();
    if (existingPermissions.length === 0) {
      await Permission.insertMany([
        { name: "create_user" },
        { name: "delete_user" },
        { name: "update_user" },
        { name: "read_user" },
        { name: "manage_roles" },
        { name: "manage_permissions" },
      ]);
      console.log("✅ Default permissions inserted.");
    } else {
      console.log("ℹ️ Permissions already exist, skipping initialization.");
    }
  } catch (error) {
    console.error("❌ Error inserting default permissions:", error);
  }
};

const initializeData = async () => {
  await initializeRoles();
  await initializePermissions();
  mongoose.connection.close();
};

initializeData();
