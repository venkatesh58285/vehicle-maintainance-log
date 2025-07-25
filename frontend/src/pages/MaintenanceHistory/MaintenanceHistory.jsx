import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import useAuth from '../../hooks/useAuth';
import Loader from '../../components/Loader/Loader';
import Button from '../../components/Button/Button';
import styles from './MaintenanceHistory.module.css';

const MaintenanceHistory = () => {
  const { vehicleId } = useParams();
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [sort, setSort] = useState('desc');

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get(`/api/logs?vehicleId=${vehicleId}`, config);
        setLogs(data);
      } catch (error) {
        setLogs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [user.token, vehicleId]);

  let filteredLogs = logs.filter(log =>
    log.title.toLowerCase().includes(search.toLowerCase()) &&
    (!filterDate || log.date?.slice(0, 10) === filterDate)
  );
  filteredLogs = filteredLogs.sort((a, b) =>
    sort === 'asc' ? a.mileage - b.mileage : b.mileage - a.mileage
  );

  return (
    <div className={styles.container}>
      <h2>Maintenance History</h2>
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
        <Link to={`/add-log/${vehicleId}`}><Button>Add Log</Button></Link>
        <Link to={`/cost-history/${vehicleId}`}><Button variant="secondary">Cost History</Button></Link>
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
              <p>{log.description}</p>
              <div className={styles.cardActions}>
                <Link to={`/edit-log/${log._id}`}><Button variant="secondary">Edit</Button></Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MaintenanceHistory; 