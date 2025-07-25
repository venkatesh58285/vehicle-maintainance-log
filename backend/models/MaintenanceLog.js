const mongoose = require('mongoose');

const maintenanceLogSchema = mongoose.Schema(
  {
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Vehicle',
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    date: {
      type: Date,
      required: true,
    },
    mileage: {
      type: Number,
      required: true,
    },
    cost: {
      type: Number,
      required: true,
      min: 0,
    },
    nextDueDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const MaintenanceLog = mongoose.model('MaintenanceLog', maintenanceLogSchema);

module.exports = MaintenanceLog; 