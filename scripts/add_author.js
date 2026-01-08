const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'e-reader.db');
const db = new Database(dbPath);

console.log('Running migration...');

try {
  // Check if logic exists first? No, just try add column.
  const info = db.prepare('PRAGMA table_info(books)').all();
  const hasAuthor = info.some(col => col.name === 'author');
  
  if (!hasAuthor) {
      db.exec('ALTER TABLE books ADD COLUMN author TEXT');
      console.log('Column "author" added successfully.');
  } else {
      console.log('Column "author" already exists.');
  }

} catch (e) {
  console.error('Migration failed:', e);
}
