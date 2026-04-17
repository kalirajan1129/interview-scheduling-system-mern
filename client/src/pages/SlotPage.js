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

  const [booking, setBooking] = useState(false);

  const bookSlot = async (time) => {
    setBooking(true);

    try {
      await API.post('/bookings/book', {
        interviewId: id,
        time
      });

      alert('Slot booked!');
      fetchSlots();
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }

    setBooking(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <h1 className="text-2xl font-bold mb-4">Available Slots</h1>

      <div className="flex flex-wrap gap-3">
        {slots.map((s, index) => (
            <button
            key={index}
            disabled={booking}
            className={`px-4 py-2 rounded text-white ${
                booking ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
            }`}
            onClick={() => bookSlot(s.time)}
            >
            {s.time}
            </button>
        ))}
      </div>
    </div>
  );
};

export default SlotPage;