import React from 'react';
import { Course, Enrollment } from '../types';
import { CheckCircle2, PlayCircle, Award, BookOpen, Clock, AlertCircle } from 'lucide-react';

interface CourseProgressProps {
  courses: Course[];
  enrollments: Enrollment[];
  onSelectCourse?: (courseId: string) => void;
  activeCourseId?: string;
  onViewCertificate?: (courseTitle: string, certificateId?: string) => void;
}

export const CourseProgress: React.FC<CourseProgressProps> = ({
  courses,
  enrollments,
  onSelectCourse,
  activeCourseId,
  onViewCertificate
}) => {
  // Filter courses that user is enrolled in (paid courses)
  const paidEnrollments = enrollments;

  if (paidEnrollments.length === 0) {
    return (
      <div id="course-progress-empty" className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 mx-auto">
          <BookOpen className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-bold text-white">No Active Paid Course Progress</h4>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Purchased courses will track your live video lesson progress and percentage completion here.
        </p>
      </div>
    );
  }

  return (
    <div id="course-progress-container" className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-300">
            Course Completion Progress ({paidEnrollments.length})
          </h3>
        </div>
        <span className="text-[11px] text-slate-500 font-mono">
          Avg: {Math.round(paidEnrollments.reduce((acc, e) => acc + (e.progressPercent || 0), 0) / paidEnrollments.length)}% Overall
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {paidEnrollments.map((enrollment) => {
          const course = courses.find((c) => c.id === enrollment.courseId);
          const totalLessons = course
            ? course.curriculum.reduce((acc, mod) => acc + mod.lessons.length, 0)
            : 1;
          const completedCount = enrollment.completedLessons?.length || 0;
          const calculatedPercent = Math.min(
            100,
            Math.max(
              enrollment.progressPercent || 0,
              Math.round((completedCount / (totalLessons || 1)) * 100)
            )
          );

          const isSelected = activeCourseId === enrollment.courseId;
          const isCompleted = calculatedPercent >= 100;

          return (
            <div
              key={enrollment.id}
              id={`course-progress-card-${enrollment.courseId}`}
              onClick={() => onSelectCourse?.(enrollment.courseId)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
                isSelected
                  ? 'bg-slate-900 border-amber-400 ring-1 ring-amber-400/50 shadow-xl'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              <div className="space-y-3">
                {/* Header info */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {course?.thumbnail ? (
                      <img
                        src={course.thumbnail}
                        alt={enrollment.courseTitle}
                        className="w-12 h-10 object-cover rounded-xl border border-slate-800 shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 shrink-0">
                        <BookOpen className="w-5 h-5" />
                      </div>
                    )}
                    <div className="overflow-hidden">
                      <h4 className="text-xs font-extrabold text-white truncate group-hover:text-amber-400 transition-colors">
                        {enrollment.courseTitle}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400">
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3 text-amber-400" />
                          {completedCount}/{totalLessons} Lessons
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Percentage badge */}
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold shrink-0 border ${
                      isCompleted
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        : calculatedPercent > 0
                        ? 'bg-amber-400/15 text-amber-400 border-amber-400/30'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {calculatedPercent}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-400 font-medium">Progress Status</span>
                    <span
                      className={`font-bold ${
                        isCompleted
                          ? 'text-emerald-400'
                          : calculatedPercent > 0
                          ? 'text-amber-400'
                          : 'text-slate-500'
                      }`}
                    >
                      {isCompleted ? 'Completed' : calculatedPercent > 0 ? 'In Progress' : 'Not Started'}
                    </span>
                  </div>

                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800/80">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        isCompleted
                          ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50'
                          : 'bg-gradient-to-r from-amber-500 to-amber-300 shadow-sm shadow-amber-500/50'
                      }`}
                      style={{ width: `${calculatedPercent}%` }}
                    ></div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-1 flex items-center justify-between text-[11px]">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCourse?.(enrollment.courseId);
                    }}
                    className="text-amber-400 font-bold hover:underline flex items-center gap-1 text-[11px]"
                  >
                    <PlayCircle className="w-3.5 h-3.5" />
                    <span>{isCompleted ? 'Review Lectures' : 'Continue Learning'}</span>
                  </button>

                  {isCompleted && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewCertificate?.(enrollment.courseTitle, enrollment.certificateId);
                      }}
                      className="text-emerald-400 font-bold hover:underline flex items-center gap-1 text-[11px]"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>Certificate</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
