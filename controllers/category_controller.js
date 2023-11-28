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

const addCategory = (req, res) => {
  const { name, service_id } = req.body;

  if (!req.file) {
    return res.status(400).json({
      error: 'No file uploaded.',
    });
  }

  const image = req.file.filename;

  db.pool.query('INSERT INTO category (name, image, service_id) VALUES($1, $2, $3) RETURNING *', [name, image, service_id], (err, result) => {
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

const getCategory = async (req, res) => {
  try {
    const query = `
      SELECT c.*, s.name AS service_name
      FROM category c
      INNER JOIN service s ON c.service_id::integer = s.id
      WHERE c.is_deleted = false;
    `;

    const result = await db.pool.query(query);

    res.status(200).json({
      msg: "Data fetched successfully",
      data: result.rows,
      status: 1
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateCategory = async (req, res) => {
  const { name, id } = req.body;

  try {
    const query = `UPDATE category SET name = $1 WHERE id = $2 RETURNING *`;
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

const deleteCategory = async (req, res) => {
  const { id } = req.body;

  try {
    const query = 'UPDATE category SET is_deleted = true WHERE id = $1 RETURNING *';
    const values = [id];

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
  addCategory,
  upload,
  getCategory,
  updateCategory,
  deleteCategory
};
