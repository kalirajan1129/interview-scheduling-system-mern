import React, { useEffect, useState } from 'react';
import API from '../services/api';

const InterviewList = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    const res = await API.get('/interviews');
    setInterviews(res.data);
    setLoading(false);
  };
  if (loading) {
    return <p>Loading...</p>;
  }
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };
  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <div className="flex gap-3 mb-4">
      <button
          onClick={() => window.location.href = '/dashboard'}
          className="bg-purple-500 text-white px-4 py-2 rounded"
      >
          Dashboard
      </button>

      <button
          onClick={() => window.location.href = '/create'}
          className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Create Interview
      </button>
      </div>
      <h1 className="text-2xl font-bold mb-4">Interviews</h1>

      <div className="grid gap-4">
        {interviews.map((i) => (
          <div key={i._id} className="bg-white p-4 rounded shadow">
            <p><strong>Candidate:</strong> {i.candidateName}</p>
            <p><strong>Role:</strong> {i.role}</p>

            <button
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => window.location.href = `/slots/${i._id}`}
            >
              View Slots
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded mb-4"
        >
        Logout
      </button>
    </div>
  );
};

export default InterviewList;