import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { BarChart3, Calendar, CheckCircle2, Clock, TrendingUp, Users } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await API.get('/dashboard/stats');
      setStats(res.data);
    } catch (err) {
      toast.error('Failed to load dashboard');
    }
    setLoading(false);
  };

  const statCards = stats
    ? [
        {
          label: 'Total Interviews',
          value: stats.totalInterviews,
          icon: Users,
          color: 'from-primary-500 to-primary-700',
          bgColor: 'bg-primary-500/10',
          textColor: 'text-primary-400',
          borderColor: 'border-primary-500/20',
        },
        {
          label: 'Total Slots',
          value: stats.totalSlots,
          icon: Calendar,
          color: 'from-blue-500 to-blue-700',
          bgColor: 'bg-blue-500/10',
          textColor: 'text-blue-400',
          borderColor: 'border-blue-500/20',
        },
        {
          label: 'Booked Slots',
          value: stats.bookedSlots,
          icon: CheckCircle2,
          color: 'from-accent-500 to-accent-700',
          bgColor: 'bg-accent-500/10',
          textColor: 'text-accent-400',
          borderColor: 'border-accent-500/20',
        },
        {
          label: 'Available Slots',
          value: stats.availableSlots,
          icon: Clock,
          color: 'from-amber-500 to-orange-600',
          bgColor: 'bg-amber-500/10',
          textColor: 'text-amber-400',
          borderColor: 'border-amber-500/20',
        },
      ]
    : [];

  // Loading skeleton
  if (loading) {
    return (
      <div>
        <div className="mb-8">
          <div className="skeleton h-8 w-48 mb-2" />
          <div className="skeleton h-5 w-72" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton h-36 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const bookingRate = stats && stats.totalSlots > 0
    ? Math.round((stats.bookedSlots / stats.totalSlots) * 100)
    : 0;

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

      {/* Booking Rate */}
      {stats && stats.totalSlots > 0 && (
        <div className="glass-card p-6 md:p-8 animate-slide-up">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary-400" />
            Booking Rate
          </h3>
          <div className="flex items-center gap-6">
            <div className="flex-1">
              <div className="w-full bg-surface-800 rounded-full h-4 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${bookingRate}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-sm">
                <span className="text-surface-400">{stats.bookedSlots} booked</span>
                <span className="text-surface-400">{stats.availableSlots} available</span>
              </div>
            </div>
            <div className="text-center">
              <span className="text-4xl font-bold gradient-text">{bookingRate}%</span>
              <p className="text-surface-500 text-xs mt-1">utilization</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;