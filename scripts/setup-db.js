const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

// Tạo database file
const dbPath = path.join(__dirname, '..', 'data', 'auth.db');
const db = new sqlite3.Database(dbPath);

console.log('🚀 Đang tạo database...');

// Tạo bảng users
db.serialize(() => {
  // Tạo bảng users với schema mới
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      avatar TEXT,
      status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending', 'banned')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('❌ Lỗi tạo bảng users:', err);
    } else {
      console.log('✅ Bảng users đã được tạo');
    }
  });

  // Tạo bảng sessions (để lưu refresh tokens)
  db.run(`
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      refresh_token TEXT UNIQUE NOT NULL,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `, (err) => {
    if (err) {
      console.error('❌ Lỗi tạo bảng sessions:', err);
    } else {
      console.log('✅ Bảng sessions đã được tạo');
    }
  });

  // Thêm dữ liệu mẫu
  const sampleUsers = [
    {
      email: 'admin@example.com',
      password: 'admin123',
      name: 'Admin User',
      avatar: 'https://via.placeholder.com/150',
      status: 'active'
    },
    {
      email: 'user@example.com',
      password: 'user123',
      name: 'Regular User',
      avatar: 'https://via.placeholder.com/150',
      status: 'active'
    },
    {
      email: 'demo@example.com',
      password: 'demo123',
      name: 'Demo User',
      avatar: 'https://via.placeholder.com/150',
      status: 'active'
    },
    {
      email: 'pending@example.com',
      password: 'pending123',
      name: 'Pending User',
      avatar: 'https://via.placeholder.com/150',
      status: 'pending'
    }
  ];

  // Hash passwords và insert users
  sampleUsers.forEach((user, index) => {
    bcrypt.hash(user.password, 10, (err, hash) => {
      if (err) {
        console.error(`❌ Lỗi hash password cho user ${index + 1}:`, err);
        return;
      }

      db.run(`
        INSERT OR IGNORE INTO users (email, password, name, avatar, status)
        VALUES (?, ?, ?, ?, ?)
      `, [user.email, hash, user.name, user.avatar, user.status], function (err) {
        if (err) {
          console.error(`❌ Lỗi thêm user ${index + 1}:`, err);
        } else {
          if (this.changes > 0) {
            console.log(`✅ Đã thêm user: ${user.email} (${user.status})`);
          } else {
            console.log(`ℹ️ User ${user.email} đã tồn tại`);
          }
        }
      });
    });
  });
});

// Đóng database sau khi hoàn thành
setTimeout(() => {
  db.close((err) => {
    if (err) {
      console.error('❌ Lỗi đóng database:', err);
    } else {
      console.log('✅ Database đã được setup thành công!');
      console.log('\n📋 Thông tin đăng nhập mẫu:');
      console.log('Email: admin@example.com | Password: admin123 | Status: active');
      console.log('Email: user@example.com | Password: user123 | Status: active');
      console.log('Email: demo@example.com | Password: demo123 | Status: active');
      console.log('Email: pending@example.com | Password: pending123 | Status: pending');
      console.log('\n🗂️ Database file: data/auth.db');
      console.log('\n📊 Schema mới:');
      console.log('- id: INTEGER PRIMARY KEY AUTOINCREMENT');
      console.log('- email: TEXT UNIQUE NOT NULL');
      console.log('- password: TEXT NOT NULL');
      console.log('- name: TEXT NOT NULL');
      console.log('- avatar: TEXT');
      console.log('- status: TEXT DEFAULT "active"');
      console.log('- created_at: DATETIME DEFAULT CURRENT_TIMESTAMP');
      console.log('- updated_at: DATETIME DEFAULT CURRENT_TIMESTAMP');
    }
  });
}, 2000);
