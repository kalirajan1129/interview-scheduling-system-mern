import React, { useEffect, useState } from 'react';
import API from '../services/api';

const InterviewList = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const res = await API.get('/interviews');
      setInterviews(res.data);
    } catch (err) {
      alert('Error fetching interviews');
    }
    setLoading(false);
  };

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;

    try {
      await API.delete(`/interviews/${id}`);
      alert('Deleted successfully');
      fetchInterviews(); // 🔥 better than reload
    } catch (err) {
      alert('Delete failed');
    }
  };

  const handleEdit = async (id) => {
    const newName = prompt('Enter new candidate name');

    if (!newName) return;

    try {
      await API.put(`/interviews/${id}`, {
        candidateName: newName
      });
      alert('Updated successfully');
      fetchInterviews(); // 🔥 refresh data
    } catch (err) {
      alert('Update failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-5">

      {/* HEADER */}
      <div className="bg-blue-600 text-white p-3 mb-4 rounded flex justify-between">
        <h1 className="text-xl font-bold">Interview Scheduler</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>

      {/* NAVIGATION */}
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

      {/* TITLE */}
      <h2 className="text-2xl font-bold mb-4">Interviews</h2>

      {/* EMPTY STATE */}
      {interviews.length === 0 && (
        <p className="text-gray-500">No interviews found</p>
      )}

      {/* LIST */}
      <div className="grid gap-4">
        {interviews.map((i) => (
          <div
            key={i._id}
            className="bg-white p-4 rounded shadow hover:shadow-lg transition"
          >
            <p><strong>Candidate:</strong> {i.candidateName}</p>
            <p><strong>Role:</strong> {i.role}</p>

            <div className="mt-3 flex gap-2 flex-wrap">

              <button
                className="bg-blue-500 text-white px-3 py-1 rounded"
                onClick={() => window.location.href = `/slots/${i._id}`}
              >
                View Slots
              </button>

              <button
                onClick={() => handleEdit(i._id)}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(i._id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InterviewList;