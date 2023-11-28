const Database = require('../database/database');
const db = new Database()
const commonResponse = (status, message, data) => {
  return { status, message, data };
};

const addProduct = (req, res) => {
    const { product_name, product_mrp, sub_category_id } = req.body;
  
    db.pool.query('INSERT INTO products (product_name, product_mrp, sub_category_id) VALUES($1, $2, $3) RETURNING *', [product_name, product_mrp, sub_category_id], (err, result) => {
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

  const getProduct = async (req, res) => {
    try {
      const query = `
          SELECT p.*, sc.name AS sub_category_name
          FROM products p
          INNER JOIN sub_category sc ON sc.id = p.sub_category_id::integer
          WHERE disable_mrp = true
        `;
  
      const result = await db.pool.query(query);
  
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching Service:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  
  

 
module.exports = {
    addProduct,
    getProduct    
};
