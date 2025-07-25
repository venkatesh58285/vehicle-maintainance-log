import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useAuth from '../../hooks/useAuth';
import Loader from '../../components/Loader/Loader';
import Button from '../../components/Button/Button';
import styles from './GlobalSearch.module.css';
import { Link } from 'react-router-dom';

const GlobalSearch = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [sort, setSort] = useState('desc');

  useEffect(() => {
    const fetchAllLogs = async () => {
      setLoading(true);
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data: vehiclesData } = await axios.get('/api/vehicles', config);
        setVehicles(vehiclesData);
        let allLogs = [];
        for (const v of vehiclesData) {
          const { data: logsData } = await axios.get(`/api/logs?vehicleId=${v._id}`, config);
          allLogs = allLogs.concat(logsData.map(log => ({ ...log, vehicle: v })));
        }
        setLogs(allLogs);
      } catch (error) {
        setLogs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAllLogs();
  }, [user.token]);

  let filteredLogs = logs.filter(log =>
    log.title.toLowerCase().includes(search.toLowerCase()) &&
    (!filterDate || log.date?.slice(0, 10) === filterDate)
  );
  filteredLogs = filteredLogs.sort((a, b) =>
    sort === 'asc' ? a.mileage - b.mileage : b.mileage - a.mileage
  );

  return (
    <div className={styles.container}>
      <h2>Global Log Search</h2>
      <div className={styles.controls}>
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <input
          type="date"
          value={filterDate}
          onChange={e => setFilterDate(e.target.value)}
        />
        <select value={sort} onChange={e => setSort(e.target.value)}>
          <option value="desc">Sort by Mileage (High to Low)</option>
          <option value="asc">Sort by Mileage (Low to High)</option>
        </select>
      </div>
      {loading ? (
        <Loader />
      ) : filteredLogs.length === 0 ? (
        <p className={styles.empty}>No logs found.</p>
      ) : (
        <div className={styles.logList}>
          {filteredLogs.map(log => (
            <div key={log._id} className={styles.logCard}>
              <h3>{log.title}</h3>
              <p>Date: {log.date?.slice(0, 10)}</p>
              <p>Mileage: {log.mileage}</p>
              <p>Cost: {log.cost}</p>
              <p>Vehicle: {log.vehicle?.make} {log.vehicle?.model} ({log.vehicle?.year})</p>
              <p>{log.description}</p>
              <div className={styles.cardActions}>
                <Link to={`/edit-log/${log._id}`}><Button variant="secondary">Edit</Button></Link>
                <Link to={`/history/${log.vehicle?._id}`}><Button>View History</Button></Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch; 