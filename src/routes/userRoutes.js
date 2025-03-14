const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authenticate = require("../middlewares/authenticate");
const authorizeRoles = require("../middlewares/authorizeRoles");

router.get("/", authenticate, authorizeRoles("admin"), userController.getAllUsers);
router.get("/:id", authenticate, userController.getUserById);
router.post("/", userController.createUser);
router.put("/:id", authenticate, userController.updateUser);
router.delete("/:id", authenticate, authorizeRoles("admin"), userController.deleteUser);

module.exports = router;
