const Cart = require("../models/Cart");
const Order = require("../models/Order");

const getUserId = (req) => req.header("x-user-id") || "guest";

exports.createOrder = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    const { name, phone, address } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const totalQty = cart.items.reduce((s, i) => s + i.qty, 0);
    const totalPrice = cart.items.reduce((s, i) => s + i.qty * i.price, 0);

    const order = await Order.create({
      userId,
      items: cart.items,
      totalQty,
      totalPrice,
      customer: { name, phone, address }
    });

    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (e) { next(e); }
};

exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (e) { next(e); }
};
