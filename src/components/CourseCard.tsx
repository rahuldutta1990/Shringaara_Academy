import React from 'react';
import { Star, Clock, BookOpen, GraduationCap, ArrowRight, User } from 'lucide-react';
import { Course } from '../types';

interface CourseCardProps {
  course: Course;
  onSelect: (course: Course) => void;
  onEnroll: (course: Course) => void;
  isEnrolled?: boolean;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onSelect, onEnroll, isEnrolled }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all hover:shadow-xl hover:-translate-y-1 group flex flex-col h-full">
      
      {/* Thumbnail Header */}
      <div className="relative h-44 overflow-hidden bg-slate-950">
        <img 
          src={course.thumbnail} 
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-950/80 backdrop-blur-md text-amber-400 border border-amber-400/30">
            {course.category.replace('-', ' ')}
          </span>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-slate-950/80 text-slate-300 border border-slate-700">
            {course.level}
          </span>
        </div>

        {/* Price Badge */}
        <div className="absolute bottom-3 right-3">
          <span className="px-3 py-1 rounded-lg text-xs font-bold bg-amber-400 text-slate-950 shadow-md">
            {course.price === 0 ? 'Free Access' : `$${course.price}`}
          </span>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1 text-amber-400 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              {course.rating}
            </span>
            <span>({course.reviewCount} reviews)</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {course.duration}
            </span>
          </div>

          <h3 
            onClick={() => onSelect(course)}
            className="font-bold text-base text-white group-hover:text-amber-400 transition-colors cursor-pointer line-clamp-2 leading-snug"
          >
            {course.title}
          </h3>

          <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">
            {course.description}
          </p>
        </div>

        {/* Instructor & Actions */}
        <div className="pt-3 border-t border-slate-800/80 space-y-3">
          <div className="flex items-center gap-2.5">
            <img 
              src={course.instructor.avatar} 
              alt={course.instructor.name}
              className="w-7 h-7 rounded-full object-cover border border-slate-700"
            />
            <div className="text-xs">
              <span className="text-slate-300 font-medium block leading-none">{course.instructor.name}</span>
              <span className="text-[10px] text-slate-500 leading-none">{course.instructor.role}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => onSelect(course)}
              className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs text-center transition-colors flex items-center justify-center gap-1"
            >
              <BookOpen className="w-3.5 h-3.5 text-slate-400" /> Curriculum
            </button>

            <button
              onClick={() => onEnroll(course)}
              className={`py-2 px-3 rounded-xl font-bold text-xs text-center transition-all flex items-center justify-center gap-1 ${
                isEnrolled
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md shadow-amber-500/10'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              {isEnrolled ? 'In Portal' : course.price === 0 ? 'Enroll Now' : `Purchase ($${course.price})`}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
