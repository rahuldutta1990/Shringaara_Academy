import React, { useState } from 'react';
import { SERVICES } from '../data/initialData';
import { useApp } from '../context/AppContext';
import { CourseCard } from '../components/CourseCard';
import { ServiceCategory, Course } from '../types';
import { Calendar, CheckCircle2, ChevronDown, ChevronUp, Sparkles, ArrowRight, BookOpen, BarChart3, Code2, Palette, ShieldCheck } from 'lucide-react';

interface ServiceDetailProps {
  category: ServiceCategory;
  navigate: (route: string) => void;
  onSelectCourse: (course: Course) => void;
}

export const ServiceDetail: React.FC<ServiceDetailProps> = ({ category, navigate, onSelectCourse }) => {
  const { openBookingModal, courses, handleEnrollCourse, enrollments } = useApp();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const service = SERVICES[category] || SERVICES['data-science'];
  const categoryCourses = courses.filter(c => c.category === category);
  const enrolledCourseIds = enrollments.map(e => e.courseId);

  const getServiceIcon = () => {
    switch (category) {
      case 'data-science': return <BarChart3 className="w-8 h-8 text-amber-400" />;
      case 'coding': return <Code2 className="w-8 h-8 text-sky-400" />;
      case 'designing': return <Palette className="w-8 h-8 text-purple-400" />;
      case 'qa': return <ShieldCheck className="w-8 h-8 text-emerald-400" />;
    }
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* Service Hero Header */}
      <section className="bg-slate-900 border-b border-slate-800 pt-12 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-4 max-w-3xl">
              
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  {getServiceIcon()}
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
                  {service.tagline}
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                {service.title}
              </h1>

              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                {service.heroHeadline}. {service.description}
              </p>

            </div>

            {/* Quick Action Button */}
            <div className="shrink-0 w-full md:w-auto">
              <button
                onClick={() => openBookingModal(category)}
                className="w-full md:w-auto px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/10 transition-all hover:scale-105"
              >
                <Calendar className="w-4 h-4" />
                <span>Book 1-on-1 Consultation</span>
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* Capabilities & Learning Outcomes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Technical Capabilities */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" /> Key Technical Capabilities
            </h3>
            <ul className="space-y-3 text-sm text-slate-300">
              {service.capabilities.map((cap, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{cap}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Practical Outcomes */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-sky-400" /> Career & Business Outcomes
            </h3>
            <ul className="space-y-3 text-sm text-slate-300">
              {service.outcomes.map((out, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-sky-400 shrink-0 mt-2"></span>
                  <span>{out}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </section>

      {/* Category Courses Catalog */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="text-xs font-bold text-amber-400 uppercase tracking-widest">Self-Paced Learning Track</div>
            <h2 className="text-2xl font-extrabold text-white mt-0.5">Courses in {service.title}</h2>
          </div>
          <button
            onClick={() => navigate('courses')}
            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            <span>All Courses</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {categoryCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categoryCourses.map(course => (
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
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400 text-sm">
            No specific courses listed in this category yet. Check back soon or book a custom 1-on-1 consultation!
          </div>
        )}
      </section>

      {/* Category FAQs */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-extrabold text-white">Frequently Asked Questions</h2>
          <p className="text-slate-400 text-xs sm:text-sm">Everything you need to know about our {service.title} training & services.</p>
        </div>

        <div className="space-y-3">
          {service.faqs.map((faq, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden transition-colors">
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                className="w-full p-4 text-left font-semibold text-sm text-white flex items-center justify-between gap-4 hover:bg-slate-800/50"
              >
                <span>{faq.question}</span>
                {openFaqIndex === idx ? <ChevronUp className="w-4 h-4 text-amber-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
              </button>
              {openFaqIndex === idx && (
                <div className="px-4 pb-4 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
