import getDb from '@/lib/db';
import BookCard from '@/components/BookCard';
import ImportButton from '@/components/ImportButton';

interface Book {
  id: number;
  title: string;
  author: string | null;
  filePath: string;
  coverUrl: string | null;
}

export default function Home() {
  let books: Book[] = [];
  let error = null;

  try {
    const db = getDb();
    const stmt = db.prepare('SELECT * FROM books ORDER BY lastRead DESC');
    books = stmt.all() as Book[];
  } catch (e: any) {
    console.error(e);
    error = e.message;
  }

  if (error) {
    return (
      <main className="p-8">
        <h1 className="text-red-500 text-2xl font-bold">ERRO NO BANCO DE DADOS</h1>
        <pre className="bg-gray-100 dark:bg-gray-900 p-4 mt-4 pixel-border">{error}</pre>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-6xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b-4 border-current pb-4 gap-4">
        <div>
          <h1 className="text-5xl md:text-6xl mb-2 leading-none">PIXEL READER</h1>
          <p className="text-lg md:text-xl opacity-70">BIBLIOTECA EPUB MINIMALISTA</p>
        </div>
        <ImportButton />
      </header>

      {books.length === 0 ? (
        <div className="text-center py-20 pixel-border border-dashed opacity-50">
          <p className="text-2xl">BIBLIOTECA VAZIA</p>
          <p className="mt-2 text-sm">IMPORTE UM LIVRO PARA COMEÇAR A LER</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </main>
  );
}
