const mongoose = require("mongoose");
const app = require("./app");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/shopdb";
const PORT = process.env.PORT || 5000;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => console.log(`🚀 API running at http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });
