const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Mock products data
const products = [
    {
        _id: "1",
        id: "1",
        name: "Áo thun",
        price: 150000,
        category: "shirt",
        image: "/images/aothun.jpg",
        description: "Áo thun cotton thoáng mát."
    },
    {
        _id: "2", 
        id: "2",
        name: "Giày sneaker",
        price: 850000,
        category: "shoes",
        image: "/images/giaysneaker.jpg",
        description: "Sneaker đế êm, đi học và đi chơi."
    },
    {
        _id: "3",
        id: "3", 
        name: "Quần jean",
        price: 350000,
        category: "pants",
        image: "/images/quanjean.jpg",
        description: "Quần jean unisex, co giãn nhẹ."
    },
    {
        _id: "4",
        id: "4",
        name: "Áo sơ mi",
        price: 250000,
        category: "shirt", 
        image: "/images/aosomi.jpg",
        description: "Áo sơ mi công sở lịch sự."
    },
    {
        _id: "5",
        id: "5",
        name: "Giày boot",
        price: 950000,
        category: "shoes",
        image: "/images/giayboot.jpg", 
        description: "Boot da thật, phong cách cá tính."
    },
    {
        _id: "6",
        id: "6",
        name: "Quần short",
        price: 180000,
        category: "pants",
        image: "/images/quanshort.jpg",
        description: "Quần short thể thao thoải mái."
    }
];

// Helper functions
const viCmp = (x = "", y = "") => x.localeCompare(y, "vi", { sensitivity: "base" });
const num = (v) => (typeof v === "number" ? v : Number(String(v || 0).replace(/[^\d.-]/g, "")) || 0);

// API Routes
app.get("/api/products", (req, res) => {
    try {
        const {
            q = "",            // search theo tên
            cat = "",          // category
            min = "",          // giá từ
            max = "",          // giá đến
            sort = "",         // price-asc|price-desc|name-asc|name-desc|category-asc|category-desc
        } = req.query;

        let list = [...products];

        // Search filter
        if (q) {
            const searchTerm = q.toLowerCase();
            list = list.filter(p => p.name.toLowerCase().includes(searchTerm));
        }

        // Category filter
        if (cat) {
            list = list.filter(p => p.category === cat);
        }

        // Price range filter
        const minPrice = Number(min) || 0;
        const maxPrice = Number(max) || Infinity;
        list = list.filter(p => num(p.price) >= minPrice && num(p.price) <= maxPrice);

        // Apply sorting
        if (sort === "price-asc") list.sort((a, b) => num(a.price) - num(b.price));
        if (sort === "price-desc") list.sort((a, b) => num(b.price) - num(a.price));
        if (sort === "name-asc") list.sort((a, b) => viCmp(a.name, b.name));
        if (sort === "name-desc") list.sort((a, b) => viCmp(b.name, a.name));
        if (sort === "category-asc") list.sort((a, b) => viCmp(a.category || "", b.category || ""));
        if (sort === "category-desc") list.sort((a, b) => viCmp(b.category || "", a.category || ""));

        res.json(list);
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

app.get("/api/products/:id", (req, res) => {
    try {
        const product = products.find(p => p.id === req.params.id || p._id === req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.json(product);
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: err.message || "Server error" });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Simple server running at http://localhost:${PORT}`);
    console.log(`📦 Serving ${products.length} products`);
});