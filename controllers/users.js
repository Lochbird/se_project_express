const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const User = require("../models/user");
const {
  ValidationError,
  NotFoundError,
  InternalServerError,
  UnauthorizedError,
} = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(InternalServerError).send({
        message: err.message,
      });
    });
};

const getCurrentUser = (req, res) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail()
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NotFoundError).send({
          message: `User not found with id ${userId}`,
        });
      }
      if (err.name === "CastError") {
        return res.status(ValidationError).send({
          message: `Invalid user id ${userId}`,
        });
      }
      return res.status(InternalServerError).send({
        message: `Error retrieving user with id ${userId}`,
      });
    });
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  const hashedPassword = bcrypt.hash(password, 10);
  User.create({
    name,
    email,
    avatar,
    password: hashedPassword,
  })
    .then((newUser) => {
      res.status(201).send({
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatar,
      });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(ValidationError).send({
          message: err.message,
        });
      }
      if (err.name === "CastError") {
        return res.status(ValidationError).send({
          message: err.message,
        });
      }
      if (err.name === "MongoError" && err.code === 11000) {
        throw new Error("Email already exists");
      }
      return res.status(InternalServerError).send({
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
        return res.status(NotFoundError).send({
          message: `User not found with id ${userId}`,
        });
      }
      if (err.name === "CastError") {
        return res.status(ValidationError).send({
          message: `Invalid user id ${userId}`,
        });
      }
      return res.status(InternalServerError).send({
        message: `Error retrieving user with id ${userId}`,
      });
    });
};

const updateProfile = (req, res) => {
  const userId = req.user._id;

  User.findByIdAndUpdate(userId)
    .orFail()
    .then((user) => {
      res.status(200).send({ name: user.name, avatar: user.avatar });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        throw new Error.status(NotFoundError)({
          message: `User not found with id ${userId}`,
        });
      }
      if (err.name === "CastError") {
        throw new Error.status(ValidationError).send({
          message: `Invalid user id ${userId}`,
        });
      }
      throw new Error.status(InternalServerError).send({
        message: `Error updating user with id ${userId}`,
      });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(200).send({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.name == "DocumentNotFoundError") {
        return res.status(ValidationError).send({
          message: "Invalid email or password",
        });
      }
      if (err.name === "UnauthorizedError") {
        return res.status(UnauthorizedError).send({
          message: "Invalid email or password",
        });
      }
      return res.status(InternalServerError).send({
        message: "Error logging in",
      });
    });
};

module.exports = {
  getUsers,
  createUser,
  getUserById,
  login,
  getCurrentUser,
  updateProfile,
};
