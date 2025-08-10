const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  name: String,
  price: Number,
  image: String,
  qty: { type: Number, default: 1, min: 1 }
});

const cartSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  items: [cartItemSchema]
}, { timestamps: true });

cartSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => { ret.id = ret._id; delete ret._id; },
});

module.exports = mongoose.model("Cart", cartSchema);
