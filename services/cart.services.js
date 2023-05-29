const { mongoConfig } = require("../config");
const MongoDb = require("./mongodb.services");

const addToCart = async ({ foodId, username }) => {
  try {
    let updatedCart = await MongoDb.db
      .collection(mongoConfig.collections.CARTS)
      .updateOne(
        { foodId, username },
        { $inc: { count: 1 } },
        { upsert: true }
      );
    if (updatedCart?.modifiedCount > 0 || updatedCart?.upsertedCount > 0) {
      return {
        status: true,
        message: "Item Added to cart successfully",
      };
    }
  } catch (error) {
    return {
      status: false,
      message: "Item Added to cart Failed",
    };
  }
};

module.exports = { addToCart };
