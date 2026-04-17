import React, { useEffect, useState ,useCallback } from 'react';
import API from '../services/api';
import { useParams } from 'react-router-dom';

const SlotPage = () => {
  const { id } = useParams();
  const [slots, setSlots] = useState([]);

  const fetchSlots = useCallback(async () => {
    const res = await API.get(`/interviews/${id}/slots`);
    setSlots(res.data);
  }, [id]); // dependency important

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  const bookSlot = async (time) => {
    await API.post('/bookings/book', {
      interviewId: id,
      time
    });

    alert('Slot booked!');
    fetchSlots();
  };

  return (
    <div>
      <h2>Available Slots</h2>

      {slots.map((s, index) => (
        <button key={index} onClick={() => bookSlot(s.time)}>
          {s.time}
        </button>
      ))}
    </div>
  );
};

export default SlotPage;