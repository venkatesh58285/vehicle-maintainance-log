require('dotenv').config();
const MaintenanceLog = require('../models/MaintenanceLog');
const Vehicle = require('../models/Vehicle');
const sendEmail = require('../utils/sendEmail');

// @desc    Get all logs for a vehicle
// @route   GET /api/logs?vehicleId=<vehicleId>
// @access  Private
const getLogs = async (req, res, next) => {
  const { vehicleId } = req.query;
  try {
    // First, verify the user owns the vehicle
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle || vehicle.user.toString() !== req.user._id.toString()) {
      res.status(404);
      throw new Error('Vehicle not found or not owned by user');
    }

    const logs = await MaintenanceLog.find({ vehicle: vehicleId });
    res.json(logs);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single log
// @route   GET /api/logs/:id
// @access  Private
const getLogById = async (req, res, next) => {
  try {
    const log = await MaintenanceLog.findById(req.params.id).populate('vehicle');

    if (log && log.vehicle.user.toString() === req.user._id.toString()) {
      res.json(log);
    } else {
      res.status(404);
      throw new Error('Log not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a log
// @route   POST /api/logs
// @access  Private
const createLog = async (req, res, next) => {
  const { vehicleId, title, description, date, mileage, cost, nextDueDate } = req.body;

  try {
    const vehicle = await Vehicle.findById(vehicleId).populate('user');
    if (!vehicle || vehicle.user._id.toString() !== req.user._id.toString()) {
      res.status(400);
      throw new Error('Vehicle not found or not owned by user');
    }

    const log = new MaintenanceLog({
      vehicle: vehicleId,
      title,
      description,
      date,
      mileage,
      cost,
      nextDueDate,
    });

    const createdLog = await log.save();

    // Send email to user about new log
    try {
      await sendEmail({
        to: req.user.email,
        subject: `New Maintenance Log Added for ${vehicle.make} ${vehicle.model}`,
        html: `<h3>New Maintenance Log Added</h3>
          <p><strong>Vehicle:</strong> ${vehicle.make} ${vehicle.model} (${vehicle.year})</p>
          <p><strong>Title:</strong> ${title}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Mileage:</strong> ${mileage}</p>
          <p><strong>Cost:</strong> ₹${cost}</p>
          <p><strong>Description:</strong> ${description}</p>
        `,
      });
    } catch (e) {
      // Log but don't fail the request
      console.error('Failed to send log email:', e.message);
    }

    res.status(201).json(createdLog);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a log
// @route   PUT /api/logs/:id
// @access  Private
const updateLog = async (req, res, next) => {
    const { title, description, date, mileage, cost, nextDueDate } = req.body;
  try {
    const log = await MaintenanceLog.findById(req.params.id).populate('vehicle');

    if (log && log.vehicle.user.toString() === req.user._id.toString()) {
      log.title = title || log.title;
      log.description = description || log.description;
      log.date = date || log.date;
      log.mileage = mileage || log.mileage;
      log.cost = cost || log.cost;
      log.nextDueDate = nextDueDate || log.nextDueDate;

      const updatedLog = await log.save();
      res.json(updatedLog);
    } else {
      res.status(404);
      throw new Error('Log not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a log
// @route   DELETE /api/logs/:id
// @access  Private
const deleteLog = async (req, res, next) => {
  try {
    const log = await MaintenanceLog.findById(req.params.id).populate('vehicle');

    if (log && log.vehicle.user.toString() === req.user._id.toString()) {
      await log.remove();
      res.json({ message: 'Log removed' });
    } else {
      res.status(404);
      throw new Error('Log not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { getLogs, getLogById, createLog, updateLog, deleteLog }; 