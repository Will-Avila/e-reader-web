const Database = require('better-sqlite3');

const db = new Database('e-reader.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT,
    filePath TEXT NOT NULL,
    coverUrl TEXT,
    addedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    lastRead DATETIME DEFAULT CURRENT_TIMESTAMP,
    progressCfi TEXT
  )
`);

console.log('Database initialized.');
