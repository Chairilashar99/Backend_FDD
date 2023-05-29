var express = require("express");
const { addToCart, removeFromCart } = require("../services/cart.services");
var router = express.Router();

router.post("/:foodId", async (req, res) => {
  let { foodId } = req?.params;
  let username = req?.username;
  let response = await addToCart({ foodId, username });
  res.json(response);
});

router.delete("/:foodId", async (req, res) => {
  let { foodId } = req?.params;
  let username = req?.username;
  let response = await removeFromCart({ foodId, username });
  res.json(response);
});

module.exports = router;
