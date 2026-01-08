import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'e-reader.db');

let _db: Database.Database | undefined;

export function getDb() {
    if (_db) return _db;

    // Use global for dev HMR
    const globalDb = global as unknown as { db: Database.Database };
    if (globalDb.db) {
        _db = globalDb.db;
        return _db!;
    }

    try {
        const newDb = new Database(dbPath);
        newDb.pragma('journal_mode = WAL');

        if (process.env.NODE_ENV !== 'production') {
            globalDb.db = newDb;
        }

        _db = newDb;
        return _db;
    } catch (e) {
        console.error("Failed to open DB:", e);
        throw e;
    }
}

export default getDb;
