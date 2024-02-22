const Database = require('../database/database');
const db = new Database()
const cors = require('cors')
const commonResponse = (status, message, data) => {
  return { status, message, data };
};

const getUserLogin = (req, res) => {
  const { email, password } = req.body;
  db.pool.query('INSERT INTO admin (email, password) VALUES ($1,$2) RETURNING *', [email, password], (err, result) => {
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


const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const query = {
      text: 'SELECT * FROM admin WHERE email = $1',
      values: [email],
    };

    const result = await db.pool.query(query);

    if (result.rows.length === 1) {
      const user = result.rows[0];
      const storedPassword = user.password;

      if (password === storedPassword) {
        res.json({ message: 'Login successful' });
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getUserLogin,
  login
};
