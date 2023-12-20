const express = require("express");
const router = express.Router();

const productController = require("../controllers/product_controller");
router.post('/addProduct', productController.addProduct);
router.get('/getProduct', productController.getProduct);
router.post('/deleteProduct', productController.deleteProduct);

module.exports = router;