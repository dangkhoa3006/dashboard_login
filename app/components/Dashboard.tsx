'use client';

import { useState, useEffect } from 'react';

interface Stats {
  totalUsers: number;
  usersByStatus: {
    active: number;
    pending: number;
    inactive: number;
    banned: number;
  };
  newUsersThisWeek: number;
  newUsersThisMonth: number;
  latestUsers: Array<{
    id: number;
    email: string;
    name: string;
    status: string;
    created_at: string;
  }>;
  dailyStats: Array<{
    date: string;
    count: number;
  }>;
  activeSessions: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/stats');
      const data = await response.json();
      
      if (response.ok) {
        setStats(data.stats);
      } else {
        setError(data.error || 'Không thể tải thống kê');
      }
    } catch (error) {
      setError('Lỗi kết nối server');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4">
        <p className="text-red-200">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm">Tổng Users</p>
              <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm">Hoạt động</p>
              <p className="text-3xl font-bold text-white">{stats.usersByStatus.active}</p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm">Chờ duyệt</p>
              <p className="text-3xl font-bold text-white">{stats.usersByStatus.pending}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm">Bị khóa</p>
              <p className="text-3xl font-bold text-white">{stats.usersByStatus.banned}</p>
            </div>
            <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <h3 className="text-white font-semibold mb-4">Tăng trưởng</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Tuần này</span>
              <span className="text-green-400 font-semibold">+{stats.newUsersThisWeek}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Tháng này</span>
              <span className="text-blue-400 font-semibold">+{stats.newUsersThisMonth}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Sessions</span>
              <span className="text-purple-400 font-semibold">{stats.activeSessions}</span>
            </div>
          </div>
        </div>

        {/* Latest Users */}
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <h3 className="text-white font-semibold mb-4">Users mới nhất</h3>
          <div className="space-y-3">
            {stats.latestUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{user.name}</p>
                    <p className="text-gray-400 text-xs">{user.email}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  user.status === 'active' ? 'bg-green-500/20 text-green-300' :
                  user.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
                  user.status === 'inactive' ? 'bg-gray-500/20 text-gray-300' :
                  'bg-red-500/20 text-red-300'
                }`}>
                  {user.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <h3 className="text-white font-semibold mb-4">Phân bố Status</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Active</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${(stats.usersByStatus.active / stats.totalUsers) * 100}%` }}
                  ></div>
                </div>
                <span className="text-white text-sm">{stats.usersByStatus.active}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Pending</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full" 
                    style={{ width: `${(stats.usersByStatus.pending / stats.totalUsers) * 100}%` }}
                  ></div>
                </div>
                <span className="text-white text-sm">{stats.usersByStatus.pending}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Inactive</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gray-500 h-2 rounded-full" 
                    style={{ width: `${(stats.usersByStatus.inactive / stats.totalUsers) * 100}%` }}
                  ></div>
                </div>
                <span className="text-white text-sm">{stats.usersByStatus.inactive}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Banned</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full" 
                    style={{ width: `${(stats.usersByStatus.banned / stats.totalUsers) * 100}%` }}
                  ></div>
                </div>
                <span className="text-white text-sm">{stats.usersByStatus.banned}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Stats Chart */}
      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
        <h3 className="text-white font-semibold mb-4">Thống kê 7 ngày qua</h3>
        <div className="flex items-end justify-between h-32 space-x-2">
          {stats.dailyStats.map((day, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className="w-full bg-gray-700 rounded-t-lg relative">
                <div 
                  className="bg-gradient-to-t from-purple-500 to-pink-500 rounded-t-lg transition-all duration-300"
                  style={{ 
                    height: `${Math.max((day.count / Math.max(...stats.dailyStats.map(d => d.count))) * 100, 10)}%` 
                  }}
                ></div>
              </div>
              <span className="text-gray-400 text-xs mt-2">
                {new Date(day.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
              </span>
              <span className="text-white text-xs font-semibold">{day.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Refresh Button */}
      <div className="text-center">
        <button
          onClick={fetchStats}
          className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-colors flex items-center space-x-2 mx-auto"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Làm mới thống kê</span>
        </button>
      </div>
    </div>
  );
}
