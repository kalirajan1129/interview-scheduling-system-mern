import React, { useEffect, useState, useCallback } from 'react';
import API from '../services/api';
import { useParams } from 'react-router-dom';
import { Clock, Briefcase, Calendar, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const CandidateBooking = () => {
  const { driveId, token } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingSlot, setBookingSlot] = useState(null);

  const fetchDetails = useCallback(async () => {
    try {
      const res = await API.get(`/bookings/${driveId}/${token}`);
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired link');
    }
    setLoading(false);
  }, [driveId, token]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  const bookSlot = async (time) => {
    setBookingSlot(time);
    try {
      const res = await API.post('/bookings/book', { driveId, token, time });
      toast.success(res.data.message);
      // Refresh to update status
      fetchDetails();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
      // In case someone else literally just booked it, refresh to get new slots
      fetchDetails();
    }
    setBookingSlot(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-950 flex flex-col items-center justify-center p-4">
        <div className="w-8 h-8 border-4 border-surface-700 border-t-primary-500 rounded-full animate-spin mb-4" />
        <p className="text-surface-400">Loading your interview details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface-950 flex items-center justify-center p-4">
        <div className="glass-card p-8 max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-surface-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-950 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <Toaster position="top-center" />
      
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px] bg-primary-600/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto animate-fade-in">
        
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-glow mb-4">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">InterviewHub</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Info Card */}
          <div className="glass-card p-6 md:p-8 h-fit">
            <h2 className="text-sm font-semibold text-primary-400 tracking-wider uppercase mb-6">Interview Details</h2>
            
            <div className="space-y-6">
              <div>
                <p className="text-sm text-surface-400 mb-1 flex items-center gap-2"><Briefcase className="w-4 h-4" /> Role</p>
                <p className="text-lg font-semibold text-white">{data.role}</p>
                <p className="text-sm text-surface-400 mt-1">{data.title}</p>
              </div>
              
              <div>
                <p className="text-sm text-surface-400 mb-1 flex items-center gap-2"><Calendar className="w-4 h-4" /> Date</p>
                <p className="text-lg font-semibold text-white">
                  {new Date(data.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>

              <div className="pt-6 border-t border-surface-700/50">
                <p className="text-sm text-surface-400 mb-1">Candidate</p>
                <p className="text-lg font-semibold text-white">{data.candidate.name}</p>
                <p className="text-sm text-surface-400">{data.candidate.email}</p>
              </div>
            </div>
          </div>

          {/* Booking Section */}
          <div className="md:col-span-2 glass-card p-6 md:p-8">
            {data.candidate.status === 'Booked' ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 animate-scale-in">
                <div className="w-20 h-20 bg-accent-500/10 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-10 h-10 text-accent-500" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">You're All Set!</h2>
                <p className="text-surface-300 text-lg mb-2">
                  Your interview is confirmed for <strong className="text-white">{data.candidate.bookedSlotTime}</strong>
                </p>
                <p className="text-surface-400">
                  Please mark your calendar. We look forward to speaking with you.
                </p>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold text-white mb-2">Select a Time Slot</h2>
                <p className="text-surface-400 mb-8">
                  First come, first served. Pick the slot that works best for you.
                </p>

                {data.availableSlots.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-surface-700/50 rounded-2xl">
                    <AlertCircle className="w-10 h-10 text-surface-500 mx-auto mb-3" />
                    <p className="text-surface-300 font-medium">No slots available</p>
                    <p className="text-surface-500 text-sm mt-1">All slots have been booked or the drive is full.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {data.availableSlots.map((s, idx) => {
                      const isBooking = bookingSlot === s.time;
                      return (
                        <button
                          key={idx}
                          disabled={isBooking}
                          onClick={() => bookSlot(s.time)}
                          className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 group
                            ${isBooking ? 'bg-surface-800/80 border-surface-700/50 cursor-not-allowed opacity-70' : 'bg-surface-800/50 border-primary-500/30 hover:bg-primary-600/10 hover:border-primary-500 hover:shadow-glow'}`}
                        >
                          <div className="flex items-center gap-3">
                            <Clock className={`w-5 h-5 ${isBooking ? 'text-surface-500' : 'text-primary-400'}`} />
                            <span className="text-lg font-semibold text-white">{s.time}</span>
                          </div>
                          {isBooking ? (
                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          ) : (
                            <span className="text-sm font-medium text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity">Book Slot</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default CandidateBooking;
