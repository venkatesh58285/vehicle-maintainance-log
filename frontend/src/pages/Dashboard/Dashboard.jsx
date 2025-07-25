import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Loader from '../../components/Loader/Loader';
import Button from '../../components/Button/Button';
import styles from './Dashboard.module.css';

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
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <Link to="/dashboard" className={styles.navlink}>Dashboard</Link>
        <Link to="/search" className={styles.navlink}>Global Search</Link>
        <Link to="/add-vehicle" className={styles.navlink}>Add Vehicle</Link>
        <Button onClick={handleLogout} variant="secondary">Logout</Button>
      </nav>
      <header className={styles.header}>
        <h1>Welcome, {user?.name}</h1>
      </header>

      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <h3>Vehicles</h3>
          <p>{vehicles.length}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Upcoming Services</h3>
          <p>{reminders.length}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Total Cost Spent</h3>
          <p>₹{totalCost.toLocaleString()}</p>
        </div>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.vehiclesSection}>
          <h2>My Vehicles</h2>
          <Link to="/add-vehicle">
            <Button>Add Vehicle</Button>
          </Link>
          <div className={styles.vehicleList}>
            {vehicles.length === 0 ? (
              <p>No vehicles added yet.</p>
            ) : (
              vehicles.map((vehicle) => (
                <div key={vehicle._id} className={styles.vehicleCard}>
                  <h3>{vehicle.make} {vehicle.model} ({vehicle.year})</h3>
                  <p>License Plate: {vehicle.licensePlate}</p>
                  <p>VIN: {vehicle.vin}</p>
                  <div className={styles.cardActions}>
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

        <div className={styles.remindersSection}>
          <h2>Upcoming Service Reminders</h2>
          {reminders.length === 0 ? (
            <p>No upcoming reminders.</p>
          ) : (
            <ul>
              {reminders.map((reminder) => (
                <li key={reminder._id}>
                  <strong>{reminder.vehicle?.make} {reminder.vehicle?.model}</strong> - {reminder.title} <br />
                  Due: {reminder.nextDueDate?.slice(0, 10)}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 