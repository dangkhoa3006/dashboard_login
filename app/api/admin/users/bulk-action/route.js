import { NextResponse } from 'next/server';
import { run, query } from '../../../../../lib/database';

// POST - Thực hiện hành động hàng loạt
export async function POST(request) {
  try {
    const { action, userIds, status } = await request.json();

    // Validate input
    if (!action || !userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { error: 'Action và danh sách user IDs là bắt buộc' },
        { status: 400 }
      );
    }

    const validActions = ['approve', 'reject', 'ban', 'activate', 'deactivate'];
    if (!validActions.includes(action)) {
      return NextResponse.json(
        { error: 'Action không hợp lệ' },
        { status: 400 }
      );
    }

    let statusToSet;
    let message;

    // Map action to status
    switch (action) {
      case 'approve':
        statusToSet = 'active';
        message = 'Duyệt thành công';
        break;
      case 'reject':
        statusToSet = 'inactive';
        message = 'Từ chối thành công';
        break;
      case 'ban':
        statusToSet = 'banned';
        message = 'Khóa tài khoản thành công';
        break;
      case 'activate':
        statusToSet = 'active';
        message = 'Kích hoạt thành công';
        break;
      case 'deactivate':
        statusToSet = 'inactive';
        message = 'Vô hiệu hóa thành công';
        break;
      default:
        statusToSet = status || 'pending';
        message = 'Cập nhật status thành công';
    }

    // Validate status
    const validStatuses = ['active', 'inactive', 'pending', 'banned'];
    if (!validStatuses.includes(statusToSet)) {
      return NextResponse.json(
        { error: 'Status không hợp lệ' },
        { status: 400 }
      );
    }

    // Tạo placeholders cho SQL query
    const placeholders = userIds.map(() => '?').join(',');
    
    // Cập nhật status cho tất cả users
    const result = await run(
      `UPDATE users SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id IN (${placeholders})`,
      [statusToSet, ...userIds]
    );

    // Lấy thông tin users đã cập nhật
    const updatedUsers = await query(
      `SELECT id, email, name, avatar, status, created_at, updated_at FROM users WHERE id IN (${placeholders})`,
      userIds
    );

    return NextResponse.json({
      success: true,
      message: `${message} ${result.changes} users`,
      updatedCount: result.changes,
      users: updatedUsers
    });

  } catch (error) {
    console.error('Bulk action error:', error);
    return NextResponse.json(
      { error: 'Lỗi server, vui lòng thử lại sau' },
      { status: 500 }
    );
  }
}

// DELETE - Xóa nhiều users cùng lúc
export async function DELETE(request) {
  try {
    const { userIds } = await request.json();

    // Validate input
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { error: 'Danh sách user IDs là bắt buộc' },
        { status: 400 }
      );
    }

    // Tạo placeholders cho SQL query
    const placeholders = userIds.map(() => '?').join(',');

    // Lấy thông tin users trước khi xóa
    const usersToDelete = await query(
      `SELECT id, email FROM users WHERE id IN (${placeholders})`,
      userIds
    );

    if (usersToDelete.length === 0) {
      return NextResponse.json(
        { error: 'Không tìm thấy users để xóa' },
        { status: 404 }
      );
    }

    // Xóa sessions của users trước
    await run(`DELETE FROM sessions WHERE user_id IN (${placeholders})`, userIds);

    // Xóa users
    const result = await run(`DELETE FROM users WHERE id IN (${placeholders})`, userIds);

    return NextResponse.json({
      success: true,
      message: `Đã xóa ${result.changes} users thành công`,
      deletedCount: result.changes,
      deletedUsers: usersToDelete
    });

  } catch (error) {
    console.error('Bulk delete error:', error);
    return NextResponse.json(
      { error: 'Lỗi server, vui lòng thử lại sau' },
      { status: 500 }
    );
  }
}
