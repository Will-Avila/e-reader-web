import getDb from '@/lib/db';
import EpubReader from '@/components/EpubReader';
import SettingsMenu from '@/components/SettingsMenu';
import Link from 'next/link';

export default async function ReaderPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const db = getDb();
    const stmt = db.prepare('SELECT * FROM books WHERE id = ?');
    const book = stmt.get(id) as any;

    if (!book) {
        return (
            <div className="h-screen flex items-center justify-center text-4xl">
                LIVRO NÃO ENCONTRADO
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col">
            <header className="h-14 border-b-4 border-current flex items-center justify-between px-4 z-50 shrink-0 bg-white dark:bg-black">
                <Link href="/" className="pixel-btn text-sm py-1">← VOLTAR</Link>
                <span className="truncate max-w-[40%] font-bold uppercase mx-4 text-center">{book.title}</span>
                <SettingsMenu />
            </header>
            <div className="flex-1 relative overflow-hidden">
                <EpubReader
                    url={book.filePath}
                    initialLocation={book.progressCfi}
                    bookId={book.id}
                />
            </div>
        </div>
    );
}
