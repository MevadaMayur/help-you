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

const addService = (req, res) => {
  const { name} = req.body;

  if (!req.file) {
    return res.status(400).json({
      error: 'No file uploaded.',
    });
  }

  const image = req.file.filename;

  db.pool.query('INSERT INTO service (name, image) VALUES($1, $2) RETURNING *', [name, image], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        error: 'An error occurred while saving the data.',err,
      });
    }

    res.status(200).json({
      message: 'Data created successfully',
      data: result.rows[0],
      status: 1
    });
  });
};

const getService = async (req, res) => {
  try {
    const query = 'SELECT * FROM service WHERE is_deleted = false';

    const result = await db.pool.query(query);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching Service:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};


const updateService = async (req, res) => {
  const { name, id  } = req.body;
  
  try {
    const query = `UPDATE service SET name = $1 WHERE id = $2 RETURNING *`;
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

const deleteService = async (req, res) => {
    const { id } = req.body;
  
    try {
      const query = 'UPDATE service SET is_deleted = true WHERE id = $1 RETURNING *';
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

  const updateServiceImage = (req, res) => {
    const { id } = req.body;
  
    try {
      if (!req.file) {
        return res.status(400).json({
          status: 400,
          message: 'No file uploaded.',
        });
      }
  
      const image = req.file.filename;
  
      db.pool.query(
        'UPDATE service SET image = $1 WHERE id = $2 RETURNING *',
        [image, id],
        (err, result) => {
          if (err) {
            console.error('Error occurred during category update:', err);
            const response = {
              status: 500,
              error: 'Internal server error',
              message: 'Something went wrong',
            };
            res.status(500).json(response);
          } else {
            const updatedCategory = result.rows[0];
            const response = {
              status: 200,
              message: 'Category updated successfully',
              data: updatedCategory,
            };
            res.status(200).json(response);
          }
        }
      );
    } catch (error) {
      console.error('Error occurred during category update:', error);
      const response = {
        status: 500,
        error: 'Internal server error',
        message: 'Something went wrong',
      };
      res.status(500).json(response);
    }
  };
  
  
module.exports = {
  addService,
  upload,
  getService,
  updateService,
  deleteService,
  updateServiceImage
};
