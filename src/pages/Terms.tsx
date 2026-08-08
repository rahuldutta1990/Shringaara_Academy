import React from 'react';
import { FileText, Calendar, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface TermsProps {
  navigate: (route: string) => void;
}

export const Terms: React.FC<TermsProps> = ({ navigate }) => {
  const { pageContent, siteSettings } = useApp();
  const terms = pageContent.terms;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Navigation back */}
        <button
          onClick={() => navigate('home')}
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        {/* Page Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="flex items-center gap-3 text-amber-400 mb-2">
            <FileText className="w-6 h-6" />
            <span className="text-xs font-bold uppercase tracking-widest">User Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {terms.title || 'Terms of Service'}
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-3">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>Last Updated: {terms.lastUpdated || 'August 7, 2026'}</span>
            <span>•</span>
            <span>{siteSettings.siteName || 'Shringaara Academy'}</span>
          </div>
        </div>

        {/* Main Body */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-8 space-y-6 text-slate-300 leading-relaxed text-sm whitespace-pre-wrap">
          {terms.content}
        </div>

      </div>
    </div>
  );
};
