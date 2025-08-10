const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  image: String,
});

productSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => { ret.id = ret._id; delete ret._id; },
});

module.exports = mongoose.model("Product", productSchema);
