'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ImportButton() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const router = useRouter();

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
            // Auto-fill title from filename if empty
            if (!title) {
                const filename = e.target.files[0].name.replace(/\.epub$/i, '').replace(/[._-]/g, ' ');
                setTitle(filename);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile || !title) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('title', title);
        formData.append('author', author);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
            if (res.ok) {
                setIsModalOpen(false);
                setTitle('');
                setAuthor('');
                setSelectedFile(null);
                router.refresh();
            } else {
                alert('Falha no upload');
            }
        } catch (err) {
            console.error(err);
            alert('Erro ao fazer upload');
        } finally {
            setUploading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="pixel-btn"
            >
                IMPORTAR EPUB
            </button>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    {/* Force white background and black text always */}
                    <div className="bg-white text-black p-6 pixel-border w-full max-w-md m-4 shadow-xl">
                        <h2 className="text-xl font-bold mb-4">IMPORTAR LIVRO</h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold mb-1">ARQUIVO EPUB</label>
                                <input
                                    type="file"
                                    accept=".epub"
                                    onChange={handleFileSelect}
                                    className="w-full text-sm border-2 border-black p-2 file:mr-4 file:py-2 file:px-4 file:border-2 file:border-black file:bg-white file:text-black file:font-bold hover:file:bg-black hover:file:text-white cursor-pointer"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-1">NOME DO LIVRO</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full bg-white text-black border-2 border-black p-2 placeholder-gray-500"
                                    placeholder="Digite o título..."
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-1">AUTOR</label>
                                <input
                                    type="text"
                                    value={author}
                                    onChange={(e) => setAuthor(e.target.value)}
                                    className="w-full bg-white text-black border-2 border-black p-2 placeholder-gray-500"
                                    placeholder="Digite o autor..."
                                />
                            </div>

                            <div className="flex gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 pixel-btn border-black text-black hover:bg-black hover:text-white"
                                    disabled={uploading}
                                >
                                    CANCELAR
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 pixel-btn font-bold bg-black text-white hover:bg-gray-800"
                                    disabled={uploading}
                                >
                                    {uploading ? 'ENVIANDO...' : 'IMPORTAR'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
