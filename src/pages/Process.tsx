import React from 'react';
import { Calendar, Video, BookOpen, Award, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Process: React.FC = () => {
  const { openBookingModal } = useApp();

  const STEPS = [
    {
      num: '01',
      title: 'Discover & Schedule Consultation',
      icon: <Calendar className="w-6 h-6 text-amber-400" />,
      desc: 'Pick a date and 60-minute time slot. You will receive an instant Zoom meeting link and a direct sync link to your Google Calendar.',
      badge: 'Step 1: Calendar Sync'
    },
    {
      num: '02',
      title: 'Tailored Technical Roadmap',
      icon: <Video className="w-6 h-6 text-sky-400" />,
      desc: 'During the 1-on-1 Zoom session, we analyze your goals, codebases, or project specs to design a custom learning or execution roadmap.',
      badge: 'Step 2: Strategy Call'
    },
    {
      num: '03',
      title: 'Hands-On LMS Execution',
      icon: <BookOpen className="w-6 h-6 text-purple-400" />,
      desc: 'Access your student learning portal with HD video lessons, downloadable code templates, lesson progress bars, and personal study notes.',
      badge: 'Step 3: Self-Paced LMS'
    },
    {
      num: '04',
      title: 'Capstone Review & Certificate',
      icon: <Award className="w-6 h-6 text-emerald-400" />,
      desc: 'Submit your live deployed capstone project. Upon 100% completion, download your official verified Shringaara Academy Certificate.',
      badge: 'Step 4: Certified Mastery'
    }
  ];

  return (
    <div className="space-y-16 pb-16 pt-8">
      
      {/* Header */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-amber-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" /> Structured Learning & Consultation Flow
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Our 4-Step Method to Technical Mastery
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
          How we take you from initial consultation to production-ready implementation and verified capstone certification.
        </p>
      </section>

      {/* Steps List */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-6">
          {STEPS.map((s, idx) => (
            <div 
              key={idx}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start gap-6 hover:border-slate-700 transition-all"
            >
              <div className="flex items-center gap-4 shrink-0">
                <div className="text-3xl font-black font-mono text-slate-700">
                  {s.num}
                </div>
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  {s.icon}
                </div>
              </div>

              <div className="space-y-2 flex-1">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-950 text-amber-400 border border-amber-400/20">
                  {s.badge}
                </span>
                <h3 className="text-xl font-bold text-white">{s.title}</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-950 border border-amber-500/30 rounded-2xl p-8 text-center space-y-4">
          <h3 className="text-2xl font-bold text-white">Ready to Start Step 1?</h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Book your 1-on-1 strategy consultation. Zoom URL and Google Calendar sync link will be generated instantly.
          </p>
          <button
            onClick={() => openBookingModal()}
            className="px-8 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-sm shadow-xl inline-flex items-center gap-2 transition-all hover:scale-105"
          >
            <Calendar className="w-4 h-4" />
            <span>Start a Conversation</span>
          </button>
        </div>
      </section>

    </div>
  );
};
