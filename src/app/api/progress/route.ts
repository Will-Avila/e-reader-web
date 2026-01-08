import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';

export async function POST(request: NextRequest) {
    try {
        const { bookId, cfi } = await request.json();

        if (!bookId || cfi === undefined) {
            return NextResponse.json({ success: false, message: 'ID do livro e CFI são obrigatórios' }, { status: 400 });
        }

        const db = getDb();
        const stmt = db.prepare('UPDATE books SET progressCfi = ?, lastRead = CURRENT_TIMESTAMP WHERE id = ?');
        stmt.run(cfi, bookId);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: 'Erro ao salvar progresso' }, { status: 500 });
    }
}
