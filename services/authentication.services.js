const MongoDB = require("./mongodb.services");
const { mongoConfig, tokenSecret } = require("../config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userRegister = async (user) => {
  try {
    if (!user?.username || !user.email || !user.password)
      return { status: false, message: "Please fill up all the fields" };
    const passwordHash = await bcrypt.hash(user?.password, 10);
    let userObject = {
      username: user?.username,
      email: user?.email,
      password: passwordHash,
    };
    let savedUser = await MongoDB.db
      .collection(mongoConfig.collections.USERS)
      .insertOne(userObject);
    if (savedUser?.acknowledged && savedUser.insertedId) {
      let token = jwt.sign(
        { username: userObject?.username, email: userObject?.email },
        tokenSecret,
        { expiresIn: "24h" }
      );
      return {
        status: true,
        messsage: "user registered successfully",
        data: token,
      };
    } else {
      return {
        status: false,
        messsage: "user registered failed",
      };
    }
  } catch (error) {
    console.log(error);
    let errorMessage = "User registered failed";
    error?.code === 11000 && error?.keyPattern?.username
      ? (errorMessage = "Username already in use")
      : null;
    error?.code === 11000 && error?.keyPattern?.email
      ? (errorMessage = "Email already in use")
      : null;
    return {
      status: false,
      messsage: errorMessage,
      error: error?.toString(),
    };
  }
};

const userLogin = async (user) => {
  try {
    if (!user?.username || !user.password)
      return { status: false, message: "Please fill up all the fields" };
    let userObject = await MongoDB.db
      .collection(mongoConfig.collections.USERS)
      .findOne({ username: user?.username });
    if (userObject) {
      let isPasswordVerified = await bcrypt.compare(
        user?.password,
        userObject?.password
      );
      if (isPasswordVerified) {
        let token = jwt.sign(
          { username: userObject?.username, email: userObject?.email },
          tokenSecret,
          { expiresIn: "24h" }
        );
        return {
          status: true,
          messsage: "user login successful",
          data: token,
        };
      } else {
        return {
          status: false,
          messsage: "Incorrect password",
        };
      }
    } else {
      return {
        status: false,
        messsage: "No user found",
      };
    }
  } catch (error) {
    console.log(error);
    return {
      status: false,
      messsage: "User login failed",
      error: error?.toString(),
    };
  }
};

module.exports = { userRegister, userLogin };
