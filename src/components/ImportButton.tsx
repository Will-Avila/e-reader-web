'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ImportButton() {
    const [uploading, setUploading] = useState(false);
    const router = useRouter();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
            if (res.ok) {
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
        <div className="relative pixel-btn inline-block text-center select-none">
            <label className="cursor-pointer block w-full h-full">
                {uploading ? 'AGUARDE...' : 'IMPORTAR EPUB'}
                <input
                    type="file"
                    accept=".epub"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={uploading}
                />
            </label>
        </div>
    );
}
