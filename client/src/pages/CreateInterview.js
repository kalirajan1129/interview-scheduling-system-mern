import React, { useState } from 'react';
import API from '../services/api';
import { CalendarPlus, User, Briefcase, CalendarDays, Clock, Plus, X, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const CreateInterview = () => {
  const [candidateName, setCandidateName] = useState('');
  const [role, setRole] = useState('');
  const [date, setDate] = useState('');
  const [slotInput, setSlotInput] = useState('');
  const [slotList, setSlotList] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const addSlot = () => {
    if (!slotInput.trim()) return;
    if (slotList.includes(slotInput.trim())) {
      toast.error('Slot already added');
      return;
    }
    setSlotList([...slotList, slotInput.trim()]);
    setSlotInput('');
  };

  const removeSlot = (index) => {
    setSlotList(slotList.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSlot();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!candidateName || !role || !date) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (slotList.length === 0) {
      toast.error('Please add at least one time slot');
      return;
    }

    setLoading(true);
    try {
      const slotArray = slotList.map((s) => ({ time: s }));
      await API.post('/interviews/create', {
        candidateName,
        role,
        date,
        slots: slotArray,
      });
      toast.success('Interview scheduled successfully!');
      setTimeout(() => navigate('/'), 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create interview');
    }
    setLoading(false);
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <CalendarPlus className="w-7 h-7 text-primary-400" />
          <h1 className="text-2xl md:text-3xl font-bold text-white">Schedule Interview</h1>
        </div>
        <p className="text-surface-400 ml-10">Create a new interview and add available time slots</p>
      </div>

      <div className="max-w-2xl">
        <div className="glass-card p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Candidate Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-surface-300 flex items-center gap-2">
                <User className="w-4 h-4 text-primary-400" />
                Candidate Name
              </label>
              <input
                id="create-candidate-name"
                className="input-field"
                placeholder="e.g. John Doe"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
              />
            </div>

            {/* Role */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-surface-300 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-primary-400" />
                Role / Position
              </label>
              <input
                id="create-role"
                className="input-field"
                placeholder="e.g. Senior Frontend Developer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>

            {/* Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-surface-300 flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-primary-400" />
                Interview Date
              </label>
              <input
                id="create-date"
                type="date"
                className="input-field"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            {/* Time Slots */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-surface-300 flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary-400" />
                Time Slots
              </label>
              <div className="flex gap-2">
                <input
                  id="create-slot-input"
                  className="input-field flex-1"
                  placeholder="e.g. 10:00 AM"
                  value={slotInput}
                  onChange={(e) => setSlotInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button
                  type="button"
                  onClick={addSlot}
                  className="px-4 py-3 bg-primary-600/20 text-primary-400 border border-primary-500/30 rounded-xl hover:bg-primary-600/30 transition-all duration-300"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {/* Slot Chips */}
              {slotList.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {slotList.map((slot, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-500/15 text-primary-300 text-sm font-medium rounded-lg border border-primary-500/20 animate-scale-in"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      {slot}
                      <button
                        type="button"
                        onClick={() => removeSlot(index)}
                        className="ml-1 text-primary-400/60 hover:text-red-400 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <p className="text-xs text-surface-500 mt-1">
                Type a time and press Enter or click + to add. Add multiple slots for the candidate to choose from.
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              id="create-submit"
              disabled={loading}
              className={`btn-primary flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Schedule Interview
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateInterview;