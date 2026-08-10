const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const mongoose = require("mongoose");
const CoreValuesFramework = require("../Models/CoreValuesFrameworkSchema");
const { defaultCoreValuesFramework } = require("../Controllers/coreValuesFrameworkController");

const seedCoreValuesFramework = async () => {
  if (!process.env.DataBase) {
    throw new Error("DataBase environment variable is missing.");
  }

  await mongoose.connect(process.env.DataBase, {
    maxPoolSize: Number(process.env.MONGO_MAX_POOL_SIZE) || 20,
    serverSelectionTimeoutMS: Number(process.env.MONGO_SERVER_SELECTION_TIMEOUT_MS) || 5000,
    socketTimeoutMS: Number(process.env.MONGO_SOCKET_TIMEOUT_MS) || 45000,
  });

  const result = await CoreValuesFramework.updateOne(
    { title: defaultCoreValuesFramework.title, highlight: defaultCoreValuesFramework.highlight },
    { $setOnInsert: defaultCoreValuesFramework },
    { upsert: true }
  );

  console.log(
    `Core values framework seed complete. Inserted: ${result.upsertedCount || 0}, existing skipped: ${
      result.upsertedCount ? 0 : 1
    }`
  );
};

seedCoreValuesFramework()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
  });
