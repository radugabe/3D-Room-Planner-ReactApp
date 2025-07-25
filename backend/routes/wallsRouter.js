const express = require("express");
const router = express.Router();
const wallsController = require("../controllers/wallsController");

router.get("/", wallsController.getAllWalls);
router.get("/:id", wallsController.getWallById);
router.post("/", wallsController.addWall);
router.delete("/:id", wallsController.deleteWall);

module.exports = router;
