const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/urbansevak")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));