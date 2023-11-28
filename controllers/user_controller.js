const Database = require('../database/database');
const db = new Database();
const multer = require('multer');
const commonResponse = (status, message, data) => {
  return {
    status: status,
    message: message,
    data: data
  };
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

const checkMobileExists = async (mobile) => {
  try {
    const query = 'SELECT * FROM users WHERE mobile = $1';
    const values = [mobile];
    const client = await db.pool.connect();
    const result = await client.query(query, values);

    client.release();

    return result.rows;
  } catch (error) {
    console.error('Error checking mobile in the database error:', error);
    throw error;
  }
};

const getUserLogin = (req, res) => {
  const { mobile, user_id, country_code } = req.body;
  
  checkMobileExists(mobile)
    .then((rows) => {
      if (rows.length > 0) {
        res.status(200).json({
          msg: "User is available",
          data: rows[0]
        });
      } else {
        db.pool.query('INSERT INTO users (user_id,mobile,country_code) VALUES ($1,$2,$3) RETURNING *', [user_id, mobile, country_code], (err, result) => {
          if (err) {
            console.log(err);
            throw err;
          }
          res.status(200).json({
            msg: "User is registered",
            data: result.rows[0]
          });
        });
      }
    })
    .catch((error) => {
      console.error('Error checking mobile in the database:', error);
      res.status(500).json({ message: 'Internal server error' });
    });
};

const getUserDetail = (req, res) => {
  const user_id = req.body.user_id;

  db.pool.query('SELECT * FROM users WHERE user_id = $1', [user_id])
    .then((result) => {
      if (result.rows.length === 0) {
        res.status(404).json({
          status: 404,
          message: 'User not found.'
        });
      } else {
        res.json({
          status: 200,
          message: 'User detail',
          data: result.rows[0]
        });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        status: 500,
        error: 'An error occurred while fetching data from the database.'
      });
    });
};

const updateUserProfile = async (req, res) => {
  try {
    const { name, email, whatsapp_no, user_id } = req.body;

    const updateQuery = 'UPDATE users SET name = $1,  email= $2, whatsapp_no = $3  WHERE user_id = $4 RETURNING *';
    const updateValues = [name, email, whatsapp_no, user_id];
    const updateResult = await db.pool.query(updateQuery, updateValues); 
    const updatedRecord = updateResult.rows[0];

    res.status(200).json({
      status: 200,
      message: 'Data updated successfully!',
      data: updatedRecord,
    });
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).send('An error occurred while updating the data.');
  }
};

const updateUserImage = (req, res) => {
  const { user_id } = req.body;

  try {
    if (!req.file) {
      return res.status(400).json({
        status: 400,
        message: 'No file uploaded.',
      });
    }

    const image = req.file.filename;

    db.pool.query(
      'UPDATE users SET image_url = $1 WHERE user_id = $2 RETURNING *',
      [image, user_id],
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
          const updatedUser = result.rows[0];
          const response = {
            status: 200,
            message: 'User updated successfully',
            data: updatedUser,
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

const getContacUs = (req, res) => {
  const userData = {
    "Web_url":"www.helpyou.in",
    "Email":"helpyouservicebhuj@gmail.com",
    "Mobile":"1234567890",
    "Contact_text":"Contact Info",
    "Contact_Info":"Contact us today to book your photo session and discover our range of services.",
    "Location_text":"Location",
    "Location_text_one":"Visit our HelpYouService in person at-",
    "Location_text_two":"202,Hari om complex ADC Bank opp STBus Stand Road Ahemdabad 380001",
    "Service_hours":"Service hours",
    "Service_hours_one":"Monday-Friday: 09:00AM-06:00PM",
    "Service_hours_two":"Saturday-Sunday: 09:00AM-04:00PM"

  };
  res.json(userData);

};

const getUSer = async (req, res) => {
  try {
    const page = req.query.page || 2;  
    const limit = req.query.limit || 3;

    const offset = (page - 1) * limit;

    const query = `
      SELECT * 
      FROM users 
      WHERE is_block = false 
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `;

    const result = await db.pool.query(query, [limit, offset]);

    const nextPage = parseInt(page) + 1;

    res.status(200).json({
      data: result.rows,
      nextPage: result.rows.length === limit ? nextPage : null, 
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = {
  getUserLogin,
  getUserDetail,
  updateUserProfile,
  updateUserImage,
  upload,
  getContacUs,
  getUSer
  };