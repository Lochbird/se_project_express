const router = require("express").Router();
const { handleAuthorization } = require("../middlewares/auth");

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItem");

router.get("/", getItems);

router.post("/", handleAuthorization, createItem);
router.delete("/:itemId", handleAuthorization, deleteItem);

router.put("/:itemId/likes", handleAuthorization, likeItem);
router.delete("/:itemId/likes", handleAuthorization, dislikeItem);

module.exports = router;
