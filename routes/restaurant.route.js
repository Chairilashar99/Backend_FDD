var express = require("express");
const {
  getAllRestaurant,
  getOneRestaurantById,
} = require("../services/restaurant.services");
var router = express.Router();

router.get("/", async (req, res) => {
  let response = await getAllRestaurant();
  res.json(response);
});

router.get("/:restaurantId", async (req, res) => {
  let restaurantId = req?.params?.restaurantId;
  let response = await getOneRestaurantById(restaurantId);
  res.json(response);
});

module.exports = router;
