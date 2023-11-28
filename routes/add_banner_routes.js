const express = require("express");
const router = express.Router();

const add_bannerController = require("../controllers/add_banner_controller");
router.post('/upload', add_bannerController.upload.single('image'), add_bannerController.addBanner);
router.post('/getBanner', add_bannerController.getBanner);
router.post('/deleteBanner', add_bannerController.deleteBanner);

module.exports = router;