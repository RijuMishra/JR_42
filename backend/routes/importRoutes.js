console.log("IMPORT ROUTES LOADED");
const express = require("express");
const router = express.Router();

const importController = require("../controllers/importController");
const upload = require("../middleware/uploadMiddleware");

router.post("/components", upload.single("file"), importController.importComponents);

module.exports = router;