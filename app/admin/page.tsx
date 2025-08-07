'use client';

import { useState } from 'react';
import UserManagement from '../components/UserManagement';
import Dashboard from '../components/Dashboard';
import Background3D from '../components/Background3D';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users'>('dashboard');

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Background3D />

      <div className="relative z-10 min-h-screen p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 gradient-text">
            Admin Panel
          </h1>
          <p className="text-gray-300">
            Quản lý hệ thống và người dùng
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${activeTab === 'dashboard'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${activeTab === 'users'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
          >
            Quản lý người dùng
          </button>
        </div>

        {/* Content */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
          {activeTab === 'dashboard' ? (
            <Dashboard />
          ) : (
            <UserManagement />
          )}
        </div>

        {/* Sample Login Info */}
        <div className="mt-8 p-6 bg-white/5 rounded-xl border border-white/10">
          <h3 className="text-white font-semibold mb-4">Thông tin đăng nhập mẫu:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
            <div>
              <p><strong>Admin:</strong> admin@example.com / password123</p>
              <p><strong>User:</strong> user@example.com / password123</p>
            </div>
            <div>
              <p><strong>Moderator:</strong> mod@example.com / password123</p>
              <p><strong>Pending:</strong> pending@example.com / password123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
