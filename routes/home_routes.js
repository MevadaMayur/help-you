const express = require("express");
const router = express.Router();

const homeController = require("../controllers/home_controller");
router.get('/gethome', homeController.gethome);

module.exports = router;