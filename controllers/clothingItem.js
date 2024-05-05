const clothingItem = require("../models/clothingItem");
const {
  ValidationError,
  NotFoundError,
  InternalServerError,
  ForbiddenError,
} = require("../utils/errors");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  clothingItem
    .create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(ValidationError).send({ message: err.message });
      }
      return res
        .status(InternalServerError)
        .send({ message: "Error creating item" });
    });
};

const getItems = (req, res) => {
  clothingItem
    .find({})
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.error(err);
      return res
        .status(InternalServerError)
        .send({ message: "Error getting item" });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  clothingItem
    .findById(itemId)
    .orFail()
    .then((item) => {
      if (String(item.owner) !== String(req.user._id)) {
        throw new Error("User not authorized to delete item");
      }
      return item.remove();
    })
    .then(() => res.status(200).send({ message: "Item deleted" }))
    .catch((err) => {
      console.error(err);
      if (err.message === "User not authorized to delete item") {
        return res.status(ForbiddenError).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res
          .status(ValidationError)
          .send({ message: `Item not found with id ${itemId}` });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NotFoundError)
          .send({ message: `Invalid item id ${itemId}` });
      }
      return res
        .status(InternalServerError)
        .send({ message: "Error deleting item" });
    });
};

const likeItem = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  clothingItem
    .findByIdAndUpdate(itemId, { $addToSet: { likes: userId } }, { new: true })
    .orFail()
    .then((item) => res.status(200).send({ item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res
          .status(ValidationError)
          .send({ message: `Item not found with id ${itemId}` });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NotFoundError)
          .send({ message: `Invalid item id ${itemId}` });
      }
      return res
        .status(InternalServerError)
        .send({ message: "Error liking item" });
    });
};

const dislikeItem = (req, res) => {
  const { itemId } = req.params;

  clothingItem
    .findByIdAndUpdate(
      itemId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .orFail()
    .then((item) => res.status(200).send({ item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res
          .status(ValidationError)
          .send({ message: `Item not found with id ${itemId}` });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NotFoundError)
          .send({ message: `Invalid item id ${itemId}` });
      }
      return res
        .status(InternalServerError)
        .send({ message: "Error disliking item" });
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
