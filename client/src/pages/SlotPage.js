import React, { useEffect, useState, useCallback } from 'react';
import API from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, ArrowLeft, Calendar, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const SlotPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingSlot, setBookingSlot] = useState(null);

  const fetchSlots = useCallback(async () => {
    try {
      const res = await API.get(`/interviews/${id}/slots`);
      setSlots(res.data);
    } catch (err) {
      toast.error('Failed to load slots');
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  const bookSlot = async (time) => {
    setBookingSlot(time);
    try {
      await API.post('/bookings/book', { interviewId: id, time });
      toast.success('Slot booked successfully!');
      fetchSlots();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    }
    setBookingSlot(null);
  };

  // Loading skeleton
  if (loading) {
    return (
      <div>
        <div className="skeleton h-10 w-32 mb-8" />
        <div className="skeleton h-8 w-56 mb-2" />
        <div className="skeleton h-5 w-72 mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="skeleton h-24 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        id="back-to-list"
        className="flex items-center gap-2 text-surface-400 hover:text-white mb-6 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Back to Interviews</span>
      </button>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Calendar className="w-7 h-7 text-primary-400" />
          <h1 className="text-2xl md:text-3xl font-bold text-white">Available Slots</h1>
        </div>
        <p className="text-surface-400 ml-10">
          {slots.length} slot{slots.length !== 1 ? 's' : ''} available — click to book
        </p>
      </div>

      {/* Empty State */}
      {slots.length === 0 && (
        <div className="glass-card p-12 text-center animate-scale-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-surface-800 mb-4">
            <AlertCircle className="w-8 h-8 text-surface-500" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No Available Slots</h3>
          <p className="text-surface-400">
            All time slots have been booked for this interview
          </p>
        </div>
      )}

      {/* Slot Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {slots.map((s, index) => {
          const isBooking = bookingSlot === s.time;

          return (
            <button
              key={index}
              id={`slot-${index}`}
              disabled={isBooking}
              onClick={() => bookSlot(s.time)}
              className={`glass-card p-5 text-center group cursor-pointer transition-all duration-500 hover:border-accent-500/40 hover:shadow-card-hover ${
                isBooking ? 'opacity-60 cursor-not-allowed' : ''
              }`}
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 rounded-xl bg-accent-500/10 group-hover:bg-accent-500/20 group-hover:scale-110 transition-all duration-300">
                  {isBooking ? (
                    <div className="w-5 h-5 border-2 border-accent-400/30 border-t-accent-400 rounded-full animate-spin" />
                  ) : (
                    <Clock className="w-5 h-5 text-accent-400" />
                  )}
                </div>
                <span className="text-lg font-semibold text-white">{s.time}</span>
                <span className="flex items-center gap-1 text-xs text-accent-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <CheckCircle className="w-3 h-3" />
                  Click to book
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SlotPage;