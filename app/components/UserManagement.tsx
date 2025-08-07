'use client';

import { useState, useEffect } from 'react';

interface User {
  id: number;
  email: string;
  name: string;
  avatar: string;
  status: string;
  created_at: string;
  updated_at?: string;
}

interface UserManagementProps {
  onRefresh?: () => void;
}

export default function UserManagement({ onRefresh }: UserManagementProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      
      if (response.ok) {
        setUsers(data.users);
      } else {
        setError(data.error || 'Không thể tải danh sách users');
      }
    } catch (error) {
      setError('Lỗi kết nối server');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedUsers.length === 0) {
      alert('Vui lòng chọn ít nhất một user');
      return;
    }

    if (!confirm(`Bạn có chắc muốn ${action} ${selectedUsers.length} users?`)) {
      return;
    }

    try {
      const response = await fetch('/api/admin/users/bulk-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, userIds: selectedUsers }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        setSelectedUsers([]);
        fetchUsers();
        if (onRefresh) onRefresh();
      } else {
        alert(data.error || 'Thao tác thất bại');
      }
    } catch (error) {
      alert('Lỗi kết nối server');
    }
  };

  const handleDeleteUsers = async () => {
    if (selectedUsers.length === 0) {
      alert('Vui lòng chọn ít nhất một user');
      return;
    }

    if (!confirm(`Bạn có chắc muốn xóa ${selectedUsers.length} users? Hành động này không thể hoàn tác!`)) {
      return;
    }

    try {
      const response = await fetch('/api/admin/users/bulk-action', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userIds: selectedUsers }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        setSelectedUsers([]);
        fetchUsers();
        if (onRefresh) onRefresh();
      } else {
        alert(data.error || 'Xóa thất bại');
      }
    } catch (error) {
      alert('Lỗi kết nối server');
    }
  };

  const handleEditUser = async (userData: Partial<User>) => {
    if (!editingUser) return;

    try {
      const response = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Cập nhật thành công');
        setShowEditModal(false);
        setEditingUser(null);
        fetchUsers();
        if (onRefresh) onRefresh();
      } else {
        alert(data.error || 'Cập nhật thất bại');
      }
    } catch (error) {
      alert('Lỗi kết nối server');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Bạn có chắc muốn xóa user này? Hành động này không thể hoàn tác!')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        fetchUsers();
        if (onRefresh) onRefresh();
      } else {
        alert(data.error || 'Xóa thất bại');
      }
    } catch (error) {
      alert('Lỗi kết nối server');
    }
  };

  const toggleUserSelection = (userId: number) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  // Filter và sort users
  const filteredUsers = users
    .filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const aValue = a[sortBy as keyof User];
      const bValue = b[sortBy as keyof User];
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header với thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/10 rounded-xl p-4 border border-white/20">
          <h3 className="text-white font-semibold">Tổng Users</h3>
          <p className="text-2xl font-bold text-purple-300">{users.length}</p>
        </div>
        <div className="bg-white/10 rounded-xl p-4 border border-white/20">
          <h3 className="text-white font-semibold">Đang chờ</h3>
          <p className="text-2xl font-bold text-yellow-300">
            {users.filter(u => u.status === 'pending').length}
          </p>
        </div>
        <div className="bg-white/10 rounded-xl p-4 border border-white/20">
          <h3 className="text-white font-semibold">Hoạt động</h3>
          <p className="text-2xl font-bold text-green-300">
            {users.filter(u => u.status === 'active').length}
          </p>
        </div>
        <div className="bg-white/10 rounded-xl p-4 border border-white/20">
          <h3 className="text-white font-semibold">Bị khóa</h3>
          <p className="text-2xl font-bold text-red-300">
            {users.filter(u => u.status === 'banned').length}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        {/* Search và Filter */}
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">Tất cả status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="inactive">Inactive</option>
            <option value="banned">Banned</option>
          </select>
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field);
              setSortOrder(order as 'asc' | 'desc');
            }}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="created_at-desc">Mới nhất</option>
            <option value="created_at-asc">Cũ nhất</option>
            <option value="name-asc">Tên A-Z</option>
            <option value="name-desc">Tên Z-A</option>
            <option value="email-asc">Email A-Z</option>
            <option value="email-desc">Email Z-A</option>
          </select>
        </div>

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <div className="flex gap-2">
            <button
              onClick={() => handleBulkAction('approve')}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
            >
              Duyệt ({selectedUsers.length})
            </button>
            <button
              onClick={() => handleBulkAction('ban')}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              Khóa ({selectedUsers.length})
            </button>
            <button
              onClick={handleDeleteUsers}
              className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg transition-colors"
            >
              Xóa ({selectedUsers.length})
            </button>
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-white">
          <thead>
            <tr className="border-b border-white/20">
              <th className="text-left p-4">
                <input
                  type="checkbox"
                  checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 text-purple-500 bg-white/10 border-white/20 rounded focus:ring-purple-500 focus:ring-2"
                />
              </th>
              <th className="text-left p-4">ID</th>
              <th className="text-left p-4">Avatar</th>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Email</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Created At</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b border-white/10 hover:bg-white/5">
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => toggleUserSelection(user.id)}
                    className="w-4 h-4 text-purple-500 bg-white/10 border-white/20 rounded focus:ring-purple-500 focus:ring-2"
                  />
                </td>
                <td className="p-4">{user.id}</td>
                <td className="p-4">
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="w-10 h-10 rounded-full"
                  />
                </td>
                <td className="p-4">{user.name}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    user.status === 'active' ? 'bg-green-500/20 text-green-300' :
                    user.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
                    user.status === 'inactive' ? 'bg-gray-500/20 text-gray-300' :
                    'bg-red-500/20 text-red-300'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="p-4">
                  {new Date(user.created_at).toLocaleDateString('vi-VN')}
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingUser(user);
                        setShowEditModal(true);
                      }}
                      className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm transition-colors"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm transition-colors"
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {showEditModal && editingUser && (
        <EditUserModal
          user={editingUser}
          onSave={handleEditUser}
          onClose={() => {
            setShowEditModal(false);
            setEditingUser(null);
          }}
        />
      )}

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4">
          <p className="text-red-200">{error}</p>
        </div>
      )}
    </div>
  );
}

// Edit User Modal Component
interface EditUserModalProps {
  user: User;
  onSave: (userData: Partial<User>) => void;
  onClose: () => void;
}

function EditUserModal({ user, onSave, onClose }: EditUserModalProps) {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    status: user.status,
    avatar: user.avatar
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-white mb-6">Sửa User</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white text-sm font-medium mb-2">Tên</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-white text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-white text-sm font-medium mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
              <option value="banned">Banned</option>
            </select>
          </div>
          
          <div>
            <label className="block text-white text-sm font-medium mb-2">Avatar URL</label>
            <input
              type="url"
              value={formData.avatar}
              onChange={(e) => setFormData(prev => ({ ...prev, avatar: e.target.value }))}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
            >
              Lưu
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
