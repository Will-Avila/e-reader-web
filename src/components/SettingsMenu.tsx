'use client';

import { useState } from 'react';
import { useReaderSettings, FontFamily } from '@/contexts/ReaderSettingsContext';

const fontOptions: { value: FontFamily; label: string }[] = [
    { value: 'vt323', label: 'VT323 (Pixel)' },
    { value: 'roboto', label: 'Roboto' },
    { value: 'merriweather', label: 'Merriweather' },
    { value: 'opensans', label: 'Open Sans' },
];

export default function SettingsMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const { settings, setDarkMode, setColumns, setFontSize, setFontFamily, setLineHeight, setLetterSpacing, resetSettings } = useReaderSettings();

    return (
        <div className="relative" style={{ zIndex: 100 }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="pixel-btn text-sm py-1"
                aria-label="Configurações"
            >
                ⚙ MENU
            </button>

            {isOpen && (
                <div
                    className="absolute right-0 top-full mt-2 w-64 pixel-border p-4"
                    style={{
                        zIndex: 100,
                        backgroundColor: settings.darkMode ? '#000000' : '#ffffff',
                        color: settings.darkMode ? '#ffffff' : '#000000',
                    }}
                >
                    <h3 className="text-lg font-bold mb-4 border-b-2 pb-2" style={{ borderColor: 'currentColor' }}>
                        CONFIGURAÇÕES
                    </h3>

                    {/* Dark Mode */}
                    <div className="mb-4">
                        <div className="flex items-center justify-between">
                            <span>MODO ESCURO</span>
                            <button
                                type="button"
                                onClick={() => setDarkMode(!settings.darkMode)}
                                className="w-12 h-6 border-2 relative"
                                style={{
                                    borderColor: 'currentColor',
                                    backgroundColor: settings.darkMode ? (settings.darkMode ? '#fff' : '#000') : 'transparent'
                                }}
                            >
                                <span
                                    className="absolute top-0.5 w-4 h-4 border transition-all"
                                    style={{
                                        borderColor: 'currentColor',
                                        backgroundColor: settings.darkMode ? '#000' : '#fff',
                                        right: settings.darkMode ? '2px' : 'auto',
                                        left: settings.darkMode ? 'auto' : '2px',
                                    }}
                                />
                            </button>
                        </div>
                    </div>

                    {/* Columns */}
                    <div className="mb-4">
                        <span className="block mb-2">COLUNAS</span>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setColumns(1)}
                                className="flex-1 py-1 border-2"
                                style={{
                                    borderColor: 'currentColor',
                                    backgroundColor: settings.columns === 1 ? (settings.darkMode ? '#fff' : '#000') : 'transparent',
                                    color: settings.columns === 1 ? (settings.darkMode ? '#000' : '#fff') : 'inherit'
                                }}
                            >
                                1
                            </button>
                            <button
                                type="button"
                                onClick={() => setColumns(2)}
                                className="flex-1 py-1 border-2"
                                style={{
                                    borderColor: 'currentColor',
                                    backgroundColor: settings.columns === 2 ? (settings.darkMode ? '#fff' : '#000') : 'transparent',
                                    color: settings.columns === 2 ? (settings.darkMode ? '#000' : '#fff') : 'inherit'
                                }}
                            >
                                2
                            </button>
                        </div>
                    </div>

                    {/* Font Size */}
                    <div className="mb-4">
                        <span className="block mb-2">TAMANHO DA FONTE: {settings.fontSize}px</span>
                        <input
                            type="range"
                            min="12"
                            max="32"
                            value={settings.fontSize}
                            onChange={(e) => setFontSize(Number(e.target.value))}
                            className="w-full"
                        />
                    </div>

                    {/* Font Family */}
                    <div className="mb-4">
                        <span className="block mb-2">FONTE</span>
                        <select
                            value={settings.fontFamily}
                            onChange={(e) => setFontFamily(e.target.value as FontFamily)}
                            className="w-full p-2 border-2"
                            style={{
                                borderColor: 'currentColor',
                                backgroundColor: settings.darkMode ? '#000' : '#fff',
                                color: settings.darkMode ? '#fff' : '#000'
                            }}
                        >
                            {fontOptions.map((font) => (
                                <option key={font.value} value={font.value}>
                                    {font.label}
                                </option>
                            ))}
                        </select>
                    </div>


                    {/* Line Height */}
                    <div className="mb-4">
                        <span className="block mb-2">ALTURA DA LINHA: {settings.lineHeight || 1.4}</span>
                        <input
                            type="range"
                            min="1"
                            max="3"
                            step="0.1"
                            value={settings.lineHeight || 1.4}
                            onChange={(e) => setLineHeight(Number(e.target.value))}
                            className="w-full"
                        />
                    </div>

                    {/* Letter Spacing */}
                    <div className="mb-4">
                        <span className="block mb-2">ESPAÇAMENTO LETRAS: {settings.letterSpacing || 0}px</span>
                        <input
                            type="range"
                            min="-2"
                            max="10"
                            step="0.5"
                            value={settings.letterSpacing || 0}
                            onChange={(e) => setLetterSpacing(Number(e.target.value))}
                            className="w-full"
                        />
                    </div>

                    <button
                        type="button"
                        onClick={resetSettings}
                        className="w-full pixel-btn mt-4 mb-2 hover:bg-red-600 hover:text-white"
                        style={{
                            color: '#ff4444',
                            borderColor: '#ff4444',
                            boxShadow: '2px 2px 0px 0px #ff4444'
                        }}
                    >
                        RESETAR PADRÃO
                    </button>

                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="w-full pixel-btn mt-2"
                    >
                        FECHAR
                    </button>
                </div>
            )}
        </div>
    );
}
