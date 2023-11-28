const Database = require('../database/database');
const db = new Database()
const multer = require('multer');
const commonResponse = (status, message, data) => {
  return { status, message, data };
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

const addSubcategory = (req, res) => {
    const { name, category_id } = req.body;
  
    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded.',
      });
    }
  
    const image = req.file.filename;
  
    db.pool.query('INSERT INTO sub_category (name, image, category_id) VALUES($1, $2, $3) RETURNING *', [name, image, category_id], (err, result) => {
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
  
  const getSubcategory = async (req, res) => {
    try {
      const query = `
        SELECT sc.*, c.name AS  category_name
        FROM sub_category sc
        INNER JOIN category c ON c.id = sc.category_id::integer
      `;
    
      const result = await db.pool.query(query);
    
      res.status(200).json({
        msg: "Data fetched successfully",
        data: result.rows,
        status: 1
      });
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  const updateSubcategory = async (req, res) => {
    const { name, id } = req.body;
  
    try {
      const query = `UPDATE sub_category SET name = $1 WHERE id = $2 RETURNING *`;
      const values = [name, id];
  
      const result = await db.pool.query(query, values);
  
      res.status(200).json({
        status: 200,
        message: 'Data fetched successfully',
        data: result.rows[0],
      });
    } catch (error) {
      console.error('Error occurred during business token update:', error);
      const response = {
        status: 0,
        error: 'Internal server error',
        message: 'Something went wrong',
      };
      res.status(500).json(response);
    }
  };

module.exports = {
    addSubcategory,
    upload,
    getSubcategory,
    updateSubcategory
};
