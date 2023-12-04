const Database = require('../database/database');
const db = new Database()
const commonResponse = (status, message, data) => {
  return { status, message, data };
};

const placeOrder = (req, res) => {
  const { user_id, address_id, product_id, status, payment_type, date, time, note } = req.body;

  db.pool.query('INSERT INTO orders (user_id, address_id, product_id, status, payment_type, date, time, note) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', [user_id, address_id, product_id, status, payment_type, date, time, note], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        error: 'An error occurred while saving the data.',
      });
    }

    res.status(200).json({
      message: 'Data created successfully',
      data: result.rows[0],
      status: 1
    });
  });
};

const getOrder = async (req, res) => {
  try {
    const { user_id } = req.body;

    const orderQuery = 'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC';
    const orderValues = [user_id];
    const orderResult = await db.pool.query(orderQuery, orderValues);
    const orders = orderResult.rows;

    for (const order of orders) {
      const productIds = order.product_id.map(Number);

      const productQuery = 'SELECT * FROM products WHERE id IN (' + productIds.join(', ') + ')';
      const productResult = await db.pool.query(productQuery);
      const products = productResult.rows;

      order.products = products;
    }

    res.status(200).json({
      msg: "Data fetched successfully",
      data: orders,
      status: 1
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const GetOrders = async (req, res) => {
  try {
    const query = 'SELECT * FROM orders ORDER BY created_at DESC';
    const result = await db.pool.query(query);
    const orders = result.rows;

    for (const order of orders) {
      const productIds = order.product_id.map(Number);

      const productQuery = 'SELECT * FROM products WHERE id IN (' + productIds.join(', ') + ')';
      const productResult = await db.pool.query(productQuery);
      const products = productResult.rows;

      const addressQuery = 'SELECT * FROM address WHERE address_id = $1'; 
      const addressResult = await db.pool.query(addressQuery, [order.address_id]);
      const address = addressResult.rows[0];

      const userQuery = 'SELECT * FROM users WHERE user_id = $1';
      const userResult = await db.pool.query(userQuery, [order.user_id]);
      const user = userResult.rows[0];

      order.products = products;
      order.address = address;
      order.user = user;
    }

    res.status(200).json({
      msg: "Data fetched successfully", 
      data: orders, 
      status: 1
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



module.exports = {
  placeOrder,
  getOrder,
  GetOrders
};
