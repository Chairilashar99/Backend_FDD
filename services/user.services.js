const { mongoConfig } = require("../config");
const MongoDb = require("./mongodb.services");

const getUserData = async (username) => {
  try {
    let userObject = await MongoDb.db
      .collection(mongoConfig.collections.USERS)
      .findOne({ username });

    if (userObject) {
      return {
        status: true,
        message: "User found successfully",
        data: userObject,
      };
    } else {
      return {
        status: false,
        message: "User not found",
      };
    }
  } catch (error) {
    return {
      status: false,
      message: "User finding failed",
      error: `User finding failed: ${error?.message}`,
    };
  }
};

module.exports = { getUserData };
