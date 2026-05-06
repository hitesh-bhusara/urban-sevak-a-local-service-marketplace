  require("dotenv").config();

  const mongoose = require("mongoose"); // Load mongoose directly
  const SuperAdmin = require("./models/superadmin");
  const bcrypt = require("bcryptjs");

  async function seedSuperAdmin() {
    try {
      // Connect to MongoDB using the correct env variable (MONGO_URI)
      await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/urbansevak");
      console.log("MongoDB connected for seeding...");

      // Check if admin already exists
      const existing = await SuperAdmin.findOne({ username: "admin" });
      if (existing) {
        console.log("SuperAdmin already exists!");
        process.exit(0);
      }

      // Create new admin
      const hashedPassword = await bcrypt.hash("admin123", 10);
      const admin = new SuperAdmin({
        username: "admin",
        password: hashedPassword
      });

      await admin.save();
      console.log("✅ SuperAdmin created successfully!");
      console.log("Username: admin");
      console.log("Password: admin123");
      process.exit(0);

    } catch (err) {
      console.error("❌ Seeding failed:", err);
      process.exit(1);
    }
  }

  // Run the function
  seedSuperAdmin();