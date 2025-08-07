export interface User {
    id: number;
    email: string;
    name: string;
    avatar?: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}

class AuthService {
    private readonly API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
    private readonly TOKEN_KEY = 'authToken';
    private readonly USER_KEY = 'user';

      // Login with email and password
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/auth/login`, {
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

      // Lưu token và user data
      this.setToken(data.token);
      this.setUser(data.user);

      return {
        user: data.user,
        token: data.token
      };
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error instanceof Error ? error.message : 'Đăng nhập thất bại. Vui lòng thử lại.');
    }
  }

    // Google OAuth login
    async loginWithGoogle(): Promise<AuthResponse> {
        try {
            // Redirect to Google OAuth
            const googleAuthUrl = `${this.API_BASE_URL}/auth/google`;
            window.location.href = googleAuthUrl;

            // This would typically be handled by a callback route
            throw new Error('Google OAuth not implemented in demo');
        } catch (error) {
            console.error('Google login error:', error);
            throw new Error('Đăng nhập Google thất bại.');
        }
    }

    // Facebook OAuth login
    async loginWithFacebook(): Promise<AuthResponse> {
        try {
            // Redirect to Facebook OAuth
            const facebookAuthUrl = `${this.API_BASE_URL}/auth/facebook`;
            window.location.href = facebookAuthUrl;

            // This would typically be handled by a callback route
            throw new Error('Facebook OAuth not implemented in demo');
        } catch (error) {
            console.error('Facebook login error:', error);
            throw new Error('Đăng nhập Facebook thất bại.');
        }
    }

    // Logout
    logout(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);

        // Optionally redirect to login page
        // window.location.href = '/login';
    }

    // Get current user
    getCurrentUser(): User | null {
        const userStr = localStorage.getItem(this.USER_KEY);
        if (!userStr) return null;

        try {
            return JSON.parse(userStr);
        } catch (error) {
            console.error('Error parsing user data:', error);
            return null;
        }
    }

    // Get auth token
    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    // Check if user is authenticated
    isAuthenticated(): boolean {
        const token = this.getToken();
        const user = this.getCurrentUser();
        return !!(token && user);
    }

    // Set token in localStorage
    private setToken(token: string): void {
        localStorage.setItem(this.TOKEN_KEY, token);
    }

    // Set user in localStorage
    private setUser(user: User): void {
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }

    // Refresh token (for token expiration)
    async refreshToken(): Promise<string> {
        try {
            const currentToken = this.getToken();
            if (!currentToken) {
                throw new Error('No token to refresh');
            }

            // Here you would typically make an API call to refresh the token
            // const response = await fetch(`${this.API_BASE_URL}/auth/refresh`, {
            //   method: 'POST',
            //   headers: {
            //     'Authorization': `Bearer ${currentToken}`,
            //   },
            // });
            // 
            // if (!response.ok) {
            //   throw new Error('Token refresh failed');
            // }
            // 
            // const { token } = await response.json();
            // this.setToken(token);
            // return token;

            // Mock refresh for demo
            const newToken = 'refreshed-jwt-token-' + Date.now();
            this.setToken(newToken);
            return newToken;
        } catch (error) {
            console.error('Token refresh error:', error);
            this.logout();
            throw new Error('Token refresh failed');
        }
    }

    // Validate token (check if it's still valid)
    async validateToken(): Promise<boolean> {
        try {
            const token = this.getToken();
            if (!token) return false;

            // Here you would typically make an API call to validate the token
            // const response = await fetch(`${this.API_BASE_URL}/auth/validate`, {
            //   method: 'GET',
            //   headers: {
            //     'Authorization': `Bearer ${token}`,
            //   },
            // });
            // 
            // return response.ok;

            // Mock validation for demo
            return true;
        } catch (error) {
            console.error('Token validation error:', error);
            return false;
        }
    }
}

// Export singleton instance
export const authService = new AuthService();
