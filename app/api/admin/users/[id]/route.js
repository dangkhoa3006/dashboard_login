import { NextResponse } from 'next/server';
import { get, run } from '../../../../../lib/database';

// GET - Lấy thông tin user theo ID
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    const user = await get(
      'SELECT id, email, name, avatar, status, created_at, updated_at FROM users WHERE id = ?',
      [id]
    );

    if (!user) {
      return NextResponse.json(
        { error: 'User không tồn tại' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Lỗi server, vui lòng thử lại sau' },
      { status: 500 }
    );
  }
}

// PUT - Cập nhật thông tin user
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { name, email, status, avatar } = await request.json();

    // Validate input
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name và email là bắt buộc' },
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

    // Validate status
    const validStatuses = ['active', 'inactive', 'pending', 'banned'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Status không hợp lệ' },
        { status: 400 }
      );
    }

    // Kiểm tra email đã tồn tại chưa (trừ user hiện tại)
    const existingUser = await get(
      'SELECT id FROM users WHERE email = ? AND id != ?',
      [email, id]
    );

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email đã được sử dụng bởi user khác' },
        { status: 409 }
      );
    }

    // Cập nhật user
    const result = await run(
      'UPDATE users SET name = ?, email = ?, status = ?, avatar = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [name, email, status || 'pending', avatar || 'https://via.placeholder.com/150', id]
    );

    if (result.changes === 0) {
      return NextResponse.json(
        { error: 'User không tồn tại hoặc không có thay đổi' },
        { status: 404 }
      );
    }

    // Lấy thông tin user đã cập nhật
    const updatedUser = await get(
      'SELECT id, email, name, avatar, status, created_at, updated_at FROM users WHERE id = ?',
      [id]
    );

    return NextResponse.json({
      success: true,
      message: 'Cập nhật user thành công',
      user: updatedUser
    });

  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { error: 'Lỗi server, vui lòng thử lại sau' },
      { status: 500 }
    );
  }
}

// DELETE - Xóa user
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    // Kiểm tra user có tồn tại không
    const existingUser = await get(
      'SELECT id, email FROM users WHERE id = ?',
      [id]
    );

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User không tồn tại' },
        { status: 404 }
      );
    }

    // Xóa sessions của user trước
    await run('DELETE FROM sessions WHERE user_id = ?', [id]);

    // Xóa user
    const result = await run('DELETE FROM users WHERE id = ?', [id]);

    if (result.changes === 0) {
      return NextResponse.json(
        { error: 'Không thể xóa user' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Đã xóa user ${existingUser.email} thành công`
    });

  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      { error: 'Lỗi server, vui lòng thử lại sau' },
      { status: 500 }
    );
  }
}
