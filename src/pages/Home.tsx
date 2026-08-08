import React from 'react';
import { ArrowRight, BarChart3, Code2, Palette, ShieldCheck, Sparkles, Star, Calendar, BookOpen, CheckCircle2, Award, Users, ChevronRight, Video, Zap } from 'lucide-react';
import { SERVICES, TESTIMONIALS } from '../data/initialData';
import { useApp } from '../context/AppContext';
import { CourseCard } from '../components/CourseCard';
import { ServiceCategory, Course } from '../types';

interface HomeProps {
  navigate: (route: string) => void;
  onSelectCourse: (course: Course) => void;
}

export const Home: React.FC<HomeProps> = ({ navigate, onSelectCourse }) => {
  const { openBookingModal, courses, handleEnrollCourse, enrollments, pageContent } = useApp();
  const homeContent = pageContent.home;

  const featuredCourses = courses.filter(c => c.featured).slice(0, 3);
  const enrolledCourseIds = enrollments.map(e => e.courseId);

  const getServiceIcon = (id: string) => {
    switch (id) {
      case 'data-science': return <BarChart3 className="w-6 h-6 text-amber-400" />;
      case 'coding': return <Code2 className="w-6 h-6 text-sky-400" />;
      case 'designing': return <Palette className="w-6 h-6 text-purple-400" />;
      case 'qa': return <ShieldCheck className="w-6 h-6 text-emerald-400" />;
      default: return <Sparkles className="w-6 h-6 text-amber-400" />;
    }
  };

  const getServiceRoute = (id: string) => {
    switch (id) {
      case 'data-science': return 'service-ds';
      case 'coding': return 'service-coding';
      case 'designing': return 'service-design';
      case 'qa': return 'service-qa';
      default: return 'services-overview';
    }
  };

  return (
    <div className="space-y-24 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
        
        {/* Background Ambient Lights */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute top-1/3 right-10 w-[300px] h-[200px] bg-sky-500/10 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-amber-400 text-xs font-semibold mb-6 shadow-xl animate-in fade-in slide-in-from-bottom-2">
            <Sparkles className="w-3.5 h-3.5 fill-amber-400" />
            <span>Integrated Consultations + Self-Paced LMS Academy</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.1] font-sans">
            {homeContent.heroTitle || 'Technical Training & Execution Without the Translation Tax'}
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            {homeContent.heroSubtitle || 'Master Data Science, Full-Stack Development, UI/UX Systems, and QA Automation through hands-on LMS courses and direct 1-on-1 strategy consultations.'}
          </p>

          {/* Action Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => openBookingModal()}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-extrabold text-base hover:from-amber-400 hover:to-amber-300 shadow-xl shadow-amber-500/20 hover:shadow-amber-500/30 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              <span>{homeContent.ctaText || 'Start a Conversation'}</span>
            </button>

            <button
              onClick={() => navigate('courses')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-bold text-base transition-all flex items-center justify-center gap-2 hover:border-slate-700"
            >
              <BookOpen className="w-5 h-5 text-amber-400" />
              <span>Explore Course Catalog</span>
            </button>
          </div>

          {/* Trust Highlights */}
          <div className="mt-16 pt-10 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-left max-w-4xl mx-auto">
            <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/50">
              <div className="text-amber-400 font-extrabold text-2xl">1-on-1</div>
              <div className="text-xs text-slate-400 mt-0.5">Zoom Strategy Consultation</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/50">
              <div className="text-sky-400 font-extrabold text-2xl">Google Cal</div>
              <div className="text-xs text-slate-400 mt-0.5">Automated Meeting Sync</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/50">
              <div className="text-purple-400 font-extrabold text-2xl">LMS Portal</div>
              <div className="text-xs text-slate-400 mt-0.5">Video Player & Progress</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/50">
              <div className="text-emerald-400 font-extrabold text-2xl">Certificates</div>
              <div className="text-xs text-slate-400 mt-0.5">Verified Capstone Credentials</div>
            </div>
          </div>

        </div>
      </section>

      {/* 4 CORE SERVICE CARDS SECTION (MAPPED FROM SPECIFICATION) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="text-xs font-bold text-amber-400 uppercase tracking-widest">Core Technical Capabilities</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Four Specialized Pillars of Excellence
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Select a service category to explore hands-on training, consultation roadmaps, and client case studies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card 1: Data Analytics & Data Science */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-amber-500/50 transition-all hover:shadow-2xl hover:shadow-amber-500/5 group flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-amber-400/10 border border-amber-400/30">
                  <BarChart3 className="w-6 h-6 text-amber-400" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-slate-950 text-amber-400 border border-amber-400/30">
                  {SERVICES['data-science'].tagline}
                </span>
              </div>

              <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
                {SERVICES['data-science'].title}
              </h3>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                {SERVICES['data-science'].description}
              </p>

              <ul className="mt-6 space-y-2 text-xs text-slate-400">
                {SERVICES['data-science'].features.map((f, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => navigate('service-ds')}
                className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors"
              >
                <span>Explore Data Science Page</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => openBookingModal('data-science')}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
              >
                Book Session
              </button>
            </div>
          </div>

          {/* Card 2: Development & Coding */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-sky-500/50 transition-all hover:shadow-2xl hover:shadow-sky-500/5 group flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-sky-400/10 border border-sky-400/30">
                  <Code2 className="w-6 h-6 text-sky-400" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-slate-950 text-sky-400 border border-sky-400/30">
                  {SERVICES['coding'].tagline}
                </span>
              </div>

              <h3 className="text-xl font-bold text-white group-hover:text-sky-400 transition-colors">
                {SERVICES['coding'].title}
              </h3>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                {SERVICES['coding'].description}
              </p>

              <ul className="mt-6 space-y-2 text-xs text-slate-400">
                {SERVICES['coding'].features.map((f, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => navigate('service-coding')}
                className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1.5 transition-colors"
              >
                <span>Explore Development Page</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => openBookingModal('coding')}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
              >
                Book Session
              </button>
            </div>
          </div>

          {/* Card 3: Design & UI/UX */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-purple-500/50 transition-all hover:shadow-2xl hover:shadow-purple-500/5 group flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-purple-400/10 border border-purple-400/30">
                  <Palette className="w-6 h-6 text-purple-400" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-slate-950 text-purple-400 border border-purple-400/30">
                  {SERVICES['designing'].tagline}
                </span>
              </div>

              <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">
                {SERVICES['designing'].title}
              </h3>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                {SERVICES['designing'].description}
              </p>

              <ul className="mt-6 space-y-2 text-xs text-slate-400">
                {SERVICES['designing'].features.map((f, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => navigate('service-design')}
                className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1.5 transition-colors"
              >
                <span>Explore Design Page</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => openBookingModal('design')}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
              >
                Book Session
              </button>
            </div>
          </div>

          {/* Card 4: Quality Assurance & Testing */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-emerald-500/50 transition-all hover:shadow-2xl hover:shadow-emerald-500/5 group flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-emerald-400/10 border border-emerald-400/30">
                  <ShieldCheck className="w-6 h-6 text-emerald-400" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-slate-950 text-emerald-400 border border-emerald-400/30">
                  {SERVICES['qa'].tagline}
                </span>
              </div>

              <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                {SERVICES['qa'].title}
              </h3>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                {SERVICES['qa'].description}
              </p>

              <ul className="mt-6 space-y-2 text-xs text-slate-400">
                {SERVICES['qa'].features.map((f, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => navigate('service-qa')}
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 transition-colors"
              >
                <span>Explore QA Testing Page</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => openBookingModal('qa')}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
              >
                Book Session
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* FEATURED COURSES CATALOG SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">Self-Paced LMS Academy</div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Featured Interactive Courses</h2>
          </div>
          <button
            onClick={() => navigate('courses')}
            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 shrink-0"
          >
            <span>View Full Catalog ({courses.length} Courses)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredCourses.map(course => (
            <CourseCard
              key={course.id}
              course={course}
              onSelect={onSelectCourse}
              onEnroll={(c) => {
                handleEnrollCourse(c);
                navigate('dashboard');
              }}
              isEnrolled={enrolledCourseIds.includes(course.id)}
            />
          ))}
        </div>
      </section>

      {/* CONSULTATION BANNER ("TALK IT THROUGH") */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl">
          
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-bold">
              <Calendar className="w-3.5 h-3.5" /> No Wrong Door
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Not sure which track fits your career goals?
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Share your current background, project context, or team challenges. We will review your goals and suggest a sensible starting point with a Zoom link synced directly to your Google Calendar.
            </p>

            <div className="pt-2">
              <button
                onClick={() => openBookingModal()}
                className="px-8 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-500/20 transition-all hover:scale-105 inline-flex items-center gap-2"
              >
                <span>Talk It Through</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Decorative graphic background */}
          <div className="absolute top-1/2 right-10 -translate-y-1/2 hidden lg:block opacity-20 pointer-events-none">
            <Sparkles className="w-72 h-72 text-amber-400" />
          </div>

        </div>
      </section>

      {/* STUDENT TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <div className="text-xs font-bold text-amber-400 uppercase tracking-widest">Student & Client Feedback</div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Proven Results Across Industry Tracks</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map(t => (
            <div key={t.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-300 italic leading-relaxed">
                  "{t.quote}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-3">
                <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover border border-slate-700" />
                <div>
                  <div className="font-bold text-xs text-white">{t.name}</div>
                  <div className="text-[11px] text-slate-400">{t.role} • {t.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
