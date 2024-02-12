const User = require("../models/user");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({
        message: err.message,
      });
      // ATTN, don't use hardcoded numbers (like 500) in your code.
      // Instead, use the built-in status codes from the http module.
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(400).send({
          message: err.message,
        });
      }
      return res.status(500).send({
        message: err.message,
      });
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail()
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(404).send({
          message: `User not found with id ${userId}`,
        });
      }
      if (err.name === "CastError") {
        return res.status(400).send({
          message: `Invalid user id ${userId}`,
        });
      }
      return res.status(500).send({
        message: `Error retrieving user with id ${userId}`,
      });
    });
};

module.exports = { getUsers, createUser, getUserById };
