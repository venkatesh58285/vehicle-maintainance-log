const express = require('express');
require('dotenv').config();
const cors = require('cors');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const cron = require('node-cron');
const MaintenanceLog = require('./models/MaintenanceLog');
const Vehicle = require('./models/Vehicle');
const User = require('./models/User');
const sendEmail = require('./utils/sendEmail');

// Route imports
const authRoutes = require('./routes/authRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const logRoutes = require('./routes/logRoutes');
console.log('MONGO_URI:', process.env.MONGO_URI); // 🔍 Debug check

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running...');
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/logs', logRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Cron job: every day at 8am
cron.schedule('0 8 * * *', async () => {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0,0,0,0);
    const nextDay = new Date(tomorrow);
    nextDay.setHours(23,59,59,999);
    // Find logs with nextDueDate tomorrow
    const logs = await MaintenanceLog.find({
      nextDueDate: { $gte: tomorrow, $lte: nextDay }
    }).populate({ path: 'vehicle', populate: { path: 'user' } });
    for (const log of logs) {
      if (log.vehicle && log.vehicle.user && log.vehicle.user.email) {
        await sendEmail({
          to: log.vehicle.user.email,
          subject: `Service Reminder: ${log.title} for ${log.vehicle.make} ${log.vehicle.model}`,
          html: `<h3>Upcoming Service Reminder</h3>
            <p><strong>Vehicle:</strong> ${log.vehicle.make} ${log.vehicle.model} (${log.vehicle.year})</p>
            <p><strong>Service:</strong> ${log.title}</p>
            <p><strong>Due Date:</strong> ${log.nextDueDate.toISOString().slice(0,10)}</p>
            <p>Please ensure your vehicle is serviced on time.</p>
          `,
        });
      }
    }
    if (logs.length > 0) {
      console.log(`Sent ${logs.length} service reminder emails.`);
    }
  } catch (e) {
    console.error('Cron job error:', e.message);
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 