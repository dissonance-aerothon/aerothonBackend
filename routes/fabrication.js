import express from 'express';
import moment from 'moment-timezone';
import { Fabrication } from '../utils/collection';
import { authentication } from './middlewares/authentication';
import { validateRole } from '../utils/validateRoles';
import { ObjectId } from 'bson';
var router = express.Router();

/* GET home page. */
router.get('/', authentication, async function (req, res) {
  const query = req.query;
  if (query._id) {
    query._id = ObjectId(query._id);
  }
  if (query.startDateMin) {
    const startDateMin = query.startDateMin;
    const toDate = moment.unix(startDateMin);
    query.startDate = {};
    query.startDate.$gte = toDate;
  }
  if (query.startDateMax) {
    const startDateMax = query.startDateMax;
    const toDate = moment.unix(startDateMax);
    if (!query.startDate) query.startDate = {};
    query.startDate.$lte = toDate;
  }
  if (query.endDateMin) {
    const endDateMin = query.endDateMin;
    const toDate = moment.unix(endDateMin);
    query.endDate = {};
    query.endDate.$gte = toDate;
  }
  if (query.endDateMax) {
    const endDateMax = query.endDateMax;
    const toDate = moment.unix(endDateMax);
    if (!query.endDate) query.endDate = {};
    query.endDate.$lte = toDate;
  }
  if (query.itemIds) {
    const itemIds = JSON.parse(decodeURIComponent(query.itemIds));
    delete query.itemIds;
    query.itemId = { $in: itemIds };
  }

  if (validateRole(['ADMIN', 'FABRICATION'])) {
    try {
      const data = await Fabrication.find(query);
      res.status(201).json(data || {});
    } catch (error) {
      const message = 'Error: Failed to retrieve fabrication data';
      res.status(400).json({ message });
    }
  } else {
    res.status(403).json({ message: 'No access right' });
  }
});

router.patch('/:id', authentication, async (req, res) => {
  try {
    const { id } = req.params;
    const { item, itemId, rawMaterial, quantity, startDate, endDate } =
      req.body;
    if (validateRole(['ADMIN', 'FABRICATION'])) {
      const data = await Fabrication.updateOne(
        { _id: id },
        { $set: { item, itemId, rawMaterial, quantity, startDate, endDate } }
      );
      res.status(201).json(data || {});
    } else {
      res.status(403).json({ message: 'No access right' });
    }
  } catch (error) {
    const message = `Error: Failed to update a item with item id : ${id}`;
    res.status(400).json({ message });
  }
});

router.delete('/:id', authentication, async function (req, res, next) {
  try {
    const { id } = req.params;
    if (validateRole(['ADMIN', 'FABRICATION'])) {
      const data = await Fabrication.deleteOne({ _id: id });
      res.status(201).json(data || {});
    } else {
      res.status(403).json({ message: 'No access right' });
    }
  } catch (error) {
    const message = 'Error: Failed to delete a game';
    res.status(400).json({ message });
  }
});

router.post('/', authentication, async function (req, res) {
  try {
    if (validateRole(['ADMIN', 'FABRICATION'])) {
      let body;
      if (Array.isArray(req.body)) {
        body = req.body;
      } else body = [req.body];
      const insertedId = await Fabrication.insertMany(body);
      res.status(201).json({
        insertedId: insertedId && insertedId[0]._id,
        message: 'items added successfully',
      });
    } else {
      res.status(403).json({ message: 'No access right' });
    }
  } catch (error) {
    const message = 'Error: Failed to create games';
    res.status(400).json({ message });
  }
});

module.exports = router;
