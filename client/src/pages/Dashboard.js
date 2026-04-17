import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { BarChart3, Calendar, CheckCircle2, Clock, TrendingUp, Users, ArrowRight, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await API.get('/dashboard/stats');
      setData(res.data);
    } catch (err) {
      toast.error('Failed to load dashboard');
    }
    setLoading(false);
  };

  const statCards = data?.stats
    ? [
        {
          label: 'Total Drives',
          value: data.stats.totalDrives,
          icon: Users,
          color: 'from-primary-500 to-primary-700',
          bgColor: 'bg-primary-500/10',
          textColor: 'text-primary-400',
          borderColor: 'border-primary-500/20',
        },
        {
          label: 'Total Slots',
          value: data.stats.totalSlots,
          icon: Calendar,
          color: 'from-blue-500 to-blue-700',
          bgColor: 'bg-blue-500/10',
          textColor: 'text-blue-400',
          borderColor: 'border-blue-500/20',
        },
        {
          label: 'Booked Slots',
          value: data.stats.bookedSlots,
          icon: CheckCircle2,
          color: 'from-accent-500 to-accent-700',
          bgColor: 'bg-accent-500/10',
          textColor: 'text-accent-400',
          borderColor: 'border-accent-500/20',
        },
        {
          label: 'Available Slots',
          value: data.stats.availableSlots,
          icon: Clock,
          color: 'from-amber-500 to-orange-600',
          bgColor: 'bg-amber-500/10',
          textColor: 'text-amber-400',
          borderColor: 'border-amber-500/20',
        },
      ]
    : [];

  if (loading) {
    return (
      <div>
        <div className="mb-8">
          <div className="skeleton h-8 w-48 mb-2" />
          <div className="skeleton h-5 w-72" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton h-36 rounded-2xl" />
          ))}
        </div>
        <div className="skeleton h-64 rounded-2xl" />
      </div>
    );
  }

  const RenderDriveItem = ({ drive }) => (
    <div 
      onClick={() => navigate(`/drive/${drive._id}`)}
      className="flex items-center justify-between p-4 bg-surface-800/30 border border-surface-700/50 rounded-xl hover:bg-surface-700/30 hover:border-primary-500/50 cursor-pointer transition-all duration-300 group"
    >
      <div>
        <h4 className="text-white font-semibold mb-1 group-hover:text-primary-400 transition-colors">{drive.title}</h4>
        <div className="flex items-center gap-4 text-xs text-surface-400">
          <span className="flex items-center gap-1"><Briefcase className="w-3 h-3"/> {drive.role}</span>
          <span className="flex items-center gap-1"><Users className="w-3 h-3"/> {drive.bookedCandidates}/{drive.totalCandidates} Booked</span>
        </div>
      </div>
      <ArrowRight className="w-5 h-5 text-surface-500 group-hover:text-primary-400 transform group-hover:translate-x-1 transition-all" />
    </div>
  );

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <BarChart3 className="w-7 h-7 text-primary-400" />
          <h1 className="text-2xl md:text-3xl font-bold text-white">Dashboard</h1>
        </div>
        <p className="text-surface-400 ml-10">Overview of your interview scheduling activity</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {statCards.map((card, index) => (
          <div
            key={card.label}
            className={`glass-card p-6 hover:shadow-card-hover hover:${card.borderColor} transition-all duration-500 group`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${card.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                <card.icon className={`w-5 h-5 ${card.textColor}`} />
              </div>
              <TrendingUp className={`w-4 h-4 ${card.textColor} opacity-50`} />
            </div>
            <p className="text-surface-400 text-sm font-medium mb-1">{card.label}</p>
            <h2 className="text-3xl font-bold text-white">{card.value}</h2>
          </div>
        ))}
      </div>

      {/* Drives Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Today's Interviews */}
        <div className="glass-card p-6 border-t-4 border-t-accent-500">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-accent-500" />
            Today's Drives
          </h3>
          {data.todayInterviews.length === 0 ? (
            <p className="text-surface-400 text-sm text-center py-6">No interview drives scheduled for today.</p>
          ) : (
            <div className="space-y-3">
              {data.todayInterviews.map((drive) => <RenderDriveItem key={drive._id} drive={drive} />)}
            </div>
          )}
        </div>

        {/* Upcoming Interviews */}
        <div className="glass-card p-6 border-t-4 border-t-primary-500">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary-500" />
            Upcoming Drives
          </h3>
          {data.upcomingInterviews.length === 0 ? (
            <p className="text-surface-400 text-sm text-center py-6">No upcoming interview drives found.</p>
          ) : (
            <div className="space-y-3">
              {data.upcomingInterviews.map((drive) => <RenderDriveItem key={drive._id} drive={drive} />)}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;