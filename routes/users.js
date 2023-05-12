import express from 'express';
const router = express.Router();
import bcrypt from 'bcrypt';
import { User } from '../utils/collection';
import jwt from 'jsonwebtoken';
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.status('respond with a resource');
});

router.post('/', async (req, res) => {
  try {
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    const user = {
      name: req.body.name,
      email: req.body.email,
      password: hashPassword,
      verified: false,
      roles: req.body.roles || [],
    };
    const userWithSameEmail = await User.findOne({ email: user.email });
    if (userWithSameEmail) {
      res.status(403).json({ message: 'User already exist' });
    }
    console.log(user);
    console.log(typeof user.roles);
    if (!(user.name && user.email && user.password)) {
      throw Error('Name , email or password does not exist');
    }
    const insertedId = await User.insertMany([user]);
    console.log(insertedId);
    res.status(201).json({
      insertedId: insertedId && insertedId[0]._id,
      message: 'user added successfully',
    });
  } catch (error) {
    res.status(500).status();
  }
});

router.post('/login', async (req, res) => {
  console.log(req.body);
  const userFound = await User.findOne({ email: req.body.email });
  console.log(userFound);
  if (!userFound) {
    res.status(400).json({ message: 'User Not Found' });
  }
  try {
    const correctPass = bcrypt.compare(req.body.password, userFound.password);
    if (correctPass) {
      const user = { email: userFound.email };
      const accessToken = jwt.sign(user, process.env.SECRET_TOKEN);
      res.status(201).json({ message: 'Successfully logged in', accessToken });
    } else {
      res.status(401).json({ message: 'Unauthorised' });
    }
  } catch {
    res.status(500);
  }
});

module.exports = router;
