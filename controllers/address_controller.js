const Database = require('../database/database');
const db = new Database()

const addAddress = (req, res) => {
    
    const {
        user_id,
        full_name,
        mobile,
        pincode,
        state,
        city,
        address_1,
        address_2,
        address_type,
      } = req.body;

    db.pool.query('INSERT INTO address (user_id,full_name,mobile,pincode,state,city,address_1,address_2,address_type) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *', [user_id,full_name,mobile,pincode,state,city,address_1,address_2,address_type], (err, result) => {
        if (err) {
            console.log(err);
            throw err;
        }
        res.status(200).json({
            msg: "Data created successfully",
            data: result.rows[0],
            status: 1
        });
    });
};

const getAddress = (req, res) => {
    const { user_id } = req.body;
  
    db.pool
      .query('SELECT * FROM address WHERE user_id = $1 AND is_deleted = false ORDER BY created_at DESC', [user_id])
      .then((result) => {
        res.json({
          status: 200,
          message: 'Product list',
          data: result.rows,
        });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({
          status: 500,
          error: 'An error occurred while fetching data from the database.',
        });
      });
  };
  
  const updateAddress = (req, res) => {
    const {
      user_id,
      full_name,
      mobile,
      pincode,
      state,
      city,
      address_1,
      address_2,
      address_id
    } = req.body;
  
    const updateQuery = `
      UPDATE address
      SET
      user_id = $1,
      full_name = $2,
      mobile = $3,
      pincode = $4,
      state = $5,
      city = $6,
      address_1 = $7,
      address_2 = $8
      WHERE
        address_id = $9
      RETURNING *
    `;
  
    const values = [
      user_id,
      full_name,
      mobile,
      pincode,
      state,
      city,
      address_1,
      address_2,
      address_id
    ];
  
    try {
      db.pool.query(updateQuery, values, (error, result) => {
        if (error) {
          console.error('Error occurred during address update:', error);
          const response = {
            status: 500,
            error: 'Internal server error',
            message: 'Something went wrong',
          };
          res.status(500).json(response);
        } else {
          const updatedRecord = result.rows;
          const response = {
            status: 200,
            message: 'Address updated successfully',
            data: updatedRecord,
          };
          res.status(200).json(response);
        }
      });
    } catch (error) {
      console.error('Error occurred during address update:', error);
      const response = {
        status: 500,
        error: 'Internal server error',
        message: 'Something went wrong',
      };
      res.status(500).json(response);
    }
  };
  
  const deleteAddress = async (req, res) => {
    const { address_id } = req.body;
  
    try {
      const query = 'UPDATE address SET is_deleted = true WHERE address_id = $1 RETURNING *';
      const values = [address_id];
  
      const result = await db.pool.query(query, values);
  
      res.status(200).json({
        msg: "Data fetched successfully",
        data: result.rows,
        status: 1
      });
    } catch (error) {
      console.error('Error deleting products:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  

module.exports = {
    addAddress,
    getAddress,
    updateAddress,
    deleteAddress 
};