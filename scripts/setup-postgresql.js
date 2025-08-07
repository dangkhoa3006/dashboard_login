const { Pool } = require('pg');
require('dotenv').config();

// PostgreSQL connection
const pool = new Pool({
    user: process.env.POSTGRES_USER || 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    database: 'postgres', // Connect to default database first
    password: process.env.POSTGRES_PASSWORD || 'password',
    port: process.env.POSTGRES_PORT || 5432,
});

async function setupDatabase() {
    console.log('🚀 Setting up PostgreSQL database...');

    try {
        // Create database if it doesn't exist
        const dbName = process.env.POSTGRES_DB || 'cms_auth';

        try {
            await pool.query(`CREATE DATABASE ${dbName}`);
            console.log(`✅ Database '${dbName}' created successfully`);
        } catch (error) {
            if (error.code === '42P04') {
                console.log(`ℹ️ Database '${dbName}' already exists`);
            } else {
                throw error;
            }
        }

        // Connect to the target database
        const targetPool = new Pool({
            user: process.env.POSTGRES_USER || 'postgres',
            host: process.env.POSTGRES_HOST || 'localhost',
            database: dbName,
            password: process.env.POSTGRES_PASSWORD || 'password',
            port: process.env.POSTGRES_PORT || 5432,
        });

        // Create tables
        console.log('📋 Creating tables...');

        // Users table
        await targetPool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('admin', 'editor', 'user')),
        status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'deleted')),
        avatar_url TEXT,
        last_login TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
        console.log('✅ Users table created');

        // Templates table
        await targetPool.query(`
      CREATE TABLE IF NOT EXISTS templates (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100) NOT NULL,
        thumbnail TEXT,
        preview_url TEXT,
        content TEXT,
        tags JSONB DEFAULT '[]',
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
        console.log('✅ Templates table created');

        // Pages table
        await targetPool.query(`
      CREATE TABLE IF NOT EXISTS pages (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE,
        content TEXT,
        template_id INTEGER REFERENCES templates(id) ON DELETE SET NULL,
        author_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
        meta_title VARCHAR(255),
        meta_description TEXT,
        meta_keywords TEXT,
        featured_image TEXT,
        published_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
        console.log('✅ Pages table created');

        // Media table
        await targetPool.query(`
      CREATE TABLE IF NOT EXISTS media (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) NOT NULL,
        original_name VARCHAR(255) NOT NULL,
        mime_type VARCHAR(100) NOT NULL,
        size INTEGER NOT NULL,
        url TEXT NOT NULL,
        alt_text VARCHAR(255),
        uploaded_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
        console.log('✅ Media table created');

        // Sessions table (for JWT token management)
        await targetPool.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        token_hash VARCHAR(255) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        ip_address INET,
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
        console.log('✅ Sessions table created');

        // Create indexes for better performance
        console.log('🔍 Creating indexes...');

        await targetPool.query('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
        await targetPool.query('CREATE INDEX IF NOT EXISTS idx_users_status ON users(status)');
        await targetPool.query('CREATE INDEX IF NOT EXISTS idx_pages_status ON pages(status)');
        await targetPool.query('CREATE INDEX IF NOT EXISTS idx_pages_author ON pages(author_id)');
        await targetPool.query('CREATE INDEX IF NOT EXISTS idx_pages_template ON pages(template_id)');
        await targetPool.query('CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug)');
        await targetPool.query('CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id)');
        await targetPool.query('CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token_hash)');

        console.log('✅ Indexes created');

        // Insert sample data
        console.log('📝 Inserting sample data...');

        // Sample admin user (password: admin123)
        const bcrypt = require('bcryptjs');
        const adminPassword = await bcrypt.hash('admin123', 10);

        await targetPool.query(`
      INSERT INTO users (name, email, password_hash, role, status)
      VALUES ('Admin User', 'admin@example.com', $1, 'admin', 'active')
      ON CONFLICT (email) DO NOTHING
    `, [adminPassword]);

        // Sample editor user (password: editor123)
        const editorPassword = await bcrypt.hash('editor123', 10);

        await targetPool.query(`
      INSERT INTO users (name, email, password_hash, role, status)
      VALUES ('Editor User', 'editor@example.com', $1, 'editor', 'active')
      ON CONFLICT (email) DO NOTHING
    `, [editorPassword]);

        // Sample templates
        const templates = [
            {
                name: 'Modern Landing Page',
                description: 'Clean and modern landing page with hero section and features',
                category: 'Landing Page',
                thumbnail: 'https://via.placeholder.com/300x200/3b82f6/ffffff?text=Landing+1',
                preview_url: 'https://via.placeholder.com/800x600/3b82f6/ffffff?text=Landing+Preview',
                content: `<h1>Welcome to Our Platform</h1><p>This is a modern landing page template with a clean design and professional layout.</p><h2>Key Features</h2><ul><li>Responsive design</li><li>Modern UI/UX</li><li>Fast loading</li><li>SEO optimized</li></ul>`,
                tags: ['modern', 'hero', 'features']
            },
            {
                name: 'Blog Template',
                description: 'Clean blog layout with sidebar and featured posts',
                category: 'Blog',
                thumbnail: 'https://via.placeholder.com/300x200/8b5cf6/ffffff?text=Blog+1',
                preview_url: 'https://via.placeholder.com/800x600/8b5cf6/ffffff?text=Blog+Preview',
                content: `<h1>Blog Post Title</h1><p><em>Published on ${new Date().toLocaleDateString()}</em></p><p>This is the introduction paragraph of your blog post.</p><h2>Main Content Section</h2><p>Here you can add your main content with detailed information.</p>`,
                tags: ['blog', 'sidebar', 'featured']
            },
            {
                name: 'Portfolio Grid',
                description: 'Grid-based portfolio with project showcases',
                category: 'Portfolio',
                thumbnail: 'https://via.placeholder.com/300x200/f59e0b/ffffff?text=Portfolio',
                preview_url: 'https://via.placeholder.com/800x600/f59e0b/ffffff?text=Portfolio+Preview',
                content: `<h1>Portfolio Showcase</h1><p>Welcome to my portfolio. Here you can see examples of my work and projects.</p><h2>Featured Projects</h2><h3>Project 1: Web Application</h3><p>Description of the first project including technologies used.</p>`,
                tags: ['portfolio', 'grid', 'projects']
            }
        ];

        for (const template of templates) {
            await targetPool.query(`
        INSERT INTO templates (name, description, category, thumbnail, preview_url, content, tags)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT DO NOTHING
      `, [
                template.name,
                template.description,
                template.category,
                template.thumbnail,
                template.preview_url,
                template.content,
                JSON.stringify(template.tags)
            ]);
        }

        console.log('✅ Sample data inserted');

        // Create triggers for updated_at
        await targetPool.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

        const tables = ['users', 'templates', 'pages'];
        for (const table of tables) {
            await targetPool.query(`
        DROP TRIGGER IF EXISTS update_${table}_updated_at ON ${table};
        CREATE TRIGGER update_${table}_updated_at
        BEFORE UPDATE ON ${table}
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
      `);
        }

        console.log('✅ Database triggers created');

        await targetPool.end();
        console.log('🎉 PostgreSQL database setup completed successfully!');

        console.log('\n📋 Database Info:');
        console.log(`Database: ${dbName}`);
        console.log('Admin User: admin@example.com / admin123');
        console.log('Editor User: editor@example.com / editor123');
        console.log('\n🚀 You can now start your application!');

    } catch (error) {
        console.error('❌ Error setting up database:', error);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

// Run setup
setupDatabase();
