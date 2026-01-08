'use client';

import { ReactNode } from 'react';
import { ReaderSettingsProvider } from '@/contexts/ReaderSettingsContext';

export default function Providers({ children }: { children: ReactNode }) {
    return (
        <ReaderSettingsProvider>
            {children}
        </ReaderSettingsProvider>
    );
}
