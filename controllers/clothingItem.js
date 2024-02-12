const ClothingItem = require("../models/clothingItem");

const createItem = (req, res) => {
  console.log(req, req.body);

  const { name, weather, imageURL } = req.body;

  ClothingItem.create({ name, weather, imageURL })
    .then((item) => {
      console.log(item);
      res.status(201).send(item);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ message: "Error creating item", err });
    });
};
const getItems = (req, res) => {
  ClothingItem.find({})
    .then((item) => {
      res.status(200).send(item);
    })
    .catch((err) => {
      res.status(500).send({ message: "Error getting item", err });
    });
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageURL } = req.body;
  console.log({ itemId, imageURL });

  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageURL } })
    .orFail()
    .then((item) => {
      res.status(200).send({ item });
    })
    .catch((err) => {
      res.status(500).send({ message: "Error updating item", err });
    });
};

module.exports = { createItem, getItems, updateItem };
