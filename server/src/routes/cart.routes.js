const express = require("express");
const ctrl = require("../controllers/cart.controller");
const router = express.Router();

router.get("/", ctrl.getCart);
router.post("/", ctrl.addItem);
router.patch("/:productId", ctrl.updateQty);
router.delete("/:productId", ctrl.removeItem);
router.delete("/", ctrl.clear);

module.exports = router;
