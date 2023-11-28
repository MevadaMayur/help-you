const express = require("express");
const router = express.Router();

const addressController = require("../controllers/address_controller");
router.post('/addAddress', addressController.addAddress);
router.post('/getAddress', addressController.getAddress);
router.post('/updateAddress', addressController.updateAddress);
router.post('/deleteAddress', addressController.deleteAddress);

module.exports = router;