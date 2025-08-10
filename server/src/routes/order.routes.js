const express = require("express");
const ctrl = require("../controllers/order.controller");
const router = express.Router();

router.post("/", ctrl.createOrder);
router.get("/:id", ctrl.getOrder);

module.exports = router;
