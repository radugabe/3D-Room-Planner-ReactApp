const express = require("express");
const router = express.Router();
const floorsController = require("../controllers/floorsController");

router.get("/", floorsController.getAllFloors);
router.get("/:id", floorsController.getFloorById);
router.post("/", floorsController.addFloor);
router.put("/:id", floorsController.updateFloor);
router.delete("/:id", floorsController.deleteFloor);

module.exports = router;
