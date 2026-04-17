import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';
import { List, Eye, Trash2, Search, Calendar, Users, AlertCircle, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';

const InterviewList = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const res = await API.get('/interviews');
      setInterviews(res.data);
    } catch (err) {
      toast.error('Error fetching drives');
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this drive? All bookings will be lost.')) return;

    try {
      await API.delete(`/interviews/${id}`);
      toast.success('Drive deleted');
      fetchInterviews();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const filtered = interviews.filter(
    (i) =>
      i.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div>
        <div className="mb-8">
          <div className="skeleton h-8 w-48 mb-2" />
          <div className="skeleton h-5 w-72" />
        </div>
        <div className="skeleton h-12 w-full rounded-xl mb-6" />
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-32 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6 md:mb-8">
        <div className="flex items-center gap-3 mb-2">
          <List className="w-7 h-7 text-primary-400" />
          <h1 className="text-2xl md:text-3xl font-bold text-white">Interview Drives</h1>
        </div>
        <p className="text-surface-400 ml-10">
          {interviews.length} drive{interviews.length !== 1 ? 's' : ''} active
        </p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
        <input
          type="text"
          className="input-field pl-12"
          placeholder="Search by drive title or role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {interviews.length === 0 && (
        <div className="glass-card p-12 text-center animate-scale-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-surface-800 mb-4">
            <AlertCircle className="w-8 h-8 text-surface-500" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No Drives Yet</h3>
          <p className="text-surface-400 mb-6">Create an interview drive to start scheduling candidates.</p>
          <button onClick={() => navigate('/create')} className="btn-primary inline-flex items-center justify-center w-auto px-6">
            Create Drive
          </button>
        </div>
      )}

      {interviews.length > 0 && filtered.length === 0 && (
        <div className="glass-card p-8 text-center">
          <Search className="w-10 h-10 text-surface-500 mx-auto mb-3" />
          <p className="text-surface-400">No drives match "{searchTerm}"</p>
        </div>
      )}

      <div className="grid gap-4">
        {filtered.map((drive, index) => {
          const bookedCandidates = drive.candidates.filter(c => c.status === 'Booked').length;
          
          return (
            <div
              key={drive._id}
              className="glass-card p-5 md:p-6 hover:border-primary-500/30 hover:shadow-card-hover transition-all duration-500 group"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-primary-500/10">
                      <Briefcase className="w-4 h-4 text-primary-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white truncate">
                      {drive.title}
                    </h3>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 ml-11 text-sm">
                    <span className="flex items-center gap-1.5 text-surface-300">
                      <Briefcase className="w-3.5 h-3.5 text-surface-400"/>
                      {drive.role}
                    </span>
                    <span className="flex items-center gap-1.5 text-surface-300">
                      <Calendar className="w-3.5 h-3.5 text-surface-400"/>
                      {new Date(drive.date).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1.5 text-surface-300">
                      <Users className="w-3.5 h-3.5 text-surface-400"/>
                      {bookedCandidates} / {drive.candidates.length} Booked
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 ml-11 md:ml-0">
                  <button
                    onClick={() => navigate(`/drive/${drive._id}`)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-primary-500/15 text-primary-400 text-sm font-medium rounded-xl border border-primary-500/20 hover:bg-primary-500/25 hover:border-primary-500/40 transition-all duration-300"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="hidden sm:inline">View Details</span>
                  </button>

                  <button
                    onClick={() => handleDelete(drive._id)}
                    className="p-2.5 bg-red-500/15 text-red-400 rounded-xl border border-red-500/20 hover:bg-red-500/25 hover:border-red-500/40 transition-all duration-300"
                    title="Delete Drive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InterviewList;