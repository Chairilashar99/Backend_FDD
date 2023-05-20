var express = require("express");
const { getAllRestaurant } = require("../services/restaurant.services");
var router = express.Router();

router.get("/", async (req, res) => {
  let response = await getAllRestaurant();
  res.json(response);
});

module.exports = router;
