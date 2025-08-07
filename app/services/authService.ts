export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
    avatar_url?: string;
}

export const authService = {
    login: async (credentials: { email: string; password: string }) => {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Đăng nhập thất bại');
            }

            // Lưu token vào localStorage
            if (data.token) {
                localStorage.setItem('authToken', data.token);
            }

            // Lưu user info
            localStorage.setItem('currentUser', JSON.stringify(data.user));

            return data;
        } catch (error: any) {
            throw new Error(error.message || 'Đăng nhập thất bại');
        }
    },

    register: async (data: { name: string; email: string; password: string }) => {
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...data,
                    confirmPassword: data.password
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Đăng ký thất bại');
            }

            return result;
        } catch (error: any) {
            throw new Error(error.message || 'Đăng ký thất bại');
        }
    },

    getCurrentUser: (): User | null => {
        try {
            const user = localStorage.getItem('currentUser');
            return user ? JSON.parse(user) : null;
        } catch {
            return null;
        }
    },

    getAuthToken: (): string | null => {
        return localStorage.getItem('authToken');
    },

    logout: () => {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('authToken');
    },

    // Kiểm tra xem user có đăng nhập không
    isAuthenticated: (): boolean => {
        return !!localStorage.getItem('authToken');
    }
};
