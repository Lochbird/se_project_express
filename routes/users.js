const router = require("express").Router();
const { getCurrentUser, updateProfile } = require("../controllers/users");
const { handleAuthorization } = require("../middlewares/auth");

router.get("/me/", handleAuthorization, getCurrentUser);
router.patch("/me/", handleAuthorization, updateProfile);

module.exports = router;
