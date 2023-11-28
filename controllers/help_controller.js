const Database = require('../database/database');
const db = new Database()
const commonResponse = (status, message, data) => {
  return { status, message, data };
};

const addHelp = (req, res) => {
    const { name, email, mobile, message } = req.body;
  
    db.pool.query('INSERT INTO help (name, email, mobile, message) VALUES($1, $2, $3, $4) RETURNING *', [name, email, mobile, message], (err, result) => {
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
 
  const getHelp = async (req, res) => {
    try {
      const query = 'SELECT * FROM help ORDER BY created_at DESC';
      const result = await db.pool.query(query);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching Service:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  

module.exports = {
    addHelp,
    getHelp
};
