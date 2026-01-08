'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type FontFamily = 'vt323' | 'roboto' | 'merriweather' | 'opensans';

interface ReaderSettings {
    darkMode: boolean;
    columns: 1 | 2;
    fontSize: number;
    fontFamily: FontFamily;
    lineHeight: number;
    letterSpacing: number;
}

interface ReaderSettingsContextType {
    settings: ReaderSettings;
    setDarkMode: (value: boolean) => void;
    setColumns: (value: 1 | 2) => void;
    setFontSize: (value: number) => void;
    setFontFamily: (value: FontFamily) => void;
    setLineHeight: (value: number) => void;
    setLetterSpacing: (value: number) => void;
    resetSettings: () => void;
}

const defaultSettings: ReaderSettings = {
    darkMode: false,
    columns: 1,
    fontSize: 18,
    fontFamily: 'vt323',
    lineHeight: 1.4,
    letterSpacing: 0,
};

const ReaderSettingsContext = createContext<ReaderSettingsContextType | undefined>(undefined);

export function ReaderSettingsProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState<ReaderSettings>(defaultSettings);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem('readerSettings');
        if (stored) {
            try {
                setSettings(JSON.parse(stored));
            } catch (e) { }
        }
        setIsLoaded(true);
    }, []);

    // Save to localStorage on change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('readerSettings', JSON.stringify(settings));
        }
    }, [settings, isLoaded]);

    // Apply dark mode to document
    useEffect(() => {
        if (settings.darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [settings.darkMode]);

    const setDarkMode = (value: boolean) => setSettings(s => ({ ...s, darkMode: value }));
    const setColumns = (value: 1 | 2) => setSettings(s => ({ ...s, columns: value }));
    const setFontSize = (value: number) => setSettings(s => ({ ...s, fontSize: value }));
    const setFontFamily = (value: FontFamily) => setSettings(s => ({ ...s, fontFamily: value }));
    const setLineHeight = (value: number) => setSettings(s => ({ ...s, lineHeight: value }));
    const setLetterSpacing = (value: number) => setSettings(s => ({ ...s, letterSpacing: value }));
    const resetSettings = () => setSettings(defaultSettings);

    return (
        <ReaderSettingsContext.Provider value={{
            settings,
            setDarkMode,
            setColumns,
            setFontSize,
            setFontFamily,
            setLineHeight,
            setLetterSpacing,
            resetSettings
        }}>
            {children}
        </ReaderSettingsContext.Provider>
    );
}

export function useReaderSettings() {
    const context = useContext(ReaderSettingsContext);
    if (!context) {
        throw new Error('useReaderSettings must be used within a ReaderSettingsProvider');
    }
    return context;
}
