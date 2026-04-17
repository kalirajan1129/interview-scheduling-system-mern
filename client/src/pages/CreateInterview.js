import React, { useState } from 'react';
import API from '../services/api';

const CreateInterview = () => {
  const [candidateName, setCandidateName] = useState('');
  const [role, setRole] = useState('');
  const [date, setDate] = useState('');
  const [slots, setSlots] = useState('');

  const handleSubmit = async () => {
    const slotArray = slots.split(',').map(s => ({ time: s.trim() }));

    await API.post('/interviews/create', {
      candidateName,
      role,
      date,
      slots: slotArray
    });

    alert('Interview Created!');
  };

  return (
    <div className="p-5 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Create Interview</h1>

      <div className="bg-white p-4 shadow rounded w-96">

        <input
          className="w-full mb-2 p-2 border"
          placeholder="Candidate Name"
          onChange={(e) => setCandidateName(e.target.value)}
        />

        <input
          className="w-full mb-2 p-2 border"
          placeholder="Role"
          onChange={(e) => setRole(e.target.value)}
        />

        <input
          type="date"
          className="w-full mb-2 p-2 border"
          onChange={(e) => setDate(e.target.value)}
        />

        <input
          className="w-full mb-4 p-2 border"
          placeholder="Slots (e.g. 10:00 AM, 10:30 AM)"
          onChange={(e) => setSlots(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-green-500 text-white p-2 rounded"
        >
          Create
        </button>

      </div>
    </div>
  );
};

export default CreateInterview;