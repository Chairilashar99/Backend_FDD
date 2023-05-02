var express = require("express");
var router = express.Router();
const {
  userRegister,
  userLogin,
} = require("../services/authentication.services");

router.post("/register", async (req, res, next) => {
  let body = req.body;
  //   console.log(body);
  let response = await userRegister(body);
  res.json(response);
});

router.post("/login", async (req, res, next) => {
  let body = req.body;
  //   console.log(body);
  let response = await userLogin(body);
  res.json(response);
});

module.exports = router;
