import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';
import { List, Eye, Pencil, Trash2, Search, Calendar, User, Briefcase, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const InterviewList = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const res = await API.get('/interviews');
      setInterviews(res.data);
    } catch (err) {
      toast.error('Error fetching interviews');
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this interview?')) return;

    try {
      await API.delete(`/interviews/${id}`);
      toast.success('Interview deleted');
      fetchInterviews();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const startEdit = (interview) => {
    setEditingId(interview._id);
    setEditName(interview.candidateName);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
  };

  const saveEdit = async (id) => {
    if (!editName.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    try {
      await API.put(`/interviews/${id}`, { candidateName: editName });
      toast.success('Updated successfully');
      setEditingId(null);
      setEditName('');
      fetchInterviews();
    } catch (err) {
      toast.error('Update failed');
    }
  };

  const handleEditKeyDown = (e, id) => {
    if (e.key === 'Enter') saveEdit(id);
    if (e.key === 'Escape') cancelEdit();
  };

  const filtered = interviews.filter(
    (i) =>
      i.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Loading skeleton
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
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex items-center gap-3 mb-2">
          <List className="w-7 h-7 text-primary-400" />
          <h1 className="text-2xl md:text-3xl font-bold text-white">Interviews</h1>
        </div>
        <p className="text-surface-400 ml-10">
          {interviews.length} interview{interviews.length !== 1 ? 's' : ''} scheduled
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
        <input
          id="interview-search"
          type="text"
          className="input-field pl-12"
          placeholder="Search by candidate name or role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Empty State */}
      {interviews.length === 0 && (
        <div className="glass-card p-12 text-center animate-scale-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-surface-800 mb-4">
            <AlertCircle className="w-8 h-8 text-surface-500" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No Interviews Yet</h3>
          <p className="text-surface-400 mb-6">
            Get started by scheduling your first interview
          </p>
          <button
            onClick={() => navigate('/create')}
            className="btn-primary inline-flex items-center justify-center gap-2 w-auto"
          >
            Schedule Interview
          </button>
        </div>
      )}

      {/* No Search Results */}
      {interviews.length > 0 && filtered.length === 0 && (
        <div className="glass-card p-8 text-center">
          <Search className="w-10 h-10 text-surface-500 mx-auto mb-3" />
          <p className="text-surface-400">No interviews match "{searchTerm}"</p>
        </div>
      )}

      {/* Interview Cards */}
      <div className="grid gap-4">
        {filtered.map((interview, index) => (
          <div
            key={interview._id}
            className="glass-card p-5 md:p-6 hover:border-primary-500/30 hover:shadow-card-hover transition-all duration-500 group"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-primary-500/10">
                    <User className="w-4 h-4 text-primary-400" />
                  </div>
                  {editingId === interview._id ? (
                    <input
                      id={`edit-name-${interview._id}`}
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => handleEditKeyDown(e, interview._id)}
                      onBlur={() => saveEdit(interview._id)}
                      autoFocus
                      className="input-field py-1 px-3 text-lg font-semibold"
                    />
                  ) : (
                    <h3 className="text-lg font-semibold text-white truncate">
                      {interview.candidateName}
                    </h3>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-3 ml-11 text-sm">
                  <span className="flex items-center gap-1.5 text-surface-400">
                    <Briefcase className="w-3.5 h-3.5" />
                    {interview.role}
                  </span>
                  <span className="flex items-center gap-1.5 text-surface-400">
                    <Calendar className="w-3.5 h-3.5" />
                    {interview.date
                      ? new Date(interview.date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })
                      : 'No date'}
                  </span>
                  <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-accent-500/15 text-accent-400 border border-accent-500/20">
                    {interview.slots?.length || 0} slots
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 ml-11 md:ml-0">
                <button
                  id={`view-slots-${interview._id}`}
                  onClick={() => navigate(`/slots/${interview._id}`)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-500/15 text-primary-400 text-sm font-medium rounded-xl border border-primary-500/20 hover:bg-primary-500/25 hover:border-primary-500/40 transition-all duration-300"
                >
                  <Eye className="w-4 h-4" />
                  <span className="hidden sm:inline">View Slots</span>
                </button>

                <button
                  id={`edit-${interview._id}`}
                  onClick={() => startEdit(interview)}
                  className="p-2.5 bg-amber-500/15 text-amber-400 rounded-xl border border-amber-500/20 hover:bg-amber-500/25 hover:border-amber-500/40 transition-all duration-300"
                  title="Edit"
                >
                  <Pencil className="w-4 h-4" />
                </button>

                <button
                  id={`delete-${interview._id}`}
                  onClick={() => handleDelete(interview._id)}
                  className="p-2.5 bg-red-500/15 text-red-400 rounded-xl border border-red-500/20 hover:bg-red-500/25 hover:border-red-500/40 transition-all duration-300"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InterviewList;