const express = require("express");
const router = express.Router();

const sub_categoryController = require("../controllers/sub_category_controller");
router.post('/upload', sub_categoryController.upload.single('image'), sub_categoryController.addSubcategory);
router.get('/getSubcategory', sub_categoryController.getSubcategory);
router.post('/updateSubcategory', sub_categoryController.updateSubcategory);
router.post('/deleteSubcategory', sub_categoryController.deleteSubcategory);

module.exports = router;