const Product = require("../models/Product");

// Mock data fallback nếu MongoDB không có
const mockProducts = [
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

// map sort key từ FE
const SORT_MAP = {
    "price-asc": { price: 1 },
    "price-desc": { price: -1 },
    "name-asc": { name: 1 },
    "name-desc": { name: -1 },
    "category-asc": { category: 1 },
    "category-desc": { category: -1 },
};

// Helper functions for mock data
const viCmp = (x = "", y = "") => x.localeCompare(y, "vi", { sensitivity: "base" });
const num = (v) => (typeof v === "number" ? v : Number(String(v || 0).replace(/[^\d.-]/g, "")) || 0);

// GET /api/products  -> trả về MẢNG (khớp FE hiện tại)
exports.getAll = async (req, res, next) => {
    try {
        let products;
        
        // Try MongoDB first, fallback to mock data
        try {
            products = await Product.find().sort({ createdAt: -1 });
        } catch (mongoErr) {
            console.log("Using mock data (MongoDB not available)");
            products = [...mockProducts];
        }

        const {
            q = "",            // search theo tên
            cat = "",          // category đúng như DB lưu
            min = "",          // giá từ
            max = "",          // giá đến
            sort = "",         // price-asc|price-desc|name-asc|name-desc|category-asc|category-desc
        } = req.query;

        // Apply filters to mock data if using fallback
        if (products === mockProducts || products.length === 0) {
            let list = [...mockProducts];

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

            products = list;
        }

        res.json(products);
    } catch (err) {
        next(err);
    }
};

// GET /api/products/:id
exports.getById = async (req, res, next) => {
    try {
        let doc;
        
        // Try MongoDB first, fallback to mock data
        try {
            doc = await Product.findById(req.params.id);
        } catch (mongoErr) {
            doc = mockProducts.find(p => p.id === req.params.id || p._id === req.params.id);
        }
        
        if (!doc) return res.status(404).json({ message: "Product not found" });
        res.json(doc);
    } catch (err) {
        next(err);
    }
};

// POST /api/products
exports.create = async (req, res, next) => {
    try {
        const doc = await Product.create(req.body);
        res.status(201).json(doc);
    } catch (err) {
        next(err);
    }
};

// PUT /api/products/:id
exports.update = async (req, res, next) => {
    try {
        const doc = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!doc) return res.status(404).json({ message: "Product not found" });
        res.json(doc);
    } catch (err) {
        next(err);
    }
};

// DELETE /api/products/:id
exports.remove = async (req, res, next) => {
    try {
        const doc = await Product.findByIdAndDelete(req.params.id);
        if (!doc) return res.status(404).json({ message: "Product not found" });
        res.json({ message: "Deleted" });
    } catch (err) {
        next(err);
    }
};
