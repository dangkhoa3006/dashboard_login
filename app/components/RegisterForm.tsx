'use client';

import { useState } from 'react';

interface RegisterFormProps {
  onRegister?: (userData: RegisterData) => void;
  onBackToLogin?: () => void;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterForm({ onRegister, onBackToLogin }: RegisterFormProps) {
  const [formData, setFormData] = useState<RegisterData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<RegisterData>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name as keyof RegisterData]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<RegisterData> = {};

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Tên là bắt buộc';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Tên phải có ít nhất 2 ký tự';
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Mật khẩu phải chứa chữ hoa, chữ thường và số';
    }

    // Validate confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu không khớp';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      if (onRegister) {
        await onRegister(formData);
      } else {
        // Default API call
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Đăng ký thất bại');
        }

        alert('Đăng ký thành công! Vui lòng đăng nhập.');
        if (onBackToLogin) {
          onBackToLogin();
        }
      }
    } catch (error) {
      console.error('Register failed:', error);
      alert(error instanceof Error ? error.message : 'Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative z-10 w-full max-w-md">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 transform hover:scale-105 transition-all duration-300 hover:shadow-purple-500/25 hover-3d">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg pulse-glow">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 gradient-text">Tạo tài khoản</h1>
          <p className="text-gray-300">Điền thông tin để đăng ký</p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Input */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
            <div className="relative">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Họ và tên"
                className={`w-full px-4 py-4 bg-white/10 border rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 backdrop-blur-sm ${
                  errors.name ? 'border-red-500 focus:ring-red-500' : 'border-white/20 focus:ring-green-500'
                }`}
                required
              />
              {errors.name && (
                <p className="text-red-400 text-sm mt-1">{errors.name}</p>
              )}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none"></div>
            </div>
          </div>

          {/* Email Input */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email của bạn"
                className={`w-full px-4 py-4 bg-white/10 border rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 backdrop-blur-sm ${
                  errors.email ? 'border-red-500 focus:ring-red-500' : 'border-white/20 focus:ring-green-500'
                }`}
                required
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">{errors.email}</p>
              )}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none"></div>
            </div>
          </div>

          {/* Password Input */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Mật khẩu"
                className={`w-full px-4 py-4 pr-12 bg-white/10 border rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 backdrop-blur-sm ${
                  errors.password ? 'border-red-500 focus:ring-red-500' : 'border-white/20 focus:ring-green-500'
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white transition-colors"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
              {errors.password && (
                <p className="text-red-400 text-sm mt-1">{errors.password}</p>
              )}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none"></div>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Xác nhận mật khẩu"
                className={`w-full px-4 py-4 pr-12 bg-white/10 border rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 backdrop-blur-sm ${
                  errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-white/20 focus:ring-green-500'
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white transition-colors"
              >
                {showConfirmPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
              {errors.confirmPassword && (
                <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>
              )}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none"></div>
            </div>
          </div>

          {/* Password Requirements */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <h3 className="text-white font-semibold mb-2">Yêu cầu mật khẩu:</h3>
            <ul className="text-gray-300 text-sm space-y-1">
              <li className={`flex items-center ${formData.password.length >= 6 ? 'text-green-400' : ''}`}>
                <span className="mr-2">•</span>
                Ít nhất 6 ký tự
              </li>
              <li className={`flex items-center ${/(?=.*[a-z])/.test(formData.password) ? 'text-green-400' : ''}`}>
                <span className="mr-2">•</span>
                Chứa chữ thường
              </li>
              <li className={`flex items-center ${/(?=.*[A-Z])/.test(formData.password) ? 'text-green-400' : ''}`}>
                <span className="mr-2">•</span>
                Chứa chữ hoa
              </li>
              <li className={`flex items-center ${/(?=.*\d)/.test(formData.password) ? 'text-green-400' : ''}`}>
                <span className="mr-2">•</span>
                Chứa số
              </li>
            </ul>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full relative group overflow-hidden rounded-xl bg-gradient-to-r from-green-500 to-blue-500 p-0.5 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-blue-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative bg-gradient-to-r from-green-500 to-blue-500 rounded-xl px-6 py-4 text-white font-semibold transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-green-600 group-hover:to-blue-600">
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Đang đăng ký...
                </div>
              ) : (
                'Đăng ký'
              )}
            </div>
          </button>
        </form>

        {/* Back to Login */}
        <div className="text-center mt-6">
          <p className="text-gray-300">
            Đã có tài khoản?{' '}
            <button
              onClick={onBackToLogin}
              className="text-green-300 hover:text-green-200 font-semibold transition-colors"
            >
              Đăng nhập ngay
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
