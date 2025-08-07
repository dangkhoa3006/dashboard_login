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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem' }}>
        <div style={{ width: '2rem', height: '2rem', border: '2px solid rgba(102, 126, 234, 0.3)', borderTop: '2px solid #667eea', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '12px', padding: '1rem' }}>
        <p style={{ color: '#ef4444' }}>{error}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Stats Cards */}
      <div className="architect-stats-grid">
        <div className="architect-stat-card">
          <div className="architect-stat-header">
            <div>
              <div className="architect-stat-title">Total Users</div>
              <div className="architect-stat-value">{stats.totalUsers}</div>
              <div className="architect-stat-change positive">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                +{stats.newUsersThisWeek} this week
              </div>
            </div>
            <div className="architect-stat-icon" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="architect-stat-card">
          <div className="architect-stat-header">
            <div>
              <div className="architect-stat-title">Active Users</div>
              <div className="architect-stat-value">{stats.usersByStatus.active}</div>
              <div className="architect-stat-change positive">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                {Math.round((stats.usersByStatus.active / stats.totalUsers) * 100)}% of total
              </div>
            </div>
            <div className="architect-stat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="architect-stat-card">
          <div className="architect-stat-header">
            <div>
              <div className="architect-stat-title">Pending Users</div>
              <div className="architect-stat-value">{stats.usersByStatus.pending}</div>
              <div className="architect-stat-change negative">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
                Needs approval
              </div>
            </div>
            <div className="architect-stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="architect-stat-card">
          <div className="architect-stat-header">
            <div>
              <div className="architect-stat-title">Active Sessions</div>
              <div className="architect-stat-value">{stats.activeSessions}</div>
              <div className="architect-stat-change positive">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Real-time
              </div>
            </div>
            <div className="architect-stat-icon" style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}>
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="architect-content-grid">
        {/* Chart Card */}
        <div className="architect-chart-card">
          <div className="architect-chart-header">
            <h3 className="architect-chart-title">User Growth (7 Days)</h3>
            <div className="architect-chart-actions">
              <button className="architect-btn architect-btn-secondary">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
          </div>
          
          <div style={{ height: '300px', display: 'flex', alignItems: 'end', justifyContent: 'space-between', gap: '0.5rem' }}>
            {stats.dailyStats.map((day, index) => (
              <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                <div style={{ width: '100%', background: '#e2e8f0', borderRadius: '8px 8px 0 0', position: 'relative', height: '200px' }}>
                  <div
                    style={{
                      background: 'linear-gradient(to top, #667eea, #764ba2)',
                      borderRadius: '8px 8px 0 0',
                      transition: 'all 0.3s',
                      height: `${Math.max((day.count / Math.max(...stats.dailyStats.map(d => d.count))) * 100, 10)}%`,
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0
                    }}
                  ></div>
                </div>
                <span style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                  {new Date(day.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                </span>
                <span style={{ color: '#1e293b', fontSize: '0.75rem', fontWeight: 600 }}>{day.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Status Distribution */}
        <div className="architect-chart-card">
          <div className="architect-chart-header">
            <h3 className="architect-chart-title">User Status Distribution</h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Active</span>
                <span style={{ color: '#1e293b', fontSize: '0.9rem', fontWeight: 600 }}>{stats.usersByStatus.active}</span>
              </div>
              <div className="architect-progress">
                <div 
                  className="architect-progress-bar green"
                  style={{ width: `${(stats.usersByStatus.active / stats.totalUsers) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Pending</span>
                <span style={{ color: '#1e293b', fontSize: '0.9rem', fontWeight: 600 }}>{stats.usersByStatus.pending}</span>
              </div>
              <div className="architect-progress">
                <div 
                  className="architect-progress-bar yellow"
                  style={{ width: `${(stats.usersByStatus.pending / stats.totalUsers) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Inactive</span>
                <span style={{ color: '#1e293b', fontSize: '0.9rem', fontWeight: 600 }}>{stats.usersByStatus.inactive}</span>
              </div>
              <div className="architect-progress">
                <div 
                  className="architect-progress-bar blue"
                  style={{ width: `${(stats.usersByStatus.inactive / stats.totalUsers) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Banned</span>
                <span style={{ color: '#1e293b', fontSize: '0.9rem', fontWeight: 600 }}>{stats.usersByStatus.banned}</span>
              </div>
              <div className="architect-progress">
                <div 
                  className="architect-progress-bar red"
                  style={{ width: `${(stats.usersByStatus.banned / stats.totalUsers) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Latest Users Table */}
      <div className="architect-table-card">
        <div className="architect-chart-header">
          <h3 className="architect-chart-title">Latest Users</h3>
          <div className="architect-chart-actions">
            <button className="architect-btn architect-btn-primary">
              View All
            </button>
          </div>
        </div>
        
        <table className="architect-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Status</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {stats.latestUsers.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="architect-user-info">
                    <img 
                      src={`https://ui-avatars.com/api/?name=${user.name}&background=667eea&color=fff`}
                      alt={user.name}
                      className="architect-avatar"
                    />
                    <div className="architect-user-details">
                      <h4>{user.name}</h4>
                      <p>ID: {user.id}</p>
                    </div>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>
                  <span className={`architect-status architect-status-${user.status}`}>
                    {user.status}
                  </span>
                </td>
                <td>{new Date(user.created_at).toLocaleDateString('vi-VN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
