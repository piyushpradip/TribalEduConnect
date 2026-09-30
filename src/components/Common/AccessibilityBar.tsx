import React, { useState, useEffect } from 'react';
import { Eye, Type, Globe, Check, AlertCircle } from 'lucide-react';
import { useLanguage, Language } from '../../context/LanguageContext';

export const AccessibilityBar: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [textSize, setTextSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [highContrast, setHighContrast] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  useEffect(() => {
    // Handle text size
    document.body.classList.remove('text-scale-sm', 'text-scale-lg');
    if (textSize === 'sm') document.body.classList.add('text-scale-sm');
    if (textSize === 'lg') document.body.classList.add('text-scale-lg');
  }, [textSize]);

  useEffect(() => {
    // Handle high contrast
    if (highContrast) {
      document.body.classList.add('contrast-high');
    } else {
      document.body.classList.remove('contrast-high');
    }
  }, [highContrast]);

  const languages: { code: Language; label: string; script: string }[] = [
    { code: 'en', label: 'English', script: 'National' },
    { code: 'hi', label: 'हिन्दी', script: 'Devanagari' },
    { code: 'sat', label: 'ᱥᱟᱱᱛᱟᱲᱤ', script: 'Ol Chiki' },
    { code: 'or', label: 'ଓଡ଼ିଆ', script: 'Odia' },
  ];

  return (
    <div className="bg-[#120542] text-slate-200 border-b border-indigo-950/60 text-xs px-3 sm:px-6 py-1 select-none">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Left: Skip Link + Prototype Label */}
        <div className="flex items-center gap-3">
          <a 
            href="#main-content" 
            className="sr-only focus:not-sr-only focus:px-2 focus:py-1 focus:bg-amber-400 focus:text-slate-950 font-bold rounded"
          >
            Skip to main content
          </a>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
            <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold uppercase tracking-wider text-[10px]">
              SIH 2026 Prototype
            </span>
            <span className="hidden md:inline text-slate-400 text-[11px]">
              &bull; Ministry of Tribal Affairs (MoTA) Scholarship &amp; Fellowship Framework
            </span>
          </div>
        </div>

        {/* Right: Accessibility Controls (Text Size + Contrast + Language) */}
        <div className="flex items-center gap-3 sm:gap-4 ml-auto text-[11px]">
          {/* Text Size: A- | A | A+ */}
          <div className="flex items-center gap-1 bg-slate-900/60 border border-slate-700/60 rounded px-1.5 py-0.5" role="group" aria-label="Text Size Controls">
            <span className="text-slate-400 font-semibold mr-1 flex items-center gap-0.5">
              <Type className="w-3 h-3 text-slate-400" />
            </span>
            <button
              onClick={() => setTextSize('sm')}
              className={`px-1.5 py-0.5 rounded font-bold transition-colors ${textSize === 'sm' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-700 text-slate-300'}`}
              title="Decrease Font Size"
              aria-label="Decrease Font Size"
            >
              A-
            </button>
            <button
              onClick={() => setTextSize('base')}
              className={`px-1.5 py-0.5 rounded font-bold transition-colors ${textSize === 'base' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-700 text-slate-300'}`}
              title="Default Font Size"
              aria-label="Default Font Size"
            >
              A
            </button>
            <button
              onClick={() => setTextSize('lg')}
              className={`px-1.5 py-0.5 rounded font-bold transition-colors ${textSize === 'lg' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-700 text-slate-300'}`}
              title="Increase Font Size"
              aria-label="Increase Font Size"
            >
              A+
            </button>
          </div>

          {/* High Contrast Mode Toggle */}
          <button
            onClick={() => setHighContrast(!highContrast)}
            className={`flex items-center gap-1 px-2 py-0.5 rounded border transition-colors ${
              highContrast 
                ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold' 
                : 'bg-slate-900/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
            }`}
            title="Toggle High Contrast Display"
            aria-pressed={highContrast}
          >
            <Eye className="w-3 h-3" />
            <span className="hidden sm:inline font-semibold">
              {highContrast ? 'Normal' : 'High Contrast'}
            </span>
          </button>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-1 px-2 py-0.5 bg-slate-900/60 hover:bg-slate-800 border border-slate-700/60 rounded text-slate-200 transition-colors"
              title="Select Language"
              aria-expanded={showLangMenu}
            >
              <Globe className="w-3 h-3 text-cyan-400" />
              <span className="font-bold uppercase text-[10px]">{language}</span>
            </button>

            {showLangMenu && (
              <div 
                className="absolute right-0 mt-1 w-44 bg-white text-slate-900 rounded-lg shadow-xl border border-slate-200 py-1 z-50 animate-in fade-in"
                role="menu"
              >
                <div className="px-3 py-1 border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Select Language / भाषा
                </div>
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLanguage(l.code);
                      setShowLangMenu(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                      language === l.code ? 'font-bold text-indigo-900 bg-indigo-50/70' : 'text-slate-700'
                    }`}
                    role="menuitem"
                  >
                    <span>{l.label}</span>
                    <span className="text-[10px] text-slate-400">{l.script}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
