import React, { useEffect, useState, useCallback } from 'react';
import API from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, Mail, CheckCircle, Clock, Send, ArrowLeft, Briefcase, Calendar, X, KeySquare } from 'lucide-react';
import toast from 'react-hot-toast';

const DriveDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [drive, setDrive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Email Config Modal State
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [emailUser, setEmailUser] = useState('');
  const [emailPass, setEmailPass] = useState('');
  const [savingConfig, setSavingConfig] = useState(false);

  const fetchDrive = useCallback(async () => {
    try {
      const res = await API.get(`/interviews/${id}`);
      setDrive(res.data);
    } catch (err) {
      toast.error('Failed to load drive details');
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchDrive();
  }, [fetchDrive]);

  const sendEmails = async () => {
    setSending(true);
    const toastId = toast.loading('Sending emails...');
    try {
      const res = await API.post(`/interviews/${id}/send-emails`);
      toast.success(res.data.message, { id: toastId });
      fetchDrive();
    } catch (err) {
      if (err.response?.data?.message === 'EMAIL_NOT_CONFIGURED') {
        toast.error('Email configuration required', { id: toastId });
        setShowConfigModal(true);
      } else if (err.response?.data?.message === 'EMAIL_AUTH_FAILED') {
        toast.error('Invalid App Password. Please update it.', { id: toastId });
        setShowConfigModal(true);
      } else {
        toast.error(err.response?.data?.message || 'Failed to send emails', { id: toastId });
      }
    }
    setSending(false);
  };

  const handleSaveEmailConfig = async (e) => {
    e.preventDefault();
    if (!emailUser.trim() || !emailPass.trim()) {
      toast.error('Please enter both email and App Password');
      return;
    }
    
    setSavingConfig(true);
    try {
      await API.put('/users/email-config', { emailUser, emailPass });
      toast.success('Email settings saved!');
      setShowConfigModal(false);
      // Automatically retry sending
      sendEmails();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save configuration');
    }
    setSavingConfig(false);
  };

  if (loading) {
    return (
      <div>
        <div className="skeleton h-10 w-32 mb-8" />
        <div className="skeleton h-24 w-full mb-6" />
        <div className="skeleton h-64 w-full" />
      </div>
    );
  }

  if (!drive) return <div className="text-white">Drive not found</div>;

  return (
    <div className="animate-fade-in relative">
      {/* Email Configuration Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-950/80 backdrop-blur-sm animate-fade-in">
          <div className="glass-card w-full max-w-lg p-6 relative animate-scale-in">
            <button 
              onClick={() => setShowConfigModal(false)}
              className="absolute top-4 right-4 text-surface-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary-500/20 rounded-lg">
                <KeySquare className="w-6 h-6 text-primary-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Configure Email Sender</h2>
            </div>
            
            <p className="text-sm text-surface-300 mb-6">
              To send emails to candidates, you need to connect your work/personal Gmail account using an <strong>App Password</strong>.
            </p>

            <div className="bg-surface-800/50 p-4 rounded-xl border border-surface-700/50 mb-6 text-sm">
              <h4 className="text-white font-semibold mb-2">How to get an App Password:</h4>
              <ol className="list-decimal pl-5 text-surface-400 space-y-1.5">
                <li>Go to your Google Account Settings &gt; Security</li>
                <li>Turn on <strong>2-Step Verification</strong></li>
                <li>Search for <strong>"App Passwords"</strong></li>
                <li>Create an app named "InterviewHub"</li>
                <li>Copy the 16-character password and paste it below</li>
              </ol>
            </div>

            <form onSubmit={handleSaveEmailConfig} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-surface-300 mb-1">Your Gmail Address</label>
                <input 
                  type="email" 
                  value={emailUser}
                  onChange={(e) => setEmailUser(e.target.value)}
                  placeholder="e.g. yourname@gmail.com"
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-300 mb-1">Gmail App Password</label>
                <input 
                  type="password" 
                  value={emailPass}
                  onChange={(e) => setEmailPass(e.target.value)}
                  placeholder="16-character app password"
                  className="input-field"
                  required
                />
              </div>
              <button 
                type="submit" 
                disabled={savingConfig}
                className={`btn-primary w-full mt-2 flex justify-center ${savingConfig ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {savingConfig ? 'Saving...' : 'Save & Send Emails'}
              </button>
            </form>
          </div>
        </div>
      )}


      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-surface-400 hover:text-white mb-6 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Back to Drives</span>
      </button>

      {/* Header Card */}
      <div className="glass-card p-6 md:p-8 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{drive.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-surface-300">
            <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-primary-400"/> {drive.role}</span>
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-primary-400"/> {new Date(drive.date).toLocaleDateString()}</span>
            <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-primary-400"/> {drive.candidates.length} Candidates</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-primary-400"/> {drive.slots.length} Slots</span>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => setShowConfigModal(true)}
            className="p-2.5 md:p-3 bg-surface-800/50 text-surface-400 border border-surface-700/50 rounded-xl hover:text-white hover:bg-surface-700 hover:border-surface-600 transition-all"
            title="Update Email Configuration"
          >
            <KeySquare className="w-5 h-5" />
          </button>
          <button
            onClick={sendEmails}
            disabled={sending}
            className={`btn-primary flex items-center justify-center gap-2 flex-1 md:flex-none ${sending ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {sending ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-5 h-5" />
                Send Booking Emails
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Candidates Table */}
        <div className="lg:col-span-2 glass-card p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary-400" />
            Candidates Status
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-surface-700/50 text-surface-400 text-sm">
                  <th className="pb-3 font-medium">Candidate</th>
                  <th className="pb-3 font-medium">Email Status</th>
                  <th className="pb-3 font-medium">Booking Status</th>
                  <th className="pb-3 font-medium">Booked Slot</th>
                </tr>
              </thead>
              <tbody>
                {drive.candidates.map((c, idx) => (
                  <tr key={idx} className="border-b border-surface-700/50 hover:bg-surface-800/30 transition-colors">
                    <td className="py-4">
                      <p className="text-white font-medium">{c.name}</p>
                      <p className="text-xs text-surface-400">{c.email}</p>
                    </td>
                    <td className="py-4">
                      {c.mailSent ? (
                        <span className="inline-flex items-center gap-1 text-accent-400 text-xs font-semibold px-2 py-1 bg-accent-500/10 rounded-full">
                          <CheckCircle className="w-3 h-3" /> Sent
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-surface-400 text-xs font-semibold px-2 py-1 bg-surface-700/50 rounded-full">
                          <Mail className="w-3 h-3" /> Pending
                        </span>
                      )}
                    </td>
                    <td className="py-4">
                       {c.status === 'Booked' ? (
                        <span className="inline-flex items-center gap-1 text-accent-400 text-xs font-semibold px-2 py-1 bg-accent-500/10 rounded-full">
                          <CheckCircle className="w-3 h-3" /> Booked
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-400 text-xs font-semibold px-2 py-1 bg-amber-500/10 rounded-full">
                          <Clock className="w-3 h-3" /> Waiting
                        </span>
                      )}
                    </td>
                    <td className="py-4 text-sm text-white font-medium">
                      {c.bookedSlotTime || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Slots Overview */}
        <div className="glass-card p-6 h-fit">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary-400" />
            Slots Overview
          </h2>
          <div className="space-y-3">
            {drive.slots.map((s, idx) => (
              <div key={idx} className={`p-3 rounded-xl flex items-center justify-between border ${s.isBooked ? 'bg-surface-800/50 border-surface-700/50' : 'bg-accent-500/10 border-accent-500/20'}`}>
                <div className="flex items-center gap-2">
                  <Clock className={`w-4 h-4 ${s.isBooked ? 'text-surface-500' : 'text-accent-400'}`} />
                  <span className={`font-medium ${s.isBooked ? 'text-surface-300' : 'text-accent-400'}`}>{s.time}</span>
                </div>
                {s.isBooked ? (
                  <span className="text-xs font-medium text-surface-400 truncate max-w-[120px]">
                    {s.bookedBy}
                  </span>
                ) : (
                  <span className="text-xs font-medium text-accent-400">Available</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriveDetails;
