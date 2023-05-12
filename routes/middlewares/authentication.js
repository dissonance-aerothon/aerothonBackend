import jwt from 'jsonwebtoken';

const authentication = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  console.log(token);
  if (!token) {
    res.status(401).json({ message: 'Unauthorized' });
  }
  jwt.verify(token, process.env.SECRET_TOKEN, (err, user) => {
    if (err) {
      res.status(403).json({ message: 'No Access' });
      return;
    }
    req.user = user;
    console.log(user);
    next();
  });
};

export { authentication };
