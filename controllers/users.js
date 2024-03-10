const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const User = require("../models/user");
const {
  ValidationError,
  NotFoundError,
  InternalServerError,
  UnauthorizedError,
  ConflictError,
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
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("User not found"));
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "User not found") {
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

  User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!email || !password) {
        throw new Error("Enter an email or password");
      }
      if (user) {
        throw new Error("This email already exists");
      }
      return bcrypt.hash(password, 10);
    })

    .then((hash) =>
      User.create({
        name,
        email,
        avatar,
        password: hash,
      }),
    )
    .then((user) => {
      const userPayload = user.toObject();
      delete userPayload.password;
      res.status(201).send({
        data: userPayload,
      });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Enter an email or password") {
        return res.status(ValidationError).send({
          message: err.message,
        });
      }
      if (err.message === "This email already exists") {
        return res.status(ConflictError).send({
          message: err.message,
        });
      }

      if (err.name === "ValidationError" || err.name === "CastError") {
        return res.status(ValidationError).send({
          message: err.message,
        });
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
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => {
      if (!user) {
        throw new Error("User not found");
      }
      res.status(200).send({ name: user.name, avatar: user.avatar });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "User not found") {
        return res.status(NotFoundError).send({
          message: `User not found with id ${userId}`,
        });
      }
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
      if (err.name === "ValidationError") {
        return res.status(ValidationError).send({
          message: err.message,
        });
      }
      return res.status(InternalServerError).send({
        message: `Error updating user with id ${userId}`,
      });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new Error("Enter an email or password");
  }

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.status(200).send({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Enter an email or password") {
        return res.status(ValidationError).send({
          message: err.message,
        });
      }
      if (err.name === "DocumentNotFoundError") {
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
