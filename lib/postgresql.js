const { Pool } = require('pg');

// PostgreSQL connection pool
const pool = new Pool({
    user: process.env.POSTGRES_USER || 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    database: process.env.POSTGRES_DB || 'cms_auth',
    password: process.env.POSTGRES_PASSWORD || 'password',
    port: process.env.POSTGRES_PORT || 5432,
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000, // How long a client is allowed to remain idle
    connectionTimeoutMillis: 2000, // How long to wait for a connection
});

// Test database connection
pool.on('connect', () => {
    console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
    console.error('❌ PostgreSQL connection error:', err);
    process.exit(-1);
});

// Database utility functions
const db = {
    // Execute a query
    query: async (text, params) => {
        const start = Date.now();
        try {
            const res = await pool.query(text, params);
            const duration = Date.now() - start;
            console.log('🔍 Executed query', { text, duration, rows: res.rowCount });
            return res;
        } catch (error) {
            console.error('❌ Database query error:', error);
            throw error;
        }
    },

    // Get a client from the pool for transactions
    getClient: async () => {
        return await pool.connect();
    },

    // Close the pool
    end: async () => {
        await pool.end();
    }
};

// User-related database functions
const userQueries = {
    // Create user
    createUser: async (userData) => {
        const { name, email, password, role = 'user' } = userData;
        const query = `
      INSERT INTO users (name, email, password_hash, role, status, created_at, updated_at)
      VALUES ($1, $2, $3, $4, 'active', NOW(), NOW())
      RETURNING id, name, email, role, status, created_at
    `;
        const result = await db.query(query, [name, email, password, role]);
        return result.rows[0];
    },

    // Find user by email
    findUserByEmail: async (email) => {
        const query = 'SELECT * FROM users WHERE email = $1 AND status = $2';
        const result = await db.query(query, [email, 'active']);
        return result.rows[0];
    },

    // Find user by ID
    findUserById: async (id) => {
        const query = 'SELECT id, name, email, role, status, created_at, updated_at FROM users WHERE id = $1 AND status = $2';
        const result = await db.query(query, [id, 'active']);
        return result.rows[0];
    },

    // Update user
    updateUser: async (id, userData) => {
        const { name, email, role } = userData;
        const query = `
      UPDATE users 
      SET name = $1, email = $2, role = $3, updated_at = NOW()
      WHERE id = $4 AND status = 'active'
      RETURNING id, name, email, role, status, updated_at
    `;
        const result = await db.query(query, [name, email, role, id]);
        return result.rows[0];
    },

    // Get all users with pagination
    getAllUsers: async (page = 1, limit = 10) => {
        const offset = (page - 1) * limit;
        const query = `
      SELECT id, name, email, role, status, created_at, updated_at
      FROM users 
      WHERE status = 'active'
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `;
        const result = await db.query(query, [limit, offset]);

        // Get total count
        const countQuery = 'SELECT COUNT(*) as total FROM users WHERE status = $1';
        const countResult = await db.query(countQuery, ['active']);

        return {
            users: result.rows,
            total: parseInt(countResult.rows[0].total),
            page,
            limit,
            totalPages: Math.ceil(countResult.rows[0].total / limit)
        };
    },

    // Delete user (soft delete)
    deleteUser: async (id) => {
        const query = `
      UPDATE users 
      SET status = 'deleted', updated_at = NOW()
      WHERE id = $1
      RETURNING id
    `;
        const result = await db.query(query, [id]);
        return result.rows[0];
    }
};

// Page-related database functions
const pageQueries = {
    // Create page
    createPage: async (pageData) => {
        const { title, content, template_id, author_id, status = 'draft' } = pageData;
        const query = `
      INSERT INTO pages (title, content, template_id, author_id, status, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      RETURNING *
    `;
        const result = await db.query(query, [title, content, template_id, author_id, status]);
        return result.rows[0];
    },

    // Get all pages
    getAllPages: async (page = 1, limit = 10) => {
        const offset = (page - 1) * limit;
        const query = `
      SELECT p.*, u.name as author_name, t.name as template_name
      FROM pages p
      LEFT JOIN users u ON p.author_id = u.id
      LEFT JOIN templates t ON p.template_id = t.id
      ORDER BY p.updated_at DESC
      LIMIT $1 OFFSET $2
    `;
        const result = await db.query(query, [limit, offset]);

        const countQuery = 'SELECT COUNT(*) as total FROM pages';
        const countResult = await db.query(countQuery);

        return {
            pages: result.rows,
            total: parseInt(countResult.rows[0].total),
            page,
            limit,
            totalPages: Math.ceil(countResult.rows[0].total / limit)
        };
    },

    // Get page by ID
    getPageById: async (id) => {
        const query = `
      SELECT p.*, u.name as author_name, t.name as template_name
      FROM pages p
      LEFT JOIN users u ON p.author_id = u.id
      LEFT JOIN templates t ON p.template_id = t.id
      WHERE p.id = $1
    `;
        const result = await db.query(query, [id]);
        return result.rows[0];
    },

    // Update page
    updatePage: async (id, pageData) => {
        const { title, content, template_id, status } = pageData;
        const query = `
      UPDATE pages 
      SET title = $1, content = $2, template_id = $3, status = $4, updated_at = NOW()
      WHERE id = $5
      RETURNING *
    `;
        const result = await db.query(query, [title, content, template_id, status, id]);
        return result.rows[0];
    },

    // Delete page
    deletePage: async (id) => {
        const query = 'DELETE FROM pages WHERE id = $1 RETURNING id';
        const result = await db.query(query, [id]);
        return result.rows[0];
    }
};

// Template-related database functions
const templateQueries = {
    // Get all templates
    getAllTemplates: async () => {
        const query = `
      SELECT * FROM templates 
      ORDER BY category, name
    `;
        const result = await db.query(query);
        return result.rows;
    },

    // Get template by ID
    getTemplateById: async (id) => {
        const query = 'SELECT * FROM templates WHERE id = $1';
        const result = await db.query(query, [id]);
        return result.rows[0];
    },

    // Create template
    createTemplate: async (templateData) => {
        const { name, description, category, thumbnail, preview_url, content, tags } = templateData;
        const query = `
      INSERT INTO templates (name, description, category, thumbnail, preview_url, content, tags, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      RETURNING *
    `;
        const result = await db.query(query, [name, description, category, thumbnail, preview_url, content, JSON.stringify(tags)]);
        return result.rows[0];
    }
};

module.exports = {
    db,
    userQueries,
    pageQueries,
    templateQueries,
    pool
};
