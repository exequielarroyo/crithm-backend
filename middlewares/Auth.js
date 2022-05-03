const { verify } = require('jsonwebtoken');
require('dotenv').config();

const validateToken = (req, res, next) => {
  const authorization = req.header('authorization');

  if (!authorization) {
    res.json({ error: 'user not logged in' });
  } else {
    const token = authorization.split(' ')[1];
    verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) res.sendStatus(403).send();
      req.user = decoded.email;
      next();
    });
  }
};

const validateRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(parseInt(req.body.role))) {
      res.json('You dont have permission.');
    } else {
      next();
    }
  };
};

module.exports = { validateToken, validateRole };
