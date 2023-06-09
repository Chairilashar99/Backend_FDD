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
      let cartResponse = await getCartItems({ username });
      return {
        status: true,
        message: "Item Added to cart successfully",
        data: cartResponse?.data,
      };
    }
  } catch (error) {
    return {
      status: false,
      message: "Item Added to cart Failed",
    };
  }
};

const removeFromCart = async ({ foodId, username }) => {
  try {
    let cart = await MongoDb.db
      .collection(mongoConfig.collections.CARTS)
      .findOne({ foodId, username, count: 1 });
    if (cart) {
      await MongoDb.db
        .collection(mongoConfig.collections.CARTS)
        .deleteOne({ foodId, username });
      let cartResponse = await getCartItems({ username });
      return {
        status: true,
        message: "Item Remove from cart successfully",
        data: cartResponse?.data,
      };
    }
    let updatedCart = await MongoDb.db
      .collection(mongoConfig.collections.CARTS)
      .updateOne(
        { foodId, username },
        { $inc: { count: -1 } },
        { upsert: true }
      );
    if (updatedCart?.modifiedCount > 0 || updatedCart?.upsertedCount > 0) {
      let cartResponse = await getCartItems({ username });
      return {
        status: true,
        message: "Item Remove from cart successfully",
        data: cartResponse?.data,
      };
    }
  } catch (error) {
    return {
      status: false,
      message: "Item Remove from cart Failed",
    };
  }
};

const getCartItems = async ({ username }) => {
  try {
    let cartItems = await MongoDb.db
      .collection(mongoConfig.collections.CARTS)
      .aggregate([
        {
          $match: {
            username: username,
          },
        },
        {
          $lookup: {
            from: "foods",
            localField: "foodId",
            foreignField: "id",
            as: "food",
          },
        },
        {
          $unwind: {
            path: "$food",
          },
        },
      ])
      .toArray();
    if (cartItems?.length > 0) {
      let itemsTotal = cartItems
        ?.map((cartItem) => cartItem?.food?.price * cartItem?.count)
        .reduce((a, b) => parseFloat(a) + parseFloat(b));
      let discount = 0;
      return {
        status: true,
        message: "Cart items fetched successfully",
        data: {
          cartItems,
          metaData: {
            itemsTotal,
            discount,
            grandTotal: itemsTotal - discount,
          },
        },
      };
    } else {
      return {
        status: false,
        message: "Cart items not found",
      };
    }
  } catch (error) {
    return {
      status: false,
      message: "Cart items fetched Failed",
    };
  }
};

module.exports = { addToCart, removeFromCart, getCartItems };
