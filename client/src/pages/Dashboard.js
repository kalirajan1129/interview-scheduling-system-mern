import React, { useEffect, useState } from 'react';
import API from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const res = await API.get('/dashboard/stats');
    setStats(res.data);
  };

  if (!stats) return <p>Loading...</p>;

  return (
    <div className="p-5 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 shadow rounded">
          <p>Total Interviews</p>
          <h2 className="text-xl font-bold">{stats.totalInterviews}</h2>
        </div>

        <div className="bg-white p-4 shadow rounded">
          <p>Total Slots</p>
          <h2 className="text-xl font-bold">{stats.totalSlots}</h2>
        </div>

        <div className="bg-white p-4 shadow rounded">
          <p>Booked Slots</p>
          <h2 className="text-xl font-bold">{stats.bookedSlots}</h2>
        </div>

        <div className="bg-white p-4 shadow rounded">
          <p>Available Slots</p>
          <h2 className="text-xl font-bold">{stats.availableSlots}</h2>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;