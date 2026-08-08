import React, { useState } from 'react';
import { Sparkles, Menu, X, Calendar, BookOpen, GraduationCap, Code2, BarChart3, Palette, ShieldCheck, ChevronDown, User, Lock, LogOut, UserCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface HeaderProps {
  activeRoute: string;
  navigate: (route: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeRoute, navigate }) => {
  const { openBookingModal, enrollments, isStudentLoggedIn, currentUserName, openAuthModal, studentLogout, siteSettings } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);

  const activeEnrollmentsCount = enrollments.length;

  const isInstructorLoggedIn = typeof window !== 'undefined' && localStorage.getItem('shringaara_instructor_logged_in') === 'true';
  const instructorId = typeof window !== 'undefined' ? localStorage.getItem('shringaara_instructor_logged_id') : null;
  const instructorDisplayName = instructorId === 'ananya' ? 'Ananya' : instructorId === 'rohan' ? 'Rohan' : instructorId === 'maya' ? 'Maya' : instructorId === 'all' ? 'Admin' : 'Portal';

  const handleNav = (route: string) => {
    navigate(route);
    setMobileMenuOpen(false);
    setServicesDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0F172A]/90 backdrop-blur-md border-b border-slate-800 text-slate-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <button 
          onClick={() => handleNav('home')} 
          className="flex items-center gap-3 text-left group focus:outline-none"
        >
          {siteSettings.logoUrl ? (
            <img 
              src={siteSettings.logoUrl} 
              alt={siteSettings.siteName || "Logo"} 
              className="h-10 w-auto max-w-[240px] object-contain rounded-xl group-hover:scale-105 transition-transform"
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform shrink-0">
              <Sparkles className="w-5 h-5 fill-slate-950" />
            </div>
          )}
          <div>
            <span className="font-semibold text-lg tracking-tight text-white block group-hover:text-amber-400 transition-colors">
              {siteSettings.siteName || 'Shringaara Academy'}
            </span>
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-medium block">
              {siteSettings.tagline || 'Technical Excellence & Service'}
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {/* Services Dropdown */}
          <div className="relative" onMouseLeave={() => setServicesDropdownOpen(false)}>
            <button
              onClick={() => handleNav('services-overview')}
              onMouseEnter={() => setServicesDropdownOpen(true)}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                activeRoute.startsWith('service')
                  ? 'bg-slate-800 text-amber-400'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Services
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${servicesDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {servicesDropdownOpen && (
              <div 
                className="absolute top-full left-0 w-72 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 mt-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                onMouseEnter={() => setServicesDropdownOpen(true)}
              >
                <button
                  onClick={() => handleNav('service-ds')}
                  className="w-full text-left p-2.5 rounded-lg hover:bg-slate-800 flex items-start gap-3 transition-colors"
                >
                  <BarChart3 className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-white">Data Science & Analytics</div>
                    <div className="text-xs text-slate-400">Machine learning, SQL & Python</div>
                  </div>
                </button>

                <button
                  onClick={() => handleNav('service-coding')}
                  className="w-full text-left p-2.5 rounded-lg hover:bg-slate-800 flex items-start gap-3 transition-colors"
                >
                  <Code2 className="w-5 h-5 text-sky-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-white">Development & Coding</div>
                    <div className="text-xs text-slate-400">Full-stack, APIs & systems</div>
                  </div>
                </button>

                <button
                  onClick={() => handleNav('service-design')}
                  className="w-full text-left p-2.5 rounded-lg hover:bg-slate-800 flex items-start gap-3 transition-colors"
                >
                  <Palette className="w-5 h-5 text-purple-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-white">Design & UI/UX</div>
                    <div className="text-xs text-slate-400">Figma, systems & prototypes</div>
                  </div>
                </button>

                <button
                  onClick={() => handleNav('service-qa')}
                  className="w-full text-left p-2.5 rounded-lg hover:bg-slate-800 flex items-start gap-3 transition-colors"
                >
                  <ShieldCheck className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-white">Quality Assurance & QA</div>
                    <div className="text-xs text-slate-400">Automation, Playwright & testing</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => handleNav('work')}
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeRoute === 'work' ? 'bg-slate-800 text-amber-400' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Work
          </button>

          <button
            onClick={() => handleNav('about')}
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeRoute === 'about' ? 'bg-slate-800 text-amber-400' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            About
          </button>

          <button
            onClick={() => handleNav('process')}
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeRoute === 'process' ? 'bg-slate-800 text-amber-400' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Process
          </button>

          <button
            onClick={() => handleNav('courses')}
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              activeRoute === 'courses' ? 'bg-slate-800 text-amber-400' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            Courses
          </button>

          <button
            onClick={() => handleNav('instructor-portal')}
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              activeRoute === 'instructor-portal' ? 'bg-slate-800 text-amber-400' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>{isInstructorLoggedIn ? 'Instructor Portal' : 'Instructor Login'}</span>
          </button>

          <button
            onClick={() => handleNav('dashboard')}
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 relative ${
              activeRoute === 'dashboard' ? 'bg-slate-800 text-amber-400' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-sky-400" />
            <span>Student Portal</span>
            {!isStudentLoggedIn && <Lock className="w-3 h-3 text-amber-400 ml-0.5" />}
            {isStudentLoggedIn && activeEnrollmentsCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] flex items-center justify-center">
                {activeEnrollmentsCount}
              </span>
            )}
          </button>
        </nav>

        {/* Right CTA Button & Mobile Toggle */}
        <div className="flex items-center gap-2.5">
          {/* Student Auth CTA Button */}
          {isStudentLoggedIn ? (
            <div className="hidden xl:flex items-center gap-2">
              <button
                onClick={() => handleNav('dashboard')}
                className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-amber-400 hover:border-amber-400/40 flex items-center gap-2 transition-all"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                <span className="max-w-[120px] truncate">{currentUserName}</span>
              </button>
              <button
                onClick={studentLogout}
                title="Log Out Student"
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 transition-all"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => openAuthModal('login')}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-amber-400 hover:bg-slate-800 font-bold text-xs transition-all"
            >
              <User className="w-3.5 h-3.5" />
              <span>Student Login</span>
            </button>
          )}

          {/* Instructor Login CTA */}
          {isInstructorLoggedIn ? (
            <button
              onClick={() => handleNav('instructor-portal')}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-950/40 border border-purple-800/60 text-purple-300 hover:bg-purple-900/30 font-bold text-xs transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
              <span className="max-w-[120px] truncate">Instructor: {instructorDisplayName}</span>
            </button>
          ) : (
            <button
              onClick={() => handleNav('instructor-portal')}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-purple-900/40 text-purple-400 hover:bg-slate-800 font-bold text-xs transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>Instructor Login</span>
            </button>
          )}

          {/* Start a Conversation CTA Button */}
          <button
            onClick={() => openBookingModal()}
            className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-semibold text-xs hover:from-amber-400 hover:to-amber-300 shadow-md shadow-amber-500/20 hover:shadow-amber-500/30 transition-all hover:scale-[1.02] active:scale-95 shrink-0"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Consultation</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top duration-200">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 pt-2 pb-1">
            Services
          </div>
          <button
            onClick={() => handleNav('service-ds')}
            className="w-full text-left px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-800 text-sm flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4 text-amber-400" /> Data Science & Analytics
          </button>
          <button
            onClick={() => handleNav('service-coding')}
            className="w-full text-left px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-800 text-sm flex items-center gap-2"
          >
            <Code2 className="w-4 h-4 text-sky-400" /> Development & Coding
          </button>
          <button
            onClick={() => handleNav('service-design')}
            className="w-full text-left px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-800 text-sm flex items-center gap-2"
          >
            <Palette className="w-4 h-4 text-purple-400" /> Design & UI/UX
          </button>
          <button
            onClick={() => handleNav('service-qa')}
            className="w-full text-left px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-800 text-sm flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Quality Assurance & Testing
          </button>

          <div className="border-t border-slate-800 my-2 pt-2"></div>

          <button
            onClick={() => handleNav('work')}
            className="w-full text-left px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-800 text-sm"
          >
            Work Showcase
          </button>
          <button
            onClick={() => handleNav('about')}
            className="w-full text-left px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-800 text-sm"
          >
            About Shringaara
          </button>
          <button
            onClick={() => handleNav('process')}
            className="w-full text-left px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-800 text-sm"
          >
            Our Process
          </button>
          <button
            onClick={() => handleNav('courses')}
            className="w-full text-left px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-800 text-sm flex items-center justify-between"
          >
            <span className="flex items-center gap-2"><BookOpen className="w-4 h-4 text-amber-400" /> Courses Catalog</span>
          </button>
          <button
            onClick={() => handleNav('instructor-portal')}
            className="w-full text-left px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-800 text-sm flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" /> 
              {isInstructorLoggedIn ? 'Instructor Portal' : 'Instructor Login'}
            </span>
          </button>
          <button
            onClick={() => handleNav('dashboard')}
            className="w-full text-left px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-800 text-sm flex items-center justify-between"
          >
            <span className="flex items-center gap-2"><GraduationCap className="w-4 h-4 text-sky-400" /> Student Portal</span>
            {!isStudentLoggedIn ? (
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-amber-400 font-bold text-xs flex items-center gap-1">
                <Lock className="w-3 h-3" /> Login Required
              </span>
            ) : (
              activeEnrollmentsCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-bold text-xs">
                  {activeEnrollmentsCount} Enrolled
                </span>
              )
            )}
          </button>

          <div className="pt-3 space-y-2">
            {!isStudentLoggedIn ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal('login');
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-800 border border-slate-700 text-amber-400 font-bold text-sm"
              >
                <User className="w-4 h-4" />
                <span>Student Login / Register</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  studentLogout();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-rose-400 font-bold text-xs"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out Student ({currentUserName})</span>
              </button>
            )}

            {/* Mobile Instructor Portal Quick Link */}
            {isInstructorLoggedIn ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleNav('instructor-portal');
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-purple-950/40 border border-purple-800/60 text-purple-300 font-bold text-sm"
              >
                <ShieldCheck className="w-4 h-4 text-purple-400 animate-pulse" />
                <span>Instructor: {instructorDisplayName}</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleNav('instructor-portal');
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-800 border border-purple-900/30 text-purple-400 font-bold text-sm"
              >
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span>Instructor Login / Gateway</span>
              </button>
            )}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openBookingModal();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold text-sm shadow-md"
            >
              <Calendar className="w-4 h-4" />
              <span>Start Consultation</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
