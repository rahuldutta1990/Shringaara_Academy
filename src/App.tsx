import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { StudentAuthModal } from './components/StudentAuthModal';
import { CoursePaymentModal } from './components/CoursePaymentModal';

import { Home } from './pages/Home';
import { ServiceDetail } from './pages/ServiceDetail';
import { Work } from './pages/Work';
import { About } from './pages/About';
import { Process } from './pages/Process';
import { Courses } from './pages/Courses';
import { CourseDetail } from './pages/CourseDetail';
import { Dashboard } from './pages/Dashboard';
import { Admin } from './pages/Admin';
import { InstructorPortal } from './pages/InstructorPortal';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';
import { Faq } from './pages/Faq';
import { ContactPage } from './pages/ContactPage';
import { RefundPolicy } from './pages/RefundPolicy';

import { Course } from './types';

function MainApp() {
  const { openBookingModal } = useApp();
  const [activeRoute, setActiveRoute] = useState<string>('home');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Sync hash routing if user enters direct URL (e.g. /admin or #admin)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        setActiveRoute(hash);
      } else if (window.location.pathname.includes('/admin')) {
        setActiveRoute('admin');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (route: string) => {
    setActiveRoute(route);
    window.location.hash = route;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCourse = (course: Course) => {
    setSelectedCourse(course);
    navigate('course-detail');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-400 selection:text-slate-950 flex flex-col justify-between">
      
      {/* Global Navigation Header */}
      <Header activeRoute={activeRoute} navigate={navigate} />

      {/* Main Page View Content */}
      <main className="flex-1">
        {activeRoute === 'home' && (
          <Home navigate={navigate} onSelectCourse={handleSelectCourse} />
        )}

        {activeRoute === 'service-ds' && (
          <ServiceDetail category="data-science" navigate={navigate} onSelectCourse={handleSelectCourse} />
        )}

        {activeRoute === 'service-coding' && (
          <ServiceDetail category="coding" navigate={navigate} onSelectCourse={handleSelectCourse} />
        )}

        {activeRoute === 'service-design' && (
          <ServiceDetail category="designing" navigate={navigate} onSelectCourse={handleSelectCourse} />
        )}

        {activeRoute === 'service-qa' && (
          <ServiceDetail category="qa" navigate={navigate} onSelectCourse={handleSelectCourse} />
        )}

        {activeRoute === 'services-overview' && (
          <Home navigate={navigate} onSelectCourse={handleSelectCourse} />
        )}

        {activeRoute === 'work' && <Work />}

        {activeRoute === 'about' && <About />}

        {activeRoute === 'process' && <Process />}

        {activeRoute === 'privacy' && <Privacy navigate={navigate} />}

        {activeRoute === 'terms' && <Terms navigate={navigate} />}

        {activeRoute === 'faq' && <Faq navigate={navigate} />}

        {activeRoute === 'contact' && <ContactPage navigate={navigate} />}

        {activeRoute === 'refund' && <RefundPolicy navigate={navigate} />}

        {activeRoute === 'courses' && (
          <Courses navigate={navigate} onSelectCourse={handleSelectCourse} />
        )}

        {activeRoute === 'course-detail' && selectedCourse && (
          <CourseDetail 
            course={selectedCourse} 
            onBack={() => navigate('courses')} 
            navigate={navigate} 
          />
        )}

        {activeRoute === 'dashboard' && <Dashboard navigate={navigate} />}

        {activeRoute === 'instructor-portal' && <InstructorPortal />}

        {activeRoute === 'admin' && <Admin />}
      </main>

      {/* Consultation Calendar Booking Modal */}
      <BookingModal />

      {/* Student Registration and Login Modal */}
      <StudentAuthModal />

      {/* Course Payment Checkout Modal */}
      <CoursePaymentModal />

      {/* Footer Component */}
      <Footer navigate={navigate} openBookingModal={() => openBookingModal()} />

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
