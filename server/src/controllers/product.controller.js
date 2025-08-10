const Product = require("../models/Product");
const Product = require("../models/Product");

// map sort key từ FE
const SORT_MAP = {
    "price-asc": { price: 1 },
    "price-desc": { price: -1 },
    "name-asc": { name: 1 },
    "name-desc": { name: -1 },
};

exports.getAll = async (req, res, next) => {
    try {
        const {
            q = "",            // search theo tên
            cat = "",          // category đúng như DB lưu
            min = "",          // giá từ
            max = "",          // giá đến
            sort = "",         // price-asc|price-desc|name-asc|name-desc
            page = 1,          // trang hiện tại
            limit = 12,        // số item/trang
        } = req.query;

        const filter = {};
        if (q) {
            // tìm không phân biệt hoa/thường và (gần như) bỏ dấu bằng collation
            filter.name = { $regex: q, $options: "i" };
        }
        if (cat) filter.category = cat;

        const price = {};
        if (min !== "" && !isNaN(min)) price.$gte = Number(min);
        if (max !== "" && !isNaN(max)) price.$lte = Number(max);
        if (Object.keys(price).length) filter.price = price;

        const sortOption = SORT_MAP[sort] || { createdAt: -1 };
        const pageNum = Math.max(1, Number(page));
        const pageSize = Math.min(100, Math.max(1, Number(limit)));

        // collation để bỏ dấu/hoa-thường tốt hơn (Mongo 3.4+)
        const collation = { locale: "vi", strength: 1 };

        const [items, total] = await Promise.all([
            Product.find(filter).collation(collation)
                .sort(sortOption)
                .skip((pageNum - 1) * pageSize)
                .limit(pageSize),
            Product.countDocuments(filter),
        ]);

        res.json({
            items,
            pagination: {
                page: pageNum,
                limit: pageSize,
                total,
                totalPages: Math.max(1, Math.ceil(total / pageSize)),
            },
        });
    } catch (err) {
        next(err);
    }
};

// GET /api/products  -> trả về MẢNG (khớp FE hiện tại)
exports.getAll = async (req, res, next) => {
    try {
        const docs = await Product.find().sort({ createdAt: -1 });
        res.json(docs); // mảng các product (đã có id nhờ toJSON)
    } catch (err) {
        next(err);
    }
};

// GET /api/products/:id
exports.getById = async (req, res, next) => {
    try {
        const doc = await Product.findById(req.params.id);
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
