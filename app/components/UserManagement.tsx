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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem' }}>
        <div style={{ width: '2rem', height: '2rem', border: '2px solid rgba(102, 126, 234, 0.3)', borderTop: '2px solid #667eea', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
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
              <div className="architect-stat-value">{users.length}</div>
              <div className="architect-stat-change positive">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                All registered users
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
              <div className="architect-stat-title">Pending Users</div>
              <div className="architect-stat-value">
                {users.filter(u => u.status === 'pending').length}
              </div>
              <div className="architect-stat-change negative">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
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
              <div className="architect-stat-title">Active Users</div>
              <div className="architect-stat-value">
                {users.filter(u => u.status === 'active').length}
              </div>
              <div className="architect-stat-change positive">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Verified accounts
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
              <div className="architect-stat-title">Banned Users</div>
              <div className="architect-stat-value">
                {users.filter(u => u.status === 'banned').length}
              </div>
              <div className="architect-stat-change negative">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                </svg>
                Suspended accounts
              </div>
            </div>
            <div className="architect-stat-icon" style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="architect-chart-card" style={{ marginBottom: '2rem' }}>
        <div className="architect-chart-header">
          <h3 className="architect-chart-title">User Management</h3>
          <div className="architect-chart-actions">
            {selectedUsers.length > 0 && (
              <>
                <button
                  onClick={() => handleBulkAction('approve')}
                  className="architect-btn architect-btn-primary"
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Approve ({selectedUsers.length})
                </button>
                <button
                  onClick={() => handleBulkAction('ban')}
                  className="architect-btn architect-btn-secondary"
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                  </svg>
                  Ban ({selectedUsers.length})
                </button>
                <button
                  onClick={handleDeleteUsers}
                  className="architect-btn architect-btn-secondary"
                  style={{ background: '#ef4444', color: 'white' }}
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete ({selectedUsers.length})
                </button>
              </>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="architect-input"
          />
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="architect-select"
              style={{ flex: 1, minWidth: '150px' }}
            >
              <option value="all">All Status</option>
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
              className="architect-select"
              style={{ flex: 1, minWidth: '150px' }}
            >
              <option value="created_at-desc">Newest First</option>
              <option value="created_at-asc">Oldest First</option>
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="email-asc">Email A-Z</option>
              <option value="email-desc">Email Z-A</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="architect-table-card">
        <table className="architect-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                  onChange={toggleSelectAll}
                  style={{ width: '1rem', height: '1rem' }}
                />
              </th>
              <th>User</th>
              <th>Email</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => toggleUserSelection(user.id)}
                    style={{ width: '1rem', height: '1rem' }}
                  />
                </td>
                <td>
                  <div className="architect-user-info">
                    <img
                      src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=667eea&color=fff`}
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
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => {
                        setEditingUser(user);
                        setShowEditModal(true);
                      }}
                      className="architect-btn architect-btn-primary"
                      style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}
                    >
                      <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="architect-btn architect-btn-secondary"
                      style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem', background: '#ef4444', color: 'white' }}
                    >
                      <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
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
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '12px', padding: '1rem', marginTop: '1rem' }}>
          <p style={{ color: '#ef4444' }}>{error}</p>
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
    <div className="admin-modal">
      <div className="admin-modal-content">
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1.5rem' }}>Edit User</h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', color: '#64748b', fontSize: '0.9rem', fontWeight: 500, marginBottom: '0.5rem' }}>Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="admin-input"
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', color: '#64748b', fontSize: '0.9rem', fontWeight: 500, marginBottom: '0.5rem' }}>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="admin-input"
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', color: '#64748b', fontSize: '0.9rem', fontWeight: 500, marginBottom: '0.5rem' }}>Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              className="admin-select"
            >
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
              <option value="banned">Banned</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', color: '#64748b', fontSize: '0.9rem', fontWeight: 500, marginBottom: '0.5rem' }}>Avatar URL</label>
            <input
              type="url"
              value={formData.avatar}
              onChange={(e) => setFormData(prev => ({ ...prev, avatar: e.target.value }))}
              className="admin-input"
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', paddingTop: '1rem' }}>
            <button
              type="submit"
              className="architect-btn architect-btn-primary"
              style={{ flex: 1 }}
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={onClose}
              className="architect-btn architect-btn-secondary"
              style={{ flex: 1 }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
