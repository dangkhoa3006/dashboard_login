import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { pageQueries, userQueries } from '../../../../lib/postgresql';

// GET /api/cms/pages - Get all pages
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

        // Get user to check permissions
        const user = await userQueries.findUserById(decoded.userId);
        if (!user || user.status !== 'active') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Get pagination parameters
        const url = new URL(request.url);
        const page = parseInt(url.searchParams.get('page') || '1');
        const limit = parseInt(url.searchParams.get('limit') || '10');

        // Get pages
        const result = await pageQueries.getAllPages(page, limit);

        return NextResponse.json(result);

    } catch (error) {
        console.error('Get pages error:', error);

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

// POST /api/cms/pages - Create new page
export async function POST(request: NextRequest) {
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

        // Get user to check permissions
        const user = await userQueries.findUserById(decoded.userId);
        if (!user || user.status !== 'active') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Check if user has permission to create pages (admin or editor)
        if (!['admin', 'editor'].includes(user.role)) {
            return NextResponse.json(
                { error: 'Insufficient permissions' },
                { status: 403 }
            );
        }

        const { title, content, template_id, status = 'draft' } = await request.json();

        // Validation
        if (!title || !content) {
            return NextResponse.json(
                { error: 'Title and content are required' },
                { status: 400 }
            );
        }

        // Create page
        const newPage = await pageQueries.createPage({
            title,
            content,
            template_id: template_id || null,
            author_id: user.id,
            status
        });

        return NextResponse.json({
            message: 'Page created successfully',
            page: newPage
        }, { status: 201 });

    } catch (error) {
        console.error('Create page error:', error);

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
