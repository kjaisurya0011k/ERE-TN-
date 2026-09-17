import React, { useState, useRef, useEffect } from 'react';
import { useTranslation, Language } from '../../contexts/LanguageContext';

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages: { code: Language; label: string; nativeName: string; flag: string }[] = [
    { code: 'en', label: 'English', nativeName: 'English', flag: '🇬🇧' },
    { code: 'ta', label: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
    { code: 'hi', label: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  ];

  const current = languages.find((l) => l.code === language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-surface-variant/80 bg-surface hover:bg-surface-container text-on-surface-variant hover:text-primary transition-all text-xs font-semibold"
        aria-label="Select Language"
      >
        <span>{current.flag}</span>
        <span className="hidden sm:inline">{current.nativeName}</span>
        <span className="material-symbols-outlined text-[16px]">expand_more</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 rounded-xl bg-surface-container-lowest shadow-[0px_10px_30px_rgba(26,35,126,0.15)] border border-surface-variant py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1 text-[11px] font-bold text-outline uppercase tracking-wider">
            {t('common.selectLanguage', 'Select Language')}
          </div>
          {languages.map((item) => (
            <button
              key={item.code}
              onClick={() => {
                setLanguage(item.code);
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors ${
                language === item.code
                  ? 'bg-primary-fixed text-primary font-bold'
                  : 'text-on-surface hover:bg-surface-container'
              }`}
            >
              <div className="flex items-center gap-2">
                <span>{item.flag}</span>
                <span>{item.nativeName}</span>
              </div>
              <span className="text-[10px] text-outline">{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
