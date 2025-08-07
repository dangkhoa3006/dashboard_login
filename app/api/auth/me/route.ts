import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { userQueries } from '../../../../lib/postgresql';

export async function GET(request: NextRequest) {
    try {
        const token = request.headers.get('authorization')?.replace('Bearer ', '');

        if (!token) {
            return NextResponse.json(
                { error: 'No token provided' },
                { status: 401 }
            );
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;

        // Get user from database
        const user = await userQueries.findUserById(decoded.userId);
        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        if (user.status !== 'active') {
            return NextResponse.json(
                { error: 'Account is not active' },
                { status: 401 }
            );
        }

        return NextResponse.json({
            user
        });

    } catch (error) {
        console.error('Auth verification error:', error);

        if (error instanceof jwt.JsonWebTokenError) {
            return NextResponse.json(
                { error: 'Invalid token' },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
