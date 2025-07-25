import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import useAuth from '../../hooks/useAuth';
import Loader from '../../components/Loader/Loader';
import Button from '../../components/Button/Button';

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
    <div className="h-screen w-full bg-gray-900 text-gray-100 px-4 md:px-8 py-6">
      <div className="max-w-screen-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-sky-300 text-center">Maintenance History</h2>
        <div className="flex gap-2.5 mb-5 flex-wrap">
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="px-3 py-2 rounded bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-300"
          />
          <input
            type="date"
            value={filterDate}
            onChange={e => setFilterDate(e.target.value)}
            className="px-3 py-2 rounded bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-300"
          />
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="px-3 py-2 rounded bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-300"
          >
            <option value="desc">Sort by Mileage (High to Low)</option>
            <option value="asc">Sort by Mileage (Low to High)</option>
          </select>
          <Link to={`/add-log/${vehicleId}`}><Button>Add Log</Button></Link>
          <Link to={`/cost-history/${vehicleId}`}><Button variant="secondary">Cost History</Button></Link>
        </div>
        {loading ? (
          <Loader />
        ) : filteredLogs.length === 0 ? (
          <p className="text-center text-gray-400 mt-10">No logs found.</p>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5">
            {filteredLogs.map(log => (
              <div key={log._id} className="bg-gray-800 p-5 rounded-lg shadow text-gray-100">
                <h3 className="font-semibold text-lg mb-1">{log.title}</h3>
                <p>Date: {log.date?.slice(0, 10)}</p>
                <p>Mileage: {log.mileage}</p>
                <p>Cost: {log.cost}</p>
                <p>{log.description}</p>
                <div className="mt-2">
                  <Link to={`/edit-log/${log._id}`}><Button variant="secondary">Edit</Button></Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MaintenanceHistory; 