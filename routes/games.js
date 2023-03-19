import express from 'express';
import { Game } from '../utils/collection';
var router = express.Router();

/* GET home page. */
router.get('/', async function (req, res, next) {
  try {
    const data = await Game.find({});
    res.status(201).json(data || {});
  } catch (error) {
    const message = 'Error: Failed to retrieve games';
    res.status(400).json({ message });
  }
});

router.get('/:id', async function (req, res, next) {
  try {
    const { id } = req.params;
    const data = await Game.findOne({ _id: id });
    res.status(201).json(data || {});
  } catch (error) {
    const message = 'Error: Failed to retrieve a game';
    res.status(400).json({ message });
  }
});

router.patch('/:id', async function (req, res, next) {
  try {
    const { id } = req.params;
    const { name, url, author, publishedDate } = req.body;
    const data = await Game.updateOne(
      { _id: id },
      { $set: { name, url, author, publishedDate } }
    );
    res.status(201).json(data || {});
  } catch (error) {
    const message = 'Error: Failed to update a game';
    res.status(400).json({ message });
  }
});

router.delete('/:id', async function (req, res, next) {
  try {
    const { id } = req.params;
    const data = await Game.deleteOne({ _id: id });
    res.status(201).json(data || {});
  } catch (error) {
    const message = 'Error: Failed to delete a game';
    res.status(400).json({ message });
  }
});

router.post('/', async function (req, res, next) {
  try {
    const insertedId = await Game.insertMany([req.body]);
    res.status(201).json({
      insertedId: insertedId && insertedId[0]._id,
      message: 'games added successfully',
    });
  } catch (error) {
    const message = 'Error: Failed to create games';
    res.status(400).json({ message });
  }
});

module.exports = router;
