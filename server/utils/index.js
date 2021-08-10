const jwt = require('jsonwebtoken');

module.exports = (user) => {
  const payload = {
    user,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1hr' });
};
