import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { get } from '../../../../lib/database';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email và password là bắt buộc' },
        { status: 400 }
      );
    }

    // Tìm user trong database
    const user = await get(
      'SELECT id, email, password, name, avatar, status FROM users WHERE email = ?',
      [email]
    );

    if (!user) {
      return NextResponse.json(
        { error: 'Email hoặc password không đúng' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Email hoặc password không đúng' },
        { status: 401 }
      );
    }

    // Kiểm tra status của user
    if (user.status === 'banned') {
      return NextResponse.json(
        { error: 'Tài khoản đã bị khóa' },
        { status: 403 }
      );
    }

    if (user.status === 'pending') {
      return NextResponse.json(
        { error: 'Tài khoản đang chờ xác thực. Vui lòng liên hệ admin.' },
        { status: 403 }
      );
    }

    if (user.status === 'inactive') {
      return NextResponse.json(
        { error: 'Tài khoản đã bị vô hiệu hóa' },
        { status: 403 }
      );
    }

    // Tạo JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Tạo refresh token
    const refreshToken = jwt.sign(
      {
        userId: user.id,
        type: 'refresh'
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Lưu refresh token vào database
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

    await get('INSERT INTO sessions (user_id, refresh_token, expires_at) VALUES (?, ?, ?)', [
      user.id,
      refreshToken,
      expiresAt.toISOString()
    ]);

    // Return user data (không bao gồm password)
    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      status: user.status
    };

    return NextResponse.json({
      success: true,
      user: userData,
      token,
      refreshToken
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Lỗi server, vui lòng thử lại sau' },
      { status: 500 }
    );
  }
}
