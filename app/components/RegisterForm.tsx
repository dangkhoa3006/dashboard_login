'use client';

import { useState } from 'react';

interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterForm({ onRegister, onBackToLogin }: { onRegister?: (userData: RegisterData) => void; onBackToLogin?: () => void; }) {
  const [formData, setFormData] = useState<RegisterData>({ name: '', email: '', password: '', confirmPassword: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<RegisterData>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof RegisterData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<RegisterData> = {};
    if (!formData.name.trim()) newErrors.name = 'Tên là bắt buộc';
    else if (formData.name.trim().length < 2) newErrors.name = 'Tên phải có ít nhất 2 ký tự';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) newErrors.email = 'Email là bắt buộc';
    else if (!emailRegex.test(formData.email)) newErrors.email = 'Email không hợp lệ';
    if (!formData.password) newErrors.password = 'Mật khẩu là bắt buộc';
    else if (formData.password.length < 6) newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) newErrors.password = 'Mật khẩu phải chứa chữ hoa, chữ thường và số';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Mật khẩu không khớp';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      if (onRegister) await onRegister(formData);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <svg width={32} height={32} fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#38bdf8', margin: '0 auto 0.5rem auto', display: 'block' }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
        <div className="auth-title">Tạo tài khoản</div>
        <div className="auth-desc">Điền thông tin để đăng ký</div>
      </div>
      <form onSubmit={handleSubmit} autoComplete="off">
        <label className="auth-label" htmlFor="name">Họ và tên</label>
        <input
          className="auth-input"
          type="text"
          name="name"
          id="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Họ và tên"
          required
        />
        {errors.name && <div style={{ color: '#f87171', fontSize: '0.95rem', marginBottom: '0.5rem' }}>{errors.name}</div>}
        <label className="auth-label" htmlFor="email">Email của bạn</label>
        <input
          className="auth-input"
          type="email"
          name="email"
          id="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Email của bạn"
          required
        />
        {errors.email && <div style={{ color: '#f87171', fontSize: '0.95rem', marginBottom: '0.5rem' }}>{errors.email}</div>}
        <label className="auth-label" htmlFor="password">Mật khẩu</label>
        <div style={{ position: 'relative' }}>
          <input
            className="auth-input"
            type={showPassword ? 'text' : 'password'}
            name="password"
            id="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Mật khẩu"
            required
            style={{ paddingRight: 40 }}
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 10, top: 10, background: 'none', border: 'none', cursor: 'pointer', color: '#38bdf8' }}>
            {showPassword ? (
              <svg width={20} height={20} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
            ) : (
              <svg width={20} height={20} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
        {errors.password && <div style={{ color: '#f87171', fontSize: '0.95rem', marginBottom: '0.5rem' }}>{errors.password}</div>}
        <label className="auth-label" htmlFor="confirmPassword">Xác nhận mật khẩu</label>
        <div style={{ position: 'relative' }}>
          <input
            className="auth-input"
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Xác nhận mật khẩu"
            required
            style={{ paddingRight: 40 }}
          />
          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ position: 'absolute', right: 10, top: 10, background: 'none', border: 'none', cursor: 'pointer', color: '#38bdf8' }}>
            {showConfirmPassword ? (
              <svg width={20} height={20} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
            ) : (
              <svg width={20} height={20} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
        {errors.confirmPassword && <div style={{ color: '#f87171', fontSize: '0.95rem', marginBottom: '0.5rem' }}>{errors.confirmPassword}</div>}
        <button className="auth-btn" type="submit" disabled={isLoading}>{isLoading ? 'Đang đăng ký...' : 'Đăng ký'}</button>
        <div className="auth-divider">hoặc</div>
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <span style={{ color: '#dbeafe', fontSize: '1rem' }}>Đã có tài khoản?</span>
          <span className="auth-link" onClick={onBackToLogin}> Đăng nhập ngay</span>
        </div>
      </form>
    </div>
  );
}
