import express from 'express';
import moment from 'moment-timezone';
import { Assembly } from '../utils/collection';
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
  if (query.processIds) {
    const processIds = JSON.parse(decodeURIComponent(query.processIds));
    query.processId = { $in: processIds };
  }
  if (query.machineIds) {
    const machineIds = JSON.parse(decodeURIComponent(query.machineIds));
    query.machineId = { $in: machineIds };
  }

  if (validateRole(['ADMIN', 'ASSEMBLY'])) {
    try {
      const data = await Assembly.find(query);
      res.status(201).json(data || {});
    } catch (error) {
      const message = 'Error: Failed to retrieve sub assembly data';
      res.status(400).json({ message });
    }
  } else {
    res.status(403).json({ message: 'No access right' });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { process, processId, machineId, startDate, endDate } = req.body;
    if (validateRole(['ADMIN', 'ASSEMBLY'])) {
      const data = await Assembly.updateOne(
        { _id: id },
        { $set: { process, processId, machineId, startDate, endDate } }
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

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (validateRole(['ADMIN', 'ASSEMBLY'])) {
      const data = await Assembly.deleteOne({ _id: id });
      res.status(201).json(data || {});
    } else {
      res.status(403).json({ message: 'No access right' });
    }
  } catch (error) {
    const message = 'Error: Failed to delete a item';
    res.status(400).json({ message });
  }
});

router.post('/', async function (req, res, next) {
  try {
    if (validateRole(['ADMIN', 'ASSEMBLY'])) {
      let body;
      if (Array.isArray(req.body)) {
        body = req.body;
      } else body = [req.body];
      const insertedId = await Assembly.insertMany(body);
      res.status(201).json({
        insertedId: insertedId && insertedId[0]._id,
        message: 'items added successfully',
      });
    } else {
      res.status(403).json({ message: 'No access right' });
    }
  } catch (error) {
    const message = 'Error: Failed to create items';
    res.status(400).json({ message });
  }
});

module.exports = router;
