const mongoose = require("mongoose");
require('dotenv').config();

const ConnectDB = async () => {
  try {
    mongoose.set("sanitizeFilter", true);
    mongoose.set("strictQuery", true);

    await mongoose.connect(process.env.DataBase, {
      maxPoolSize: Number(process.env.MONGO_MAX_POOL_SIZE) || 20,
      serverSelectionTimeoutMS: Number(process.env.MONGO_SERVER_SELECTION_TIMEOUT_MS) || 5000,
      socketTimeoutMS: Number(process.env.MONGO_SOCKET_TIMEOUT_MS) || 45000,
    });
    console.log("Connected to MongoDB succesfully");
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = ConnectDB; // If you want to export this function
