import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CourseCard } from '../components/CourseCard';
import { CourseFilter, PriceRangeOption, SortOption } from '../components/CourseFilter';
import { CourseCardSkeleton } from '../components/SkeletonLoader';
import { Course } from '../types';
import { BookOpen, GraduationCap } from 'lucide-react';

interface CoursesProps {
  navigate: (route: string) => void;
  onSelectCourse: (course: Course) => void;
}

export const Courses: React.FC<CoursesProps> = ({ navigate, onSelectCourse }) => {
  const { courses, enrollments, isStudentLoggedIn, openAuthModal, openPaymentModal } = useApp();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<PriceRangeOption>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('featured');

  useEffect(() => {
    // Simulate brief initial fetch / data settle delay for smooth skeleton UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const enrolledCourseIds = enrollments.map(e => e.courseId);

  const filteredCourses = courses.filter(course => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      course.title.toLowerCase().includes(q) ||
      course.description.toLowerCase().includes(q) ||
      (course.instructor?.name && course.instructor.name.toLowerCase().includes(q)) ||
      (course.learningOutcomes && course.learningOutcomes.some(o => o.toLowerCase().includes(q)));

    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;

    let matchesPrice = true;
    if (priceRange === 'under-100') {
      matchesPrice = course.price < 100;
    } else if (priceRange === '100-200') {
      matchesPrice = course.price >= 100 && course.price <= 200;
    } else if (priceRange === '200-plus') {
      matchesPrice = course.price > 200;
    }

    return matchesSearch && matchesCategory && matchesLevel && matchesPrice;
  }).sort((a, b) => {
    if (sortBy === 'rating') {
      return (b.rating || 0) - (a.rating || 0);
    }
    if (sortBy === 'price-low') {
      return a.price - b.price;
    }
    if (sortBy === 'price-high') {
      return b.price - a.price;
    }
    // Default: featured or default ordering
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });

  const handleResetAll = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setPriceRange('all');
    setSelectedLevel('all');
    setSortBy('featured');
  };

  return (
    <div className="space-y-10 pb-16 pt-8">
      
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-amber-400 text-xs font-semibold">
          <GraduationCap className="w-4 h-4" /> Self-Paced LMS Interactive Catalog
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Academy Interactive Courses
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
          Hands-on technical courses designed for real-world execution. Enrolled students gain instant access to HD video lessons, source code, and verified capstone certificates.
        </p>

        {/* Filter Component */}
        <div className="pt-4 max-w-5xl mx-auto text-left">
          <CourseFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            selectedLevel={selectedLevel}
            onLevelChange={setSelectedLevel}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            onResetFilters={handleResetAll}
            totalResults={filteredCourses.length}
            totalCoursesCount={courses.length}
          />
        </div>
      </section>

      {/* Courses Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <CourseCardSkeleton key={idx} />
            ))}
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                onSelect={onSelectCourse}
                onEnroll={(c) => {
                  if (!isStudentLoggedIn) {
                    openAuthModal('login');
                  } else if (enrolledCourseIds.includes(c.id)) {
                    navigate('dashboard');
                  } else {
                    openPaymentModal(c);
                  }
                }}
                isEnrolled={enrolledCourseIds.includes(course.id)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
            <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">No courses match your search criteria</h3>
            <p className="text-xs text-slate-400">Try adjusting your filters or search keywords.</p>
            <button
              type="button"
              onClick={handleResetAll}
              className="px-5 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300 transition-all shadow-md"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </section>

    </div>
  );
};

