const jwt =require('jsonwebtoken');

module.exports=function auth(req, res, next) {
  try {
    const token=req.header('x-auth-token');
    if (!token) return res.status(401).send('Access denied. No token provided');
    const decoded=jwt.verify(token, 'secret');
    next();
  } catch (ex) {
    res.status(400).send(ex);
  }
};

