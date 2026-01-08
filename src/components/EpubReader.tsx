'use client';

import { ReactReader } from 'react-reader';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useReaderSettings } from '@/contexts/ReaderSettingsContext';

interface EpubReaderProps {
    url: string;
    initialLocation?: string;
    bookId: number;
}

const fontFamilyMap: Record<string, string> = {
    vt323: '"VT323", monospace',
    roboto: '"Roboto", sans-serif',
    merriweather: '"Merriweather", serif',
    opensans: '"Open Sans", sans-serif',
};

export default function EpubReader({ url, initialLocation, bookId }: EpubReaderProps) {
    const [location, setLocation] = useState<string | number>(initialLocation || 0);
    const [isMounted, setIsMounted] = useState(false);
    const { settings } = useReaderSettings();
    const renditionRef = useRef<any>(null);
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Debounced save progress
    const saveProgress = useCallback((cfi: string) => {
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }
        saveTimeoutRef.current = setTimeout(() => {
            fetch('/api/progress', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bookId, cfi }),
            }).catch(console.error);
        }, 1000);
    }, [bookId]);

    const locationChanged = (epubcifi: string | number) => {
        setLocation(epubcifi);
        if (typeof epubcifi === 'string') {
            saveProgress(epubcifi);
        }
    };

    // Function to inject styles directly into all content documents
    const updateBookStyles = useCallback((rendition: any) => {
        if (!rendition) return;

        try {
            // 1. Update basic theme overrides
            rendition.themes.fontSize(`${settings.fontSize}px`);
            rendition.themes.font(fontFamilyMap[settings.fontFamily] || fontFamilyMap.vt323);

            if (settings.darkMode) {
                rendition.themes.override('color', '#ffffff');
                rendition.themes.override('background', '#000000');
            } else {
                rendition.themes.override('color', '#000000');
                rendition.themes.override('background', '#ffffff');
            }

            // 2. Inject complex CSS via <style> tag
            const contents = rendition.getContents() as unknown as any[];
            if (contents && contents.forEach) {
                contents.forEach((content: any) => {
                    const doc = content.document;
                    if (!doc) return;

                    const styleId = 'pixel-reader-styles';
                    let styleEl = doc.getElementById(styleId);
                    if (!styleEl) {
                        styleEl = doc.createElement('style');
                        styleEl.id = styleId;
                        doc.head.appendChild(styleEl);
                    }

                    styleEl.textContent = `
            body {
              margin: 0 !important;
              max-width: 100% !important;
              overflow-x: hidden !important;
            }
            p, div, span, h1, h2, h3, h4, h5, h6, li, blockquote {
              line-height: ${settings.lineHeight || 1.4} !important;
              letter-spacing: ${settings.letterSpacing || 0}px !important;
            }
            img {
              max-width: 100% !important;
              height: auto !important;
            }
          `;
                });
            }
        } catch (e) {
            console.error('Error updating book styles:', e);
        }
    }, [settings]);

    // Apply settings to rendition when they change
    useEffect(() => {
        if (renditionRef.current) {
            updateBookStyles(renditionRef.current);
        }
    }, [settings, updateBookStyles]);

    const handleNext = () => {
        if (renditionRef.current) {
            renditionRef.current.next();
        }
    };

    const handlePrev = () => {
        if (renditionRef.current) {
            renditionRef.current.prev();
        }
    };

    if (!isMounted) {
        return (
            <div className="h-full flex items-center justify-center font-bold text-2xl animate-pulse">
                CARREGANDO...
            </div>
        );
    }

    return (
        <div className={`h-full w-full relative ${settings.darkMode ? 'bg-black' : 'bg-white'}`}>
            {/* Touch navigation overlay - 30% left, 70% right */}
            <div
                className="absolute inset-0 z-10 flex"
                style={{ pointerEvents: 'none' }}
            >
                {/* Left 30% - Previous page */}
                <div
                    onClick={handlePrev}
                    className="w-[30%] h-full cursor-pointer"
                    style={{ pointerEvents: 'auto' }}
                />
                {/* Right 70% - Next page */}
                <div
                    onClick={handleNext}
                    className="w-[70%] h-full cursor-pointer"
                    style={{ pointerEvents: 'auto' }}
                />
            </div>

            {/* ReactReader */}
            <div className="h-full w-full epub-container">
                <ReactReader
                    url={url}
                    location={location}
                    locationChanged={locationChanged}
                    showToc={false}
                    epubOptions={{
                        flow: 'paginated',
                        manager: 'default',
                        spread: settings.columns === 2 ? 'auto' : 'none',
                        // Force 100% width and height
                        width: '100%',
                        height: '100%',
                    }}
                    getRendition={(rendition) => {
                        renditionRef.current = rendition;

                        // Register hook to apply styles when new content loads
                        rendition.hooks.content.register((contents: any) => {
                            // We need to defer slightly to ensure the document is ready
                            setTimeout(() => {
                                updateBookStyles(rendition);
                            }, 100);
                        });

                        // Initial apply
                        updateBookStyles(rendition);
                    }}
                // Omit readerStyles as we are handling it via global CSS
                />
            </div>

            {/* Global overrides for this component */}
            <style jsx global>{`
        .epub-container div[style*="position: absolute"] {
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
        }
      `}</style>
        </div>
    );
}
