import React, { useState } from 'react';
import { Course } from '../types';
import { useApp } from '../context/AppContext';
import { StudentReviews } from '../components/StudentReviews';
import { CourseQAForum } from '../components/CourseQAForum';
import { Star, Clock, GraduationCap, CheckCircle2, Play, ChevronDown, ChevronUp, User, Award, ArrowLeft, Lock } from 'lucide-react';

interface CourseDetailProps {
  course: Course;
  onBack: () => void;
  navigate: (route: string) => void;
}

export const CourseDetail: React.FC<CourseDetailProps> = ({ course, onBack, navigate }) => {
  const { enrollments, isStudentLoggedIn, openAuthModal, openPaymentModal } = useApp();
  const [openModuleId, setOpenModuleId] = useState<string>(course.curriculum[0]?.id || '');

  const isEnrolled = enrollments.some(e => e.courseId === course.id);

  const totalLessons = course.curriculum.reduce((acc, mod) => acc + mod.lessons.length, 0);

  const handleEnroll = () => {
    if (!isStudentLoggedIn) {
      openAuthModal('login');
      return;
    }

    if (isEnrolled) {
      navigate('dashboard');
    } else {
      openPaymentModal(course);
    }
  };

  return (
    <div className="space-y-12 pb-16 pt-6">
      
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={onBack}
          className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Catalog
        </button>
      </div>

      {/* Hero Banner */}
      <section className="bg-slate-900 border-y border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-400/10 border border-amber-400/30 text-amber-400">
                  {course.category.replace('-', ' ')}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-950 text-slate-300 border border-slate-800">
                  {course.level}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                {course.title}
              </h1>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {course.longDescription || course.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2">
                <span className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="w-4 h-4 fill-amber-400" /> {course.rating} ({course.reviewCount} reviews)
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" /> {course.duration}
                </span>
                <span>•</span>
                <span>{totalLessons} Interactive Video Lessons</span>
              </div>

              {/* Instructor Bio */}
              <div className="pt-4 border-t border-slate-800 flex items-center gap-3">
                <img src={course.instructor.avatar} alt={course.instructor.name} className="w-10 h-10 rounded-full object-cover border border-amber-400" />
                <div>
                  <div className="text-xs font-bold text-white">{course.instructor.name}</div>
                  <div className="text-[11px] text-slate-400">{course.instructor.role}</div>
                </div>
              </div>
            </div>

            {/* Sticky Card Sidebar */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl">
              <img src={course.thumbnail} alt={course.title} className="w-full h-44 object-cover rounded-xl border border-slate-800" />

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 block">Enrollment Fee</span>
                  <span className="text-2xl font-extrabold text-amber-400">{course.price === 0 ? 'Free Access' : `$${course.price}`}</span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                  Instant Access
                </span>
              </div>

              <button
                onClick={handleEnroll}
                className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg ${
                  isEnrolled 
                    ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400' 
                    : 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                }`}
              >
                <GraduationCap className="w-5 h-5" />
                <span>{isEnrolled ? 'Open in Student Portal' : 'Enroll in Course'}</span>
              </button>

              <div className="text-[11px] text-slate-400 space-y-1.5 pt-2 border-t border-slate-800">
                <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> Full HD Video Stream Access</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> Downloadable Source Code & Notes</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> Verified Capstone Certificate</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Course Curriculum & Learning Outcomes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Curriculum Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-extrabold text-white">Course Curriculum & Modules</h2>

          <div className="space-y-3">
            {course.curriculum.map((mod, idx) => (
              <div key={mod.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenModuleId(openModuleId === mod.id ? '' : mod.id)}
                  className="w-full p-4 text-left font-bold text-sm text-white flex items-center justify-between gap-4 hover:bg-slate-800/50"
                >
                  <div>
                    <span>{mod.title}</span>
                    <p className="text-xs text-slate-400 font-normal mt-0.5">{mod.description}</p>
                  </div>
                  {openModuleId === mod.id ? <ChevronUp className="w-4 h-4 text-amber-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                </button>

                {openModuleId === mod.id && (
                  <div className="border-t border-slate-800 bg-slate-950 p-3 space-y-2">
                    {mod.lessons.map(lesson => (
                      <div key={lesson.id} className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs text-slate-300">
                        <div className="flex items-center gap-2.5">
                          <Play className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span className="font-semibold text-white">{lesson.title}</span>
                        </div>
                        <span className="text-slate-500 text-[11px] font-mono">{lesson.duration}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Learning Outcomes */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" /> What You Will Master
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-300">
              {course.learningOutcomes.map((out, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{out}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h3 className="text-base font-bold text-white">Prerequisites</h3>
            <ul className="space-y-1.5 text-xs text-slate-400">
              {course.prerequisites.map((pre, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
                  <span>{pre}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </section>

      {/* Course Q&A Forum */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CourseQAForum course={course} />
      </section>

      {/* Student Reviews Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <StudentReviews courseId={course.id} />
      </section>

    </div>
  );
};
