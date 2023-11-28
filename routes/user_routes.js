const express = require("express");
const router = express.Router();

const userController = require("../controllers/user_controller");
router.post('/getUserLogin', userController.getUserLogin);
router.post('/getUserDetail', userController.getUserDetail);
router.post('/updateUserProfile', userController.updateUserProfile);
router.post('/updateUserImage', userController.upload.single('image'), userController.updateUserImage);
router.get('/getContacUs', userController.getContacUs);
router.post('/getUSer', userController.getUSer);


module.exports = router;