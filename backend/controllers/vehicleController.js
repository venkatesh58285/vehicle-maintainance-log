const Vehicle = require('../models/Vehicle');

// @desc    Get all vehicles for a user
// @route   GET /api/vehicles
// @access  Private
const getVehicles = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find({ user: req.user._id });
    res.json(vehicles);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single vehicle
// @route   GET /api/vehicles/:id
// @access  Private
const getVehicleById = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (vehicle && vehicle.user.toString() === req.user._id.toString()) {
      res.json(vehicle);
    } else {
      res.status(404);
      throw new Error('Vehicle not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a vehicle
// @route   POST /api/vehicles
// @access  Private
const createVehicle = async (req, res, next) => {
  const { make, model, year, licensePlate, vin } = req.body;

  try {
    const vehicle = new Vehicle({
      user: req.user._id,
      make,
      model,
      year,
      licensePlate,
      vin,
    });

    const createdVehicle = await vehicle.save();
    res.status(201).json(createdVehicle);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a vehicle
// @route   PUT /api/vehicles/:id
// @access  Private
const updateVehicle = async (req, res, next) => {
  const { make, model, year, licensePlate, vin } = req.body;

  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (vehicle && vehicle.user.toString() === req.user._id.toString()) {
      vehicle.make = make || vehicle.make;
      vehicle.model = model || vehicle.model;
      vehicle.year = year || vehicle.year;
      vehicle.licensePlate = licensePlate || vehicle.licensePlate;
      vehicle.vin = vin || vehicle.vin;

      const updatedVehicle = await vehicle.save();
      res.json(updatedVehicle);
    } else {
      res.status(404);
      throw new Error('Vehicle not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a vehicle
// @route   DELETE /api/vehicles/:id
// @access  Private
const deleteVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (vehicle && vehicle.user.toString() === req.user._id.toString()) {
      await vehicle.remove();
      res.json({ message: 'Vehicle removed' });
    } else {
      res.status(404);
      throw new Error('Vehicle not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
}; 