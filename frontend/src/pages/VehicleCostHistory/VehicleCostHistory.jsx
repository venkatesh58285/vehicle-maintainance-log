import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import useAuth from '../../hooks/useAuth';
import Loader from '../../components/Loader/Loader';
import Button from '../../components/Button/Button';
import styles from './VehicleCostHistory.module.css';

const VehicleCostHistory = () => {
  const { vehicleId } = useParams();
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data: vehicleData } = await axios.get(`/api/vehicles/${vehicleId}`, config);
        setVehicle(vehicleData);
        const { data: logsData } = await axios.get(`/api/logs?vehicleId=${vehicleId}`, config);
        setLogs(logsData);
      } catch (error) {
        setLogs([]);
        setVehicle(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.token, vehicleId]);

  const totalCost = logs.reduce((sum, log) => sum + (Number(log.cost) || 0), 0);

  return (
    <div className={styles.container}>
      <h2>Cost History for {vehicle ? `${vehicle.make} ${vehicle.model} (${vehicle.year})` : 'Vehicle'}</h2>
      <div className={styles.totalCost}>Total Spent: <span>₹{totalCost.toLocaleString()}</span></div>
      <Link to={`/dashboard`}><Button variant="secondary">Back to Dashboard</Button></Link>
      {loading ? (
        <Loader />
      ) : logs.length === 0 ? (
        <p className={styles.empty}>No maintenance logs found for this vehicle.</p>
      ) : (
        <div className={styles.logList}>
          {logs.map(log => (
            <div key={log._id} className={styles.logCard}>
              <div className={styles.logHeader}>
                <span className={styles.logDate}>{log.date?.slice(0, 10)}</span>
                <span className={styles.logCost}>₹{Number(log.cost).toLocaleString()}</span>
              </div>
              <h3>{log.title}</h3>
              <p>{log.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VehicleCostHistory; 