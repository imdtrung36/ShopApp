const mongoose = require("mongoose");
const Product = require("./src/models/Product");

mongoose.connect("mongodb://localhost:27017/shopdb")
  .then(async () => {
    await Product.deleteMany({});
    await Product.insertMany([
      { name: "Áo thun", price: 150000, category: "shirt", image: "/images/aothun.jpg" },
      { name: "Quần jean", price: 350000, category: "pants", image: "/images/quanjean.jpg" },
      { name: "Giày sneaker", price: 850000, category: "shoes", image: "/images/giaysneaker.jpg" }
    ]);
    console.log("✅ Seed done");
    process.exit();
  })
  .catch(err => console.error(err));
