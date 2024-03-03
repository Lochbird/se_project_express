const validateNewUser = (req, res, next) => {
  const { error } = newUserSchema.validate(req.body);

  if (error) {
    return res
      .status(ValidationError)
      .send({ message: error.details[0].message });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { error } = loginSchema.validate(req.body);

  if (error) {
    return res
      .status(ValidationError)
      .send({ message: error.details[0].message });
  }

  next();
};

module.exports = { validateNewUser, validateLogin };
