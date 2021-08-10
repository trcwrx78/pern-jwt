const router = require('express').Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwtGenerator = require('../utils');
const validInfo = require('../middleware/validinfo');
const authorization = require('../middleware/authorization');

// register
router.post('/register', validInfo, async (req, res) => {
  try {
    // 1. Destructure req.body (name, email, password)
    const { name, email, password } = req.body;

    // 2. Check if user exists (if it does throw error)
    const user = await pool.query('SELECT * FROM users WHERE user_email = $1', [
      email,
    ]);

    if (user.rows.length !== 0) {
      return res.status(401).send('Error with user');
    }

    // 3. Bcrypt the user password
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);

    const bcryptPassword = await bcrypt.hash(password, salt);

    // 4. Enter the new user inside our database
    const newUser = await pool.query(
      'INSERT INTO users (user_name, user_email, user_password) VALUES($1, $2, $3) RETURNING *;',
      [name, email, bcryptPassword]
    );

    // 5. Generate our jwt token
    const token = jwtGenerator(newUser.rows[0].user_id);

    res.json({ token });
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
});

router.post('/login', validInfo, async (req, res) => {
  try {
    // 1. Destructure the req.body
    const { email, password } = req.body;

    // 2. Check if user doesn't exist (if not throw error)
    const user = await pool.query('SELECT * FROM users WHERE user_email = $1', [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(401).json('Password or Email is incorrect');
    }

    // 3. Check if incoming password is the same as database
    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].user_password
    );

    if (!validPassword) {
      return res.status(401).json('Password or Email is incorrect');
    }

    // 4. Give them the jwt token
    const token = jwtGenerator(user.rows[0].user_id);

    res.json({ token });
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
});

router.get('/verified', authorization, async (req, res) => {
  try {
    res.json(true);
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
