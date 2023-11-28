const Database = require('../database/database');
const db = new Database()
const multer = require('multer');

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
  
  const addBanner = (req, res) => {
    const { uid } = req.body;
  
    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded.',
      });
    }
  
    const image_url = req.file.filename;
  
    db.pool.query('INSERT INTO add_banner (uid, image_url) VALUES($1, $2) RETURNING *', [uid, image_url], (err, result) => {
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
  
  const getBanner = async (req, res) => {
    try {
        const { uid } = req.body;
  
        const query = 'SELECT * FROM add_banner WHERE  uid = $1  AND is_deleted = false ORDER BY created_at DESC';
        const values = [uid];
  
        const result = await db.pool.query(query, values);
  
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
  
  const deleteBanner = async (req, res) => {
    const id = req.body.id;
    
    try {
        const query = 'UPDATE add_banner SET is_deleted = true WHERE id = $1 RETURNING *';
        const values = [id];
        
        const result = await db.pool.query(query, values);
        
        res.status(200).json({
            msg: "Data fetched successfully",
            data: result.rows,
            status: 1
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Internal server error', error: "error".concat(error),data: [], status: 0});
    }
  };
  

module.exports = {
    addBanner,
    upload,
    getBanner,
    deleteBanner
};