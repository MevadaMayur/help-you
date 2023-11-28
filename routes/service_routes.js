const express = require("express");
const router = express.Router();

const serviceController = require("../controllers/service_controller");
router.post('/upload', serviceController.upload.single('image'), serviceController.addService);
router.get('/getService', serviceController.getService);
router.post('/updateService', serviceController.updateService);
router.post('/deleteService', serviceController.deleteService);
router.post('/updateServiceImage', serviceController.upload.single('image'), serviceController.updateServiceImage);
module.exports = router;