import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { templateQueries, userQueries } from '../../../../lib/postgresql';

// GET /api/cms/templates - Get all templates
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

        // Get templates
        const templates = await templateQueries.getAllTemplates();

        // Parse tags JSON for each template
        const templatesWithParsedTags = templates.map(template => ({
            ...template,
            tags: typeof template.tags === 'string' ? JSON.parse(template.tags) : template.tags
        }));

        return NextResponse.json({
            templates: templatesWithParsedTags
        });

    } catch (error) {
        console.error('Get templates error:', error);

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

// POST /api/cms/templates - Create new template
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

        // Check if user has permission to create templates (admin only)
        if (user.role !== 'admin') {
            return NextResponse.json(
                { error: 'Insufficient permissions' },
                { status: 403 }
            );
        }

        const {
            name,
            description,
            category,
            thumbnail,
            preview_url,
            content,
            tags = []
        } = await request.json();

        // Validation
        if (!name || !category || !content) {
            return NextResponse.json(
                { error: 'Name, category, and content are required' },
                { status: 400 }
            );
        }

        // Create template
        const newTemplate = await templateQueries.createTemplate({
            name,
            description,
            category,
            thumbnail,
            preview_url,
            content,
            tags
        });

        return NextResponse.json({
            message: 'Template created successfully',
            template: {
                ...newTemplate,
                tags: typeof newTemplate.tags === 'string' ? JSON.parse(newTemplate.tags) : newTemplate.tags
            }
        }, { status: 201 });

    } catch (error) {
        console.error('Create template error:', error);

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
