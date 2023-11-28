const express = require("express");
const router = express.Router();

const categoryController = require("../controllers/category_controller");
router.post('/upload', categoryController.upload.single('image'), categoryController.addCategory);
router.get('/getCategory', categoryController.getCategory);
router.post('/updateCategory', categoryController.updateCategory);
router.post('/deleteCategory', categoryController.deleteCategory);


module.exports = router;