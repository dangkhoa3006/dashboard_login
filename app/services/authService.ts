export interface User {
    name: string;
    email: string;
}

export const authService = {
    login: async (credentials: { email: string; password: string }) => {
        // Giả lập API call
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find((u: any) => u.email === credentials.email && u.password === credentials.password);
        if (!user) throw new Error('Email hoặc mật khẩu không đúng');
        localStorage.setItem('currentUser', JSON.stringify({ name: user.name, email: user.email }));
        return { user: { name: user.name, email: user.email } };
    },
    register: async (data: { name: string; email: string; password: string }) => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.find((u: any) => u.email === data.email)) throw new Error('Email đã tồn tại');
        users.push(data);
        localStorage.setItem('users', JSON.stringify(users));
        return { user: { name: data.name, email: data.email } };
    },
    getCurrentUser: () => {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    },
    logout: () => {
        localStorage.removeItem('currentUser');
    },
};
