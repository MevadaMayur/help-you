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

function addLeadingZero(number) {
  return number < 10 ? `0${number}` : number.toString();
}

function convertUTCToIST(utcDateString) {
  const utcDate = new Date(utcDateString);

  const indianTimeOffsetMinutes = 330;

  utcDate.setMinutes(utcDate.getMinutes() + indianTimeOffsetMinutes);

  const day = addLeadingZero(utcDate.getDate());
  const month = addLeadingZero(utcDate.getMonth() + 1); 
  const year = utcDate.getFullYear().toString().slice(-2);

  const formattedDate = `${day}-${month}-${year}`;

  return formattedDate;
}

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

const utcDateString = '2023-10-04T12:30:00Z';
const istDate = convertUTCToIST(utcDateString);

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

const updateStatus = async (req, res) => {
  const { status, id } = req.body;

  try {
    const queryOldStatus = 'SELECT status FROM orders WHERE id = $1';
    const valuesOldStatus = [id];
    const oldStatusResult = await db.pool.query(queryOldStatus, valuesOldStatus);
    const oldStatus = oldStatusResult.rows[0].status;

    const updateOrderQuery = 'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *';
    const updateOrderValues = [status, id];
    const result = await db.pool.query(updateOrderQuery, updateOrderValues);

    const insertHistoryQuery = 'INSERT INTO order_status_history (id, old_status, new_status) VALUES ($1, $2, $3)';
    const insertHistoryValues = [id, oldStatus, status];
    await db.pool.query(insertHistoryQuery, insertHistoryValues);

    res.status(200).json({
      status: 200,
      message: 'Order status updated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error occurred during order status update:', error);
    const response = {
      status: 500,
      error: 'Internal server error',
      message: 'Something went wrong: ' + error.message,
    };
    res.status(500).json(response);
  }
};

module.exports = {
  placeOrder,
  getOrder,
  GetOrders,
  updateStatus
};
