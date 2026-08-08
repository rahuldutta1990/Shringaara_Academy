import React from 'react';
import { Sparkles, ShieldCheck, Award, Users, Target, Compass, BookOpen } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const About: React.FC = () => {
  const { pageContent, siteSettings } = useApp();
  const about = pageContent.about;

  return (
    <div className="space-y-20 pb-16 pt-8">
      
      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-amber-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" /> About {siteSettings.siteName || 'Shringaara Academy'}
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          {about.title || 'Built With Care, Not Jargon'}
        </h1>
        <p className="text-slate-300 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
          {about.subtitle || 'We bridge the gap between high-level engineering and practical execution. Deliver clarity at every step.'}
        </p>
      </section>

      {/* Mission & Vision Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-8 space-y-3 relative overflow-hidden">
            <div className="flex items-center gap-3 text-amber-400 mb-1">
              <Target className="w-6 h-6" />
              <h3 className="text-xl font-bold text-white">Our Mission</h3>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              {about.missionText || 'Our mission is to empower professionals and organizations with sharp technical skills, zero fluff, and direct access to expert guidance.'}
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-8 space-y-3 relative overflow-hidden">
            <div className="flex items-center gap-3 text-sky-400 mb-1">
              <Compass className="w-6 h-6" />
              <h3 className="text-xl font-bold text-white">Our Vision</h3>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              {about.visionText || 'To build a global community of confident engineers, data analysts, designers, and QA specialists who build high-impact digital products.'}
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Block */}
      {about.storyText && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest">
            <BookOpen className="w-4 h-4" />
            <span>Our Origin Story</span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            {about.storyText}
          </p>
        </section>
      )}

      {/* Philosophy Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Clarity over Jargon</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              We translate abstract algorithms into intuitive mental models and clean, maintainable code structures.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-400/10 border border-sky-400/30 flex items-center justify-center text-sky-400 font-bold">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">1-on-1 Guidance</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every learner gets access to direct video strategy consultations with automated Google Calendar synchronization.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-400/10 border border-purple-400/30 flex items-center justify-center text-purple-400 font-bold">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Portfolio Proof</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              No multiple-choice trivia. Every module ends with a live, deployed project and verified completion certificate.
            </p>
          </div>

        </div>
      </section>

      {/* Leadership Team */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <div className="text-xs font-bold text-amber-400 uppercase tracking-widest">Industry Expertise</div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Meet Our Lead Instructors</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-3">
            <img 
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300" 
              alt="Dr. Ananya Sharma"
              className="w-24 h-24 rounded-full object-cover mx-auto border-2 border-amber-400"
            />
            <div>
              <h3 className="font-bold text-white text-base">Dr. Ananya Sharma</h3>
              <p className="text-xs text-amber-400">Head of Data Science & Analytics</p>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ex-Google Lead Data Scientist with 12+ years building enterprise analytics infrastructure and predictive machine learning models.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-3">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300" 
              alt="Rohan Mehta"
              className="w-24 h-24 rounded-full object-cover mx-auto border-2 border-sky-400"
            />
            <div>
              <h3 className="font-bold text-white text-base">Rohan Mehta</h3>
              <p className="text-xs text-sky-400">Principal Full-Stack Architect</p>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Software lead specializing in React, TypeScript, microservices, and distributed API systems with sub-100ms response targets.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-3">
            <img 
              src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300" 
              alt="Maya Lin"
              className="w-24 h-24 rounded-full object-cover mx-auto border-2 border-purple-400"
            />
            <div>
              <h3 className="font-bold text-white text-base">Maya Lin</h3>
              <p className="text-xs text-purple-400">Staff UI/UX & Design Systems Lead</p>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Product designer with awards across consumer apps, Figma component kits, and accessible multi-brand design tokens.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};
