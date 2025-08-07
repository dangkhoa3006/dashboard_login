import { NextResponse } from 'next/server';
import { query } from '../../../../lib/database';

export async function GET() {
    try {
        // Lấy tất cả users (không bao gồm password)
        const users = await query(`
      SELECT id, email, name, avatar, status, created_at, updated_at 
      FROM users 
      ORDER BY created_at DESC
    `);

        return NextResponse.json({
            success: true,
            users
        });

    } catch (error) {
        console.error('Get users error:', error);
        return NextResponse.json(
            { error: 'Lỗi server, vui lòng thử lại sau' },
            { status: 500 }
        );
    }
}
