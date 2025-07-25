const express = require("express");
const router = express.Router();
const modelsController = require("../controllers/modelsController");

router.get("/", modelsController.getAllModels);
router.post("/", modelsController.addModel);
router.delete("/:id", modelsController.deleteModel);

module.exports = router;
