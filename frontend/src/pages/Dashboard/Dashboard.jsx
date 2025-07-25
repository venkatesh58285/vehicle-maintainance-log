import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Loader from '../../components/Loader/Loader';
import Button from '../../components/Button/Button';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [logs, setLogs] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Stats
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data: vehiclesData } = await axios.get('/api/vehicles', config);
        setVehicles(vehiclesData);
        let allLogs = [];
        for (const v of vehiclesData) {
          const { data: logsData } = await axios.get(`/api/logs?vehicleId=${v._id}`, config);
          allLogs = allLogs.concat(logsData.map(log => ({ ...log, vehicle: v })));
        }
        setLogs(allLogs);
        // Calculate reminders: logs with a future nextDueDate
        const now = new Date();
        const upcoming = allLogs
          .filter(log => log.nextDueDate && new Date(log.nextDueDate) > now)
          .sort((a, b) => new Date(a.nextDueDate) - new Date(b.nextDueDate));
        setReminders(upcoming);
        // Calculate total cost
        setTotalCost(allLogs.reduce((sum, log) => sum + (Number(log.cost) || 0), 0));
      } catch (error) {
        setVehicles([]);
        setLogs([]);
        setReminders([]);
        setTotalCost(0);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="h-screen w-full bg-gray-900 text-gray-100 px-2 sm:px-4 md:px-8 py-4 sm:py-6">
      <div className="max-w-screen-2xl mx-auto">
        <nav className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-center bg-gray-800 px-3 sm:px-6 py-3 sm:py-4 rounded-xl mb-5 sm:mb-7 shadow-md w-full">
          <Link to="/dashboard" className="text-sky-300 no-underline font-bold text-base md:text-[1.1rem] transition-colors duration-200 px-2 py-1 rounded hover:text-white hover:bg-gray-900">Dashboard</Link>
          <Link to="/search" className="text-sky-300 no-underline font-bold text-base md:text-[1.1rem] transition-colors duration-200 px-2 py-1 rounded hover:text-white hover:bg-gray-900">Global Search</Link>
          <Link to="/add-vehicle" className="text-sky-300 no-underline font-bold text-base md:text-[1.1rem] transition-colors duration-200 px-2 py-1 rounded hover:text-white hover:bg-gray-900">Add Vehicle</Link>
          <Button onClick={handleLogout} variant="secondary">Logout</Button>
        </nav>
        <header className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 gap-2 w-full">
          <h1 className="text-xl sm:text-2xl font-bold text-center sm:text-left w-full">Welcome, {user?.name}</h1>
        </header>

        <div className="flex flex-col md:flex-row gap-3 sm:gap-5 mb-6 sm:mb-8 w-full">
          <div className="bg-gray-800 text-white rounded-lg px-4 sm:px-6 md:px-8 py-4 sm:py-6 shadow text-center flex-1">
            <h3 className="m-0 mb-2 text-base md:text-[1.1rem] text-sky-300">Vehicles</h3>
            <p className="text-lg sm:text-xl md:text-2xl m-0 font-bold">{vehicles.length}</p>
          </div>
          <div className="bg-gray-800 text-white rounded-lg px-4 sm:px-6 md:px-8 py-4 sm:py-6 shadow text-center flex-1">
            <h3 className="m-0 mb-2 text-base md:text-[1.1rem] text-sky-300">Upcoming Services</h3>
            <p className="text-lg sm:text-xl md:text-2xl m-0 font-bold">{reminders.length}</p>
          </div>
          <div className="bg-gray-800 text-white rounded-lg px-4 sm:px-6 md:px-8 py-4 sm:py-6 shadow text-center flex-1">
            <h3 className="m-0 mb-2 text-base md:text-[1.1rem] text-sky-300">Total Cost Spent</h3>
            <p className="text-lg sm:text-xl md:text-2xl m-0 font-bold">₹{totalCost.toLocaleString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6 sm:gap-8 w-full">
          <div>
            <h2 className="mb-4 sm:mb-5 text-sky-300 text-lg md:text-xl font-semibold">My Vehicles</h2>
            <Link to="/add-vehicle">
              <Button>Add Vehicle</Button>
            </Link>
            <div className="mt-4 sm:mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
              {vehicles.length === 0 ? (
                <p>No vehicles added yet.</p>
              ) : (
                vehicles.map((vehicle) => (
                  <div key={vehicle._id} className="bg-gray-800 p-4 sm:p-5 rounded-lg shadow text-gray-100">
                    <h3 className="font-semibold text-base md:text-lg">{vehicle.make} {vehicle.model} ({vehicle.year})</h3>
                    <p>License Plate: {vehicle.licensePlate}</p>
                    <p>VIN: {vehicle.vin}</p>
                    <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row gap-2 sm:gap-2.5">
                      <Link to={`/edit-vehicle/${vehicle._id}`}>
                        <Button variant="secondary">Edit</Button>
                      </Link>
                      <Link to={`/history/${vehicle._id}`}>
                        <Button>View Logs</Button>
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div>
            <h2 className="mb-4 sm:mb-5 text-sky-300 text-lg md:text-xl font-semibold">Upcoming Service Reminders</h2>
            {reminders.length === 0 ? (
              <p>No upcoming reminders.</p>
            ) : (
              <ul className="list-none p-0">
                {reminders.map((reminder) => (
                  <li key={reminder._id} className="bg-gray-900 p-3 rounded mb-2.5 text-gray-100 shadow">
                    <strong className="text-sky-300">{reminder.vehicle?.make} {reminder.vehicle?.model}</strong> - {reminder.title} <br />
                    Due: {reminder.nextDueDate?.slice(0, 10)}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 