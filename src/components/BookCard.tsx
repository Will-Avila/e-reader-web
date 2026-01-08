import Link from 'next/link';

interface Book {
    id: number;
    title: string;
    author?: string | null;
    filePath: string;
}

export default function BookCard({ book }: { book: Book }) {
    return (
        <Link href={`/reader/${book.id}`} className="block group">
            <div className="pixel-border p-4 h-full flex flex-col justify-between group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors duration-0">
                <div className="h-48 bg-gray-100 dark:bg-gray-900 mb-4 flex items-center justify-center pixel-border group-hover:border-white dark:group-hover:border-black border-dashed">
                    <span className="text-2xl">📖</span>
                </div>
                <div>
                    <h3 className="text-lg font-bold line-clamp-2 leading-none mb-2 uppercase">{book.title}</h3>
                    <p className="text-xs opacity-70 truncate">{book.author || 'AUTOR DESCONHECIDO'}</p>
                </div>
            </div>
        </Link>
    );
}
