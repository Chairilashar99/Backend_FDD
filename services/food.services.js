const { mongoConfig } = require("../config");
const MongoDb = require("./mongodb.services");

const getOneFoodById = async (foodId) => {
  try {
    let food = await MongoDb.db
      .collection(mongoConfig.collections.FOODS)
      .findOne({ id: foodId });
    if (food) {
      return {
        status: true,
        message: "Food found successfully",
        data: food,
      };
    } else {
      return {
        status: false,
        message: "No Food found",
      };
    }
  } catch (error) {
    return {
      status: false,
      message: "Food finding failed",
      error: `Food finding failed : ${error?.message}`,
    };
  }
};

module.exports = { getOneFoodById };
