const ClothingItem = require("../models/clothingItem");
const {
  ValidationError,
  NotFoundError,
  InternalServerError,
} = require("../utils/errors");

const createItem = (req, res) => {
  console.log(req, req.body);

  const { name, weather, imageURL } = req.body;

  ClothingItem.create({ name, weather, imageURL })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      console.log(err);
      if (err.name === "ValidationError") {
        return res.status(ValidationError).send({ message: err.message });
      }
      return res
        .status(InternalServerError)
        .send({ message: "Error creating item", err });
    });
};
const getItems = (req, res) => {
  ClothingItem.find({})
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.error(err);
      return res
        .status(InternalServerError)
        .send({ message: "Error getting item", err });
    });
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageURL } = req.body;
  console.log({ itemId, imageURL });

  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageURL } })
    .orFail()
    .then((item) => res.status(200).send({ item }))
    .catch((err) => {
      console.error(err);
      return res
        .status(InternalServerError)
        .send({ message: "Error updating item", err });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  const { imageURL } = req.body;
  console.log({ itemId, imageURL });

  ClothingItem.findByIdAndDelete(itemId, { $set: { imageURL } })
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
        .send({ message: "Error deleting item", err });
    });
};

const likeItem = (req, res) => {
  const { itemId } = req.params;
  const { userId } = req.body;
  console.log({ itemId, userId });

  ClothingItem.findByIdAndUpdate(itemId, { $addToSet: { likes: userId } })
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
        .send({ message: "Error liking item", err });
    });
};

const dislikeItem = (req, res) => {
  const { itemId } = req.params;
  const { userId } = req.body;
  console.log({ itemId, userId });

  ClothingItem.findByIdAndUpdate(itemId, { $pull: { likes: userId } })
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
        .send({ message: "Error disliking item", err });
    });
};

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
