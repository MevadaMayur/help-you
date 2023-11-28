const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const PORT = 8000;
const bodyParser = require('body-parser');
const cors = require('cors'); 

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/images', express.static('uploads'));

app.use(express.json());

app.use(cors());

app.get("/", (req, res) => {
    res.send("hello from express")
})

app.use('/urls', express.static('urls'));

const serviceRoutes = require('./routes/service_routes');
app.use('/service', serviceRoutes);
const categoryRoutes = require('./routes/category_routes');
app.use('/category', categoryRoutes);
const sub_categoryRoutes = require('./routes/sub_category_routes');
app.use('/sub_category', sub_categoryRoutes);
const productRoutes = require('./routes/product_routes');
app.use('/product', productRoutes);
const addressRoutes = require('./routes/address_routes');
app.use('/address', addressRoutes);
const adminRoutes = require('./routes/admin_routes');
app.use('/admin', adminRoutes);
const homeRoutes = require('./routes/home_routes');
app.use('/home', homeRoutes);
const userRoutes = require('./routes/user_routes');
app.use('/user', userRoutes);
const orderRoutes = require('./routes/order_routes');
app.use('/order', orderRoutes);
const add_bannerRoutes = require('./routes/add_banner_routes');
app.use('/add_banner', add_bannerRoutes);
const helpRoutes = require('./routes/help_routes');
app.use('/help', helpRoutes);

app.listen(PORT, () => console.log('Server is running on', PORT));
