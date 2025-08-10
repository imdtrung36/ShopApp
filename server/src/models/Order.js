const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  name: String,
  price: Number,
  image: String,
  qty: Number,
});

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [orderItemSchema],
  totalQty: Number,
  totalPrice: Number,
  customer: {
    name: String,
    phone: String,
    address: String
  },
  status: { type: String, default: "created" }
}, { timestamps: true });

orderSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => { ret.id = ret._id; delete ret._id; },
});

module.exports = mongoose.model("Order", orderSchema);
