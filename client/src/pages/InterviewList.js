import React, { useEffect, useState } from 'react';
import API from '../services/api';

const InterviewList = () => {
  const [interviews, setInterviews] = useState([]);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    const res = await API.get('/interviews');
    setInterviews(res.data);
  };

  return (
    <div>
      <h2>Interviews</h2>

      {interviews.map((i) => (
        <div key={i._id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
          <p><strong>Candidate:</strong> {i.candidateName}</p>
          <p><strong>Role:</strong> {i.role}</p>
          <button onClick={() => window.location.href = `/slots/${i._id}`}>
            View Slots
          </button>
        </div>
      ))}
    </div>
  );
};

export default InterviewList;