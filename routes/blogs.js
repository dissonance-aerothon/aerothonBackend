import express from 'express';
import { Blog } from '../utils/collection';
var router = express.Router();

/* GET home page. */
router.get('/', async function (req, res, next) {
  try {
    const data = await Blog.find({});
    res.status(201).json(data || {});
  } catch (error) {
    const message = 'Error: Failed to retrieve blog';
    res.status(400).json({ message });
  }
});

router.get('/:id', async function (req, res, next) {
  try {
    const { id } = req.params;
    const data = await Blog.findOne({ _id: id });
    res.status(201).json(data || {});
  } catch (error) {
    const message = 'Error: Failed to retrieve blog';
    res.status(400).json({ message });
  }
});

router.post('/', async function (req, res, next) {
  try {
    const insertedId = await Blog.insertMany([req.body]);
    res.status(201).json({ message: 'Blog added successfully' });
  } catch (error) {
    const message = 'Error: Failed to create blog post';
    res.status(400).json({ message });
  }
});

module.exports = router;
