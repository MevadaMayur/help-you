const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin_controller");
router.post('/getUserLogin', adminController.getUserLogin);
router.post('/login', adminController.login);

module.exports = router;