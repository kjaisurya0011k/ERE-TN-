import React, { useState } from 'react';
import { Bot, Sparkles } from 'lucide-react';
import { NovaChatDrawer } from './NovaChatDrawer';
import { useLanguage } from '../../contexts/LanguageContext';

export const NovaFloatingButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useLanguage();

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 text-white shadow-[0_8px_30px_rgba(26,35,126,0.4)] hover:shadow-[0_12px_40px_rgba(26,35,126,0.6)] border border-blue-400/30 hover:scale-105 active:scale-95 transition-all duration-300"
          aria-label="Open NOVA AI Assistant"
        >
          {/* Animated Glow Ring */}
          <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 opacity-40 blur-sm group-hover:opacity-75 transition duration-500 group-hover:duration-200 animate-pulse" />

          {/* Icon */}
          <div className="relative w-7 h-7 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-white border border-white/20">
            <Bot className="w-4 h-4" />
          </div>

          {/* Label */}
          <div className="relative text-left pr-1">
            <div className="flex items-center gap-1">
              <span className="font-display text-xs font-black tracking-wide">NOVA AI</span>
              <Sparkles className="w-3 h-3 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <span className="text-[10px] text-blue-200 font-medium block leading-none">
              {language === 'ta' ? 'AI வழிகாட்டி' : language === 'hi' ? 'AI गाइड' : 'AI Guide'}
            </span>
          </div>
        </button>
      </div>

      {/* Chat Drawer */}
      <NovaChatDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};
export default NovaFloatingButton;
