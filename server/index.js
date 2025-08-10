const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 1. Connection to Database
mongoose.connect("mongodb://localhost:27017/shopdb")
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("MongoDB error: ", err))

// 2. Schema & model
const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    category: String,
    image: String
});

const Product = mongoose.model("Product", productSchema);

// 3. API Routes
app.get("/api/products", async(req, res)=> {
    const products  = await Product.find();
    res.json(products);
});

// 4. Start Sever
app.listen(5000, () => console.log("Server running on http://localhost:5000"));

