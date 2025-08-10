const mongoose = require("mongoose");
const Product = require("./models/Product");

mongoose.connect("mongodb://localhost:27017/shopdb").then(async () => {
    await Product.deleteMany({});
    await Product.insertMany([
        { name: "Áo thun", price: 200000, category: "shirt", image: "/images/aothun.jpg" },
        { name: "Giày Nike", price: 1200000, category: "shoes", image: "/images/giayseaker.jpg" },
        { name: "Quần jean", price: 350000, category: "pants", image: "/images/quanjean.jpg" }
    ]);
    console.log("Seed done");
    process.exit();
});