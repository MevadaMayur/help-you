const express = require("express");
const router = express.Router();

const helpController = require("../controllers/help_controller");
router.post('/addHelp', helpController.addHelp);
router.get('/getHelp', helpController.getHelp);

module.exports = router;