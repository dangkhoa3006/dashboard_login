import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { run, get } from '../../../../lib/database';

export async function POST(request) {
  try {
    const { email, password, name, status = 'pending' } = await request.json();

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password và name là bắt buộc' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email không hợp lệ' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password phải có ít nhất 6 ký tự' },
        { status: 400 }
      );
    }

    // Kiểm tra email đã tồn tại chưa
    const existingUser = await get(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email đã được sử dụng' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user mới
    const result = await run(
      'INSERT INTO users (email, password, name, avatar, status) VALUES (?, ?, ?, ?, ?)',
      [email, hashedPassword, name, 'https://via.placeholder.com/150', status]
    );

    if (result.changes === 0) {
      return NextResponse.json(
        { error: 'Không thể tạo user' },
        { status: 500 }
      );
    }

    // Lấy thông tin user vừa tạo
    const newUser = await get(
      'SELECT id, email, name, avatar, status, created_at FROM users WHERE id = ?',
      [result.id]
    );

    return NextResponse.json({
      success: true,
      message: 'Đăng ký thành công',
      user: newUser
    }, { status: 201 });

  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Lỗi server, vui lòng thử lại sau' },
      { status: 500 }
    );
  }
}
