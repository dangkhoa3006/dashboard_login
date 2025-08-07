import { NextResponse } from 'next/server';
import { get, query } from '../../../../lib/database';

export async function GET() {
  try {
    // Tổng số users
    const totalUsers = await get('SELECT COUNT(*) as count FROM users');
    
    // Số users theo status
    const usersByStatus = await query(`
      SELECT status, COUNT(*) as count 
      FROM users 
      GROUP BY status
    `);
    
    // Users mới trong 7 ngày qua
    const newUsersThisWeek = await get(`
      SELECT COUNT(*) as count 
      FROM users 
      WHERE created_at >= datetime('now', '-7 days')
    `);
    
    // Users mới trong 30 ngày qua
    const newUsersThisMonth = await get(`
      SELECT COUNT(*) as count 
      FROM users 
      WHERE created_at >= datetime('now', '-30 days')
    `);
    
    // Top 5 users mới nhất
    const latestUsers = await query(`
      SELECT id, email, name, status, created_at 
      FROM users 
      ORDER BY created_at DESC 
      LIMIT 5
    `);
    
    // Thống kê theo ngày (7 ngày qua)
    const dailyStats = await query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as count
      FROM users 
      WHERE created_at >= datetime('now', '-7 days')
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `);

    // Tổng số sessions đang hoạt động
    const activeSessions = await get(`
      SELECT COUNT(*) as count 
      FROM sessions 
      WHERE expires_at > datetime('now')
    `);

    const stats = {
      totalUsers: totalUsers.count,
      usersByStatus: usersByStatus.reduce((acc, item) => {
        acc[item.status] = item.count;
        return acc;
      }, {}),
      newUsersThisWeek: newUsersThisWeek.count,
      newUsersThisMonth: newUsersThisMonth.count,
      latestUsers,
      dailyStats,
      activeSessions: activeSessions.count
    };

    return NextResponse.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Get stats error:', error);
    return NextResponse.json(
      { error: 'Lỗi server, vui lòng thử lại sau' },
      { status: 500 }
    );
  }
}
