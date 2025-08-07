'use client';

import { useState } from 'react';

export default function LoginForm({ onLogin, onShowRegister }: { onLogin?: (credentials: { email: string; password: string }) => void; onShowRegister?: () => void; }) {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (onLogin) onLogin(formData);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-form-container">
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <svg width={32} height={32} fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#38bdf8', margin: '0 auto 0.5rem auto', display: 'block' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <div className="auth-title">Chào mừng trở lại</div>
                <div className="auth-desc">Đăng nhập để tiếp tục</div>
            </div>
            <form onSubmit={handleSubmit} autoComplete="off">
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
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', marginTop: '-0.5rem' }}>
                    <input type="checkbox" className="auth-checkbox" id="remember" />
                    <label htmlFor="remember" style={{ color: '#dbeafe', fontSize: '1rem', cursor: 'pointer' }}>Ghi nhớ đăng nhập</label>
                    <a className="auth-link" style={{ marginLeft: 'auto', fontSize: '0.95rem' }} href="#">Quên mật khẩu?</a>
                </div>
                <button className="auth-btn" type="submit" disabled={isLoading}>{isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}</button>
                <div className="auth-divider">hoặc</div>
                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                    <span style={{ color: '#dbeafe', fontSize: '1rem' }}>Chưa có tài khoản?</span>
                    <span className="auth-link" onClick={onShowRegister}> Đăng ký ngay</span>
                </div>
            </form>
        </div>
    );
}
