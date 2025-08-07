'use client';

import { useState, useEffect, useRef } from 'react';
import UserManagement from '../components/UserManagement';
import Dashboard from '../components/Dashboard';
import PageBuilder from '../components/PageBuilder';
import Background3D from '../components/Background3D';

function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <div className="architect-user-dropdown" ref={dropdownRef}>
      <img
        src="https://randomuser.me/api/portraits/men/32.jpg"
        alt="User"
        className="architect-topbar-avatar"
        style={{ marginLeft: '1rem', cursor: 'pointer' }}
        onClick={() => setIsOpen(!isOpen)}
      />

      {isOpen && (
        <div className="architect-user-dropdown-menu">
          <div className="architect-user-dropdown-header">
            <p className="architect-user-dropdown-name">Dr. Robar Smith</p>
            <p className="architect-user-dropdown-email">robar@example.com</p>
          </div>

          <button className="architect-user-dropdown-item">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            My Profile
          </button>

          <button className="architect-user-dropdown-item">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </button>

          <div className="architect-user-dropdown-divider"></div>

          <button className="architect-user-dropdown-item danger" onClick={handleLogout}>
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}

function ArchitectTopbar() {
  return (
    <div className="architect-topbar">
      <div className="architect-topbar-left">
        <div className="architect-topbar-logo">
          <span>dp Marketing Dashboard</span>
        </div>
      </div>

      <div className="architect-topbar-center">
        <div className="architect-topbar-search">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" strokeWidth="2" />
            <path strokeWidth="2" d="M21 21l-4.35-4.35" />
          </svg>
          <input type="text" placeholder="Search here..." />
        </div>
      </div>

      <div className="architect-topbar-right">
        <div className="architect-topbar-menu">
          <button className="architect-topbar-menu-item">
            Mega Menu
          </button>
          <button className="architect-topbar-menu-item" style={{ position: 'relative' }}>
            Settings
            <span className="badge">4</span>
          </button>
          <button className="architect-topbar-menu-item">Projects</button>
        </div>

        <div className="architect-topbar-actions">
          <button className="architect-topbar-action-item" title="Notifications">
            <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v0.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
          <button className="architect-topbar-action-item" title="Messages">
            <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </button>
          <div className="architect-topbar-divider"></div>
          <UserDropdown />
        </div>
      </div>
    </div>
  );
}

function MarketingSidebar() {
  const [expandedItems, setExpandedItems] = useState(['dashboard']);

  const toggleExpanded = (item: string) => {
    setExpandedItems(prev =>
      prev.includes(item)
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
  };

  return (
    <div className="marketing-sidebar">
      <div className="marketing-logo">
        <div className="marketing-logo-icon">M</div>
        <div className="marketing-logo-text">Marketing</div>
      </div>

      <nav className="marketing-nav">
        <div
          className={`marketing-nav-item ${expandedItems.includes('dashboard') ? 'expanded' : ''}`}
          onClick={() => toggleExpanded('dashboard')}
        >
          <span>Dashboard</span>
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {expandedItems.includes('dashboard') && (
          <div className="marketing-submenu">
            <div className="marketing-submenu-item active">Marketing</div>
            <div className="marketing-submenu-item">Default</div>
            <div className="marketing-submenu-item">Dark Menu</div>
          </div>
        )}

        <div className="marketing-nav-item" onClick={() => window.location.href = '#cms'}>
          <span>CMS</span>
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>

        <div className="marketing-nav-item">
          <span>Pages</span>
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>

        <div className="marketing-nav-item">
          <span>Templates</span>
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>

        <div className="marketing-nav-item">
          <span>Media</span>
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>

        <div className="marketing-nav-item" onClick={() => window.location.href = '#users'}>
          <span>Users</span>
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>

        <div className="marketing-nav-item">
          <span>Settings</span>
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </nav>
    </div>
  );
}

function MarketingDashboard() {
  const chartData = [
    { country: 'Netherlands', value: 377, color: 'purple' },
    { country: 'Russia Spain', value: 431, color: 'yellow' },
    { country: 'South Korea', value: 428, color: 'lightgreen' },
    { country: 'Canada', value: 627, color: 'pink' },
    { country: 'India', value: 664, color: 'darkblue' },
    { country: 'UK', value: 968, color: 'darkblue' },
    { country: 'France', value: 1073, color: 'pink' },
    { country: 'Germany', value: 1167, color: 'purple' },
    { country: 'Japan', value: 1444, color: 'yellow' },
    { country: 'USA', value: 1788, color: 'lightgreen' },
    { country: 'China', value: 1797, color: 'darkblue' }
  ];

  const maxValue = Math.max(...chartData.map(d => d.value));

  return (
    <div>
      {/* Metrics Cards */}
      <div className="marketing-metrics-grid">
        <div className="marketing-metric-card">
          <div className="marketing-metric-header">
            <div className="marketing-metric-title">Revenue</div>
            <button className="marketing-metric-button">Today</button>
          </div>
          <div className="marketing-metric-value">$35,000</div>
          <div className="marketing-progress">
            <div className="marketing-progress-bar blue" style={{ width: '95%' }}></div>
          </div>
        </div>

        <div className="marketing-metric-card">
          <div className="marketing-metric-header">
            <div className="marketing-metric-title">Orders</div>
            <button className="marketing-metric-button">This Week</button>
          </div>
          <div className="marketing-metric-value">35,000</div>
          <div className="marketing-progress">
            <div className="marketing-progress-bar orange" style={{ width: '65%' }}></div>
          </div>
        </div>

        <div className="marketing-metric-card">
          <div className="marketing-metric-header">
            <div className="marketing-metric-title">Leads</div>
            <button className="marketing-metric-button">This Month</button>
          </div>
          <div className="marketing-metric-value">$50,000</div>
          <div className="marketing-progress">
            <div className="marketing-progress-bar green" style={{ width: '75%' }}></div>
          </div>
        </div>

        <div className="marketing-metric-card">
          <div className="marketing-metric-header">
            <div className="marketing-metric-title">Lead Conversion Rate</div>
            <button className="marketing-metric-button">Overall</button>
          </div>
          <div className="marketing-metric-value">50%</div>
          <div className="marketing-progress">
            <div className="marketing-progress-bar purple" style={{ width: '50%' }}></div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="marketing-content-grid">
        {/* Payment History Chart */}
        <div className="marketing-chart-card">
          <h3 className="marketing-chart-title">Payment History</h3>
          <div className="marketing-chart-container">
            {chartData.map((item, index) => (
              <div key={index} className="marketing-chart-bar">
                <div className="marketing-chart-bar-value">{item.value}</div>
                <div className="marketing-chart-bar-element" style={{ height: '200px' }}>
                  <div
                    className="marketing-chart-bar-fill"
                    style={{
                      height: `${(item.value / maxValue) * 100}%`,
                      background: item.color === 'purple' ? '#8b5cf6' :
                        item.color === 'yellow' ? '#f59e0b' :
                          item.color === 'lightgreen' ? '#10b981' :
                            item.color === 'pink' ? '#ec4899' :
                              item.color === 'darkblue' ? '#3b82f6' : '#6b7280'
                    }}
                  ></div>
                </div>
                <div className="marketing-chart-bar-label">{item.country}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Currency Converter */}
        <div className="marketing-converter-card">
          <h3 className="marketing-converter-title">1 United States Dollar Equals</h3>
          <div className="marketing-converter-rate">0.50 Euro</div>
          <div className="marketing-converter-date">24 Apr 6.00 am UTC Declaration</div>

          <input
            type="number"
            value="1"
            className="marketing-converter-input"
            readOnly
          />
          <select className="marketing-converter-select">
            <option>United States</option>
            <option>Euro</option>
            <option>British Pound</option>
            <option>Japanese Yen</option>
          </select>

          <input
            type="number"
            value="0.50"
            className="marketing-converter-input"
            readOnly
          />
          <select className="marketing-converter-select">
            <option>Euro</option>
            <option>United States</option>
            <option>British Pound</option>
            <option>Japanese Yen</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'cms' | 'users'>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Handle hash changes for navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'cms') {
        setActiveTab('cms');
      } else if (hash === 'users') {
        setActiveTab('users');
      } else {
        setActiveTab('dashboard');
      }
    };

    // Set initial tab based on hash
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <>
      <ArchitectTopbar />
      <div className="marketing-container" style={{ marginTop: 72 }}>
        <Background3D />
        {/* Mobile Toggle */}
        <button
          className="architect-mobile-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        {/* Sidebar */}
        <div className={`marketing-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <MarketingSidebar />
        </div>
        {/* Main Content */}
        <main className="marketing-main">
          {/* Header */}
          <div className="marketing-header">
            <h1 className="marketing-header-title">
              {activeTab === 'dashboard' ? 'Marketing Dashboard' :
                activeTab === 'cms' ? 'Content Management System' : 'User Management'}
            </h1>
            <p className="marketing-header-subtitle">
              {activeTab === 'dashboard' ? 'Monitor your marketing performance and analytics' :
                activeTab === 'cms' ? 'Create and manage your website content with powerful tools' :
                  'Manage user accounts, permissions and system access'}
            </p>
          </div>
          {/* Content */}
          {activeTab === 'dashboard' ? (
            <MarketingDashboard />
          ) : activeTab === 'cms' ? (
            <PageBuilder />
          ) : (
            <UserManagement />
          )}
        </main>
      </div>
    </>
  );
}
