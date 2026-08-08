import React from 'react';
import { ShieldCheck, Calendar, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface PrivacyProps {
  navigate: (route: string) => void;
}

export const Privacy: React.FC<PrivacyProps> = ({ navigate }) => {
  const { pageContent, siteSettings } = useApp();
  const privacy = pageContent.privacy;

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
            <ShieldCheck className="w-6 h-6" />
            <span className="text-xs font-bold uppercase tracking-widest">Legal & Transparency</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {privacy.title || 'Privacy Policy'}
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-3">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>Last Updated: {privacy.lastUpdated || 'August 7, 2026'}</span>
            <span>•</span>
            <span>{siteSettings.siteName || 'Shringaara Academy'}</span>
          </div>
        </div>

        {/* Main Body */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-8 space-y-6 text-slate-300 leading-relaxed text-sm whitespace-pre-wrap">
          {privacy.content}
        </div>

        {/* Support Banner */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Questions about our privacy practices?</h3>
            <p className="text-xs text-slate-400">Our data protection team is available to assist you.</p>
          </div>
          <a
            href={`mailto:${siteSettings.contactEmail}`}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-semibold border border-slate-700 transition-colors shrink-0"
          >
            Contact Privacy Officer
          </a>
        </div>

      </div>
    </div>
  );
};
