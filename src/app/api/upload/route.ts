import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { writeFile, mkdir } from 'fs/promises';
import getDb from '@/lib/db';

export async function POST(request: NextRequest) {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
        return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename
    const filename = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '');
    const uploadDir = path.join(process.cwd(), 'public/uploads');

    // Ensure dir exists
    try {
        await mkdir(uploadDir, { recursive: true });
    } catch (e) { }

    const filePath = path.join(uploadDir, filename);

    try {
        await writeFile(filePath, buffer);

        // Get info from formData
        const title = data.get('title') as string || filename.replace(/\.epub$/i, '').replace(/[._-]/g, ' ');
        const author = data.get('author') as string || '';

        const db = getDb();

        // Ensure table has author column (simple migration check in-flight if we wanted, but let's assume migration script runs)
        // Or better, let's write a robust query that works or fails clearly.

        const stmt = db.prepare('INSERT INTO books (title, author, filePath) VALUES (?, ?, ?)');
        const info = stmt.run(title, author, `/uploads/${filename}`);

        return NextResponse.json({ success: true, id: info.lastInsertRowid });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: 'Upload failed' }, { status: 500 });
    }
}
