import React, { useState } from 'react';
import API from '../services/api';
import { CalendarPlus, User, Briefcase, CalendarDays, Clock, Plus, X, Sparkles, Mail, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const CreateInterview = () => {
  const [title, setTitle] = useState('');
  const [role, setRole] = useState('');
  const [date, setDate] = useState('');
  
  // Slots
  const [slotInput, setSlotInput] = useState('');
  const [slotList, setSlotList] = useState([]);
  
  // Candidates
  const [candidateName, setCandidateName] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [candidatesList, setCandidatesList] = useState([]);

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

  const addCandidate = () => {
    if (!candidateName.trim() || !candidateEmail.trim()) {
      toast.error('Name and Email required');
      return;
    }
    if (candidatesList.some(c => c.email === candidateEmail.trim())) {
      toast.error('Candidate email already added');
      return;
    }
    setCandidatesList([...candidatesList, { name: candidateName.trim(), email: candidateEmail.trim() }]);
    setCandidateName('');
    setCandidateEmail('');
  };

  const removeCandidate = (index) => {
    setCandidatesList(candidatesList.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !role || !date) {
      toast.error('Please fill in title, role, and date');
      return;
    }
    if (slotList.length === 0) {
      toast.error('Please add at least one time slot');
      return;
    }
    if (candidatesList.length === 0) {
      toast.error('Please add at least one candidate');
      return;
    }

    setLoading(true);
    try {
      const slotArray = slotList.map((s) => ({ time: s }));
      await API.post('/interviews/create', {
        title,
        role,
        date,
        candidates: candidatesList,
        slots: slotArray,
      });
      toast.success('Interview Drive created successfully!');
      setTimeout(() => navigate('/'), 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create drive');
    }
    setLoading(false);
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <CalendarPlus className="w-7 h-7 text-primary-400" />
          <h1 className="text-2xl md:text-3xl font-bold text-white">Create Interview Drive</h1>
        </div>
        <p className="text-surface-400 ml-10">Schedule a new interview drive and add multiple candidates</p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="glass-card p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Drive Title */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-surface-300 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-primary-400" />
                  Drive Title
                </label>
                <input
                  className="input-field"
                  placeholder="e.g. Campus Recruitment 2026"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Role */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-surface-300 flex items-center gap-2">
                  <User className="w-4 h-4 text-primary-400" />
                  Role / Position
                </label>
                <input
                  className="input-field"
                  placeholder="e.g. MERN Stack Developer"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />
              </div>
            </div>

            {/* Date */}
            <div className="space-y-2 md:w-1/2">
              <label className="text-sm font-medium text-surface-300 flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-primary-400" />
                Interview Date
              </label>
              <input
                type="date"
                className="input-field"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <hr className="border-surface-700/50" />

            {/* Candidates Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-primary-400" />
                Add Candidates
              </h3>
              <div className="flex flex-col md:flex-row gap-2">
                <input
                  className="input-field flex-1"
                  placeholder="Candidate Name"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                />
                <input
                  type="email"
                  className="input-field flex-1"
                  placeholder="Candidate Email"
                  value={candidateEmail}
                  onChange={(e) => setCandidateEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCandidate())}
                />
                <button
                  type="button"
                  onClick={addCandidate}
                  className="px-4 py-3 bg-primary-600/20 text-primary-400 border border-primary-500/30 rounded-xl hover:bg-primary-600/30 transition-all duration-300"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {candidatesList.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                  {candidatesList.map((c, index) => (
                    <div key={index} className="flex flex-col p-3 bg-surface-800/50 rounded-xl border border-surface-700/50 animate-scale-in">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-white">{c.name}</p>
                          <p className="text-xs text-surface-400 flex items-center gap-1 mt-1"><Mail className="w-3 h-3"/> {c.email}</p>
                        </div>
                        <button type="button" onClick={() => removeCandidate(index)} className="text-red-400 hover:text-red-300"><X className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <hr className="border-surface-700/50" />

            {/* Time Slots Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary-400" />
                Available Time Slots
              </h3>
              <div className="flex gap-2 md:w-1/2">
                <input
                  className="input-field flex-1"
                  placeholder="e.g. 10:00 AM"
                  value={slotInput}
                  onChange={(e) => setSlotInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSlot())}
                />
                <button
                  type="button"
                  onClick={addSlot}
                  className="px-4 py-3 bg-primary-600/20 text-primary-400 border border-primary-500/30 rounded-xl hover:bg-primary-600/30 transition-all duration-300"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {slotList.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {slotList.map((slot, index) => (
                    <span key={index} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-500/15 text-primary-300 text-sm font-medium rounded-lg border border-primary-500/20 animate-scale-in">
                      <Clock className="w-3.5 h-3.5" />
                      {slot}
                      <button type="button" onClick={() => removeSlot(index)} className="ml-1 text-primary-400/60 hover:text-red-400 transition-colors">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`btn-primary flex items-center justify-center gap-2 w-full md:w-auto md:px-12 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Create Drive
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateInterview;