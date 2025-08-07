'use client';

import { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Background3D from './components/Background3D';
import { authService, User } from './services/authService';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [showRegister, setShowRegister] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const userData = authService.getCurrentUser();
    if (userData) {
      setUser(userData);
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogin = async (credentials: { email: string; password: string }) => {
    setError(null);
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      setIsAuthenticated(true);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleRegister = async (userData: { name: string; email: string; password: string; confirmPassword: string }) => {
    setError(null);
    if (userData.password !== userData.confirmPassword) {
      setError('Mật khẩu không khớp');
      return;
    }
    try {
      await authService.register({ name: userData.name, email: userData.email, password: userData.password });
      setShowRegister(false);
      setError('Đăng ký thành công! Vui lòng đăng nhập.');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Background3D />
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center mb-8">
          <h1 className="gradient-text3d text-4xl md:text-6xl font-bold" style={{ marginBottom: '0.5rem' }}>
            Galaxy Auth
          </h1>
          <p className="text-xl" style={{ color: '#dbeafe', maxWidth: 600, margin: '0 auto' }}>
            Hệ thống xác thực với giao diện vũ trụ tuyệt đẹp
          </p>
        </div>
        <div style={{ width: '100%', maxWidth: 400 }}>
          {error && <div style={{ color: '#f87171', background: '#fff0', textAlign: 'center', marginBottom: 16 }}>{error}</div>}
          {isAuthenticated && user ? (
            <div className="auth-form-container" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, color: '#38bdf8', fontWeight: 'bold', marginBottom: 8 }}>Xin chào, {user.name}!</div>
              <div style={{ color: '#dbeafe', marginBottom: 16 }}>{user.email}</div>
              <button className="auth-btn" onClick={handleLogout}>Đăng xuất</button>
            </div>
          ) : showRegister ? (
            <RegisterForm
              onRegister={handleRegister}
              onBackToLogin={() => { setShowRegister(false); setError(null); }}
            />
          ) : (
            <LoginForm
              onLogin={handleLogin}
              onShowRegister={() => { setShowRegister(true); setError(null); }}
            />
          )}
        </div>
        <div className="auth-footer">
          © 2024 Galaxy Auth System. Được tạo với Khoa và Next.js
        </div>
      </div>
    </div>
  );
}
