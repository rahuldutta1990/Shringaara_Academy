import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CertificateModal } from '../components/CertificateModal';
import { CourseProgress } from '../components/CourseProgress';
import { CourseProgressSkeleton, DashboardWidgetSkeleton } from '../components/SkeletonLoader';
import { EmailPreviewModal } from '../components/EmailPreviewModal';
import { CourseQAForum } from '../components/CourseQAForum';
import { sendCourseEnrollmentEmail } from '../lib/firebaseEmailService';
import { Course, Lesson, EmailNotification } from '../types';
import { 
  GraduationCap, 
  Play, 
  CheckCircle2, 
  Award, 
  BookOpen, 
  Clock, 
  FileText, 
  Download, 
  Sparkles, 
  User, 
  ArrowRight, 
  Lock, 
  KeyRound, 
  UserCheck, 
  LogOut,
  Settings,
  Edit3,
  ShieldCheck,
  CreditCard,
  Bell,
  Mail,
  Phone,
  Calendar,
  Check,
  AlertCircle,
  Receipt,
  MessageSquare
} from 'lucide-react';

interface DashboardProps {
  navigate: (route: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ navigate }) => {
  const { 
    enrollments, 
    courses, 
    currentUserEmail, 
    currentUserName, 
    handleUpdateLessonProgress, 
    bookings,
    isStudentLoggedIn,
    openAuthModal,
    studentLogout,
    openPaymentModal,
    updateStudentProfile,
    paymentReceipts,
    emailNotifications
  } = useApp();

  // Primary Account Portal Active Tab
  const [activeTab, setActiveTab] = useState<'profile' | 'courses' | 'notifications' | 'settings' | 'signout'>('courses');
  const [selectedEmailForModal, setSelectedEmailForModal] = useState<EmailNotification | null>(null);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoadingDashboard(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  // Courses Sub-state
  const [activeCourseId, setActiveCourseId] = useState<string>(enrollments[0]?.courseId || courses[0]?.id || '');
  const [activeLessonId, setActiveLessonId] = useState<string>('');
  const [personalNotes, setPersonalNotes] = useState<string>('');
  const [coursesFilter, setCoursesFilter] = useState<'enrolled' | 'all'>('enrolled');
  const [courseViewTab, setCourseViewTab] = useState<'curriculum' | 'qa'>('curriculum');

  // Profile Edit Modal State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(currentUserName);
  const [editPhone, setEditPhone] = useState('+1 (555) 234-5678');
  const [editBio, setEditBio] = useState('Enthusiastic tech student mastering full-stack software development, AI, and design architectures.');
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');

  // Change Password State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });

  // Notification Toggles State
  const [notifCourse, setNotifCourse] = useState(true);
  const [notifReminders, setNotifReminders] = useState(true);
  const [notifCertificates, setNotifCertificates] = useState(true);
  const [notifMarketing, setNotifMarketing] = useState(false);

  // Certificate Modal State
  const [certificateModalData, setCertificateModalData] = useState<{
    isOpen: boolean;
    courseTitle: string;
    certificateId: string;
    date: string;
  }>({
    isOpen: false,
    courseTitle: '',
    certificateId: '',
    date: ''
  });

  // RESTRICTED ACCESS LIMITATION GUARD:
  if (!isStudentLoggedIn) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 space-y-10">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="w-20 h-20 rounded-3xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 mx-auto shadow-lg shadow-amber-500/10">
            <Lock className="w-10 h-10" />
          </div>

          <div className="space-y-2 max-w-xl mx-auto">
            <span className="px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-bold uppercase tracking-widest inline-block">
              Access Restricted
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
              Student Account Required
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              You must log in or register a Student Account to enter the Student Portal. Non-registered guests cannot view course lectures, track progress, or access account settings.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => openAuthModal('login')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-amber-300 transition-all flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>Student Login</span>
            </button>
            <button
              onClick={() => openAuthModal('register')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold text-sm hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
            >
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>Register New Account</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active course object
  const activeCourse = courses.find(c => c.id === activeCourseId) || courses[0];
  const activeEnrollment = enrollments.find(e => e.courseId === activeCourseId);
  const isCoursePaidAndEnrolled = !!activeEnrollment;

  // All lessons in active course
  const allLessonsInActiveCourse: Lesson[] = activeCourse?.curriculum.flatMap(m => m.lessons) || [];
  const currentLesson = allLessonsInActiveCourse.find(l => l.id === activeLessonId) || allLessonsInActiveCourse[0];

  const completedLessons = activeEnrollment?.completedLessons || [];
  const totalLessonsCount = allLessonsInActiveCourse.length || 1;
  const currentProgressPercent = activeEnrollment?.progressPercent || Math.round((completedLessons.length / totalLessonsCount) * 100);

  const toggleLessonCompleted = (lessonId: string) => {
    if (!activeCourse || !isCoursePaidAndEnrolled) return;
    handleUpdateLessonProgress(activeCourse.id, lessonId, totalLessonsCount);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudentProfile(editName, editPhone, editBio);
    setIsEditingProfile(false);
    setProfileSuccessMsg('Profile information updated successfully!');
    setTimeout(() => setProfileSuccessMsg(''), 4000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword) {
      setPasswordMsg({ type: 'error', text: 'Please enter your current password.' });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'New password must be at least 6 characters long.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    setPasswordMsg({ type: 'success', text: 'Account password updated successfully!' });
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordMsg({ type: '', text: '' }), 4000);
  };

  const myBookings = bookings.filter(b => b.userEmail.toLowerCase() === currentUserEmail.toLowerCase().trim());
  const myReceipts = paymentReceipts.filter(r => r.studentEmail.toLowerCase() === currentUserEmail.toLowerCase().trim());

  return (
    <div className="space-y-8 pb-16 pt-6">
      
      {/* Top Banner Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 p-0.5 shadow-lg shadow-amber-500/20 shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-amber-400 font-extrabold text-2xl">
                {currentUserName ? currentUserName.charAt(0).toUpperCase() : 'S'}
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Student Portal</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                {currentUserName}
              </h1>
              <p className="text-xs text-slate-400 font-mono flex items-center gap-2">
                <span>{currentUserEmail}</span>
                <span>•</span>
                <span className="text-amber-400 font-bold">ID: STU-849201</span>
              </p>
            </div>
          </div>

          {/* Quick Overview Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-xl text-xs flex items-center gap-3">
              <GraduationCap className="w-5 h-5 text-amber-400" />
              <div>
                <span className="text-slate-500 block uppercase text-[9px] font-bold">Purchased Courses</span>
                <span className="text-sm font-extrabold text-amber-400">{enrollments.length} Active</span>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-xl text-xs flex items-center gap-3">
              <Receipt className="w-5 h-5 text-emerald-400" />
              <div>
                <span className="text-slate-500 block uppercase text-[9px] font-bold">Paid Receipts</span>
                <span className="text-sm font-extrabold text-emerald-400">{myReceipts.length} Invoices</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STUDENT PORTAL NAVIGATION TABS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 border border-slate-800 p-1.5 rounded-2xl flex flex-wrap items-center justify-between gap-2 shadow-lg">
          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            
            {/* Tab 1: My Profile */}
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shrink-0 ${
                activeTab === 'profile'
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <User className="w-4 h-4" />
              <span>My Profile</span>
            </button>

            {/* Tab 2: My Courses */}
            <button
              onClick={() => setActiveTab('courses')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shrink-0 ${
                activeTab === 'courses'
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>My Courses</span>
              {enrollments.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-slate-950 text-amber-400 font-bold text-[10px]">
                  {enrollments.length}
                </span>
              )}
            </button>

            {/* Tab 3: Email Notifications */}
            <button
              onClick={() => setActiveTab('notifications')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shrink-0 ${
                activeTab === 'notifications'
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Email Notifications</span>
              {emailNotifications.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold text-[10px]">
                  {emailNotifications.length}
                </span>
              )}
            </button>

            {/* Tab 4: Account Setting */}
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shrink-0 ${
                activeTab === 'settings'
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Account Setting</span>
            </button>
          </div>

          {/* Tab 4: Sign Out */}
          <button
            onClick={() => setActiveTab('signout')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'signout'
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                : 'text-slate-400 hover:text-rose-400 hover:bg-slate-800'
            }`}
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </section>

      {/* PORTAL PAGE CONTENT VIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* =========================================
            PAGE 1: MY PROFILE
           ========================================= */}
        {activeTab === 'profile' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            
            {profileSuccessMsg && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{profileSuccessMsg}</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Profile Overview Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <div className="text-center space-y-3">
                  <div className="w-24 h-24 rounded-3xl bg-slate-950 border-2 border-amber-400 mx-auto flex items-center justify-center text-amber-400 font-extrabold text-4xl shadow-xl shadow-amber-500/10">
                    {currentUserName ? currentUserName.charAt(0).toUpperCase() : 'S'}
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-white">{currentUserName}</h2>
                    <p className="text-xs text-amber-400 font-bold">Registered Student Member</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 space-y-3 text-xs">
                  <div className="flex items-center gap-3 text-slate-300">
                    <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{currentUserEmail}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{editPhone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Member Since August 2026</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="w-full py-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold text-xs hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
                >
                  <Edit3 className="w-4 h-4 text-amber-400" />
                  <span>Edit Profile Information</span>
                </button>
              </div>

              {/* Profile Detailed Cards */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Academic Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
                    <span className="text-xs font-semibold text-slate-400 block">Purchased Courses</span>
                    <span className="text-2xl font-extrabold text-amber-400">{enrollments.length}</span>
                    <p className="text-[11px] text-slate-500">Paid access verified</p>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
                    <span className="text-xs font-semibold text-slate-400 block">Completed Modules</span>
                    <span className="text-2xl font-extrabold text-emerald-400">
                      {enrollments.reduce((acc, e) => acc + e.completedLessons.length, 0)}
                    </span>
                    <p className="text-[11px] text-slate-500">Interactive lessons done</p>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
                    <span className="text-xs font-semibold text-slate-400 block">Certificates Earned</span>
                    <span className="text-2xl font-extrabold text-sky-400">
                      {enrollments.filter(e => e.progressPercent >= 100).length}
                    </span>
                    <p className="text-[11px] text-slate-500">Official credentials</p>
                  </div>
                </div>

                {/* About & Bio */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
                  <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                    <User className="w-4 h-4 text-amber-400" /> Biography & Student Goals
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-2xl border border-slate-800">
                    "{editBio}"
                  </p>
                </div>

                {/* Official Student Credentials Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
                  <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> Official Verification Card
                  </h3>
                  <div className="p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-amber-400/30 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-amber-400 block">Shringaara Student ID</span>
                      <span className="text-xl font-mono font-extrabold text-white">STU-849201</span>
                      <p className="text-[11px] text-slate-400">Issued to {currentUserName} ({currentUserEmail})</p>
                    </div>
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                      Account Verified
                    </span>
                  </div>
                </div>

              </div>

            </div>

            {/* EDIT PROFILE MODAL */}
            {isEditingProfile && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <h3 className="text-lg font-bold text-white">Edit Profile Details</h3>
                    <button onClick={() => setIsEditingProfile(false)} className="text-slate-400 hover:text-white">✕</button>
                  </div>

                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">Full Name</label>
                      <input
                        type="text"
                        required
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">Phone Number</label>
                      <input
                        type="text"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">Student Bio / Learning Objectives</label>
                      <textarea
                        rows={3}
                        value={editBio}
                        onChange={(e) => setEditBio(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsEditingProfile(false)}
                        className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs shadow-md"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

          </div>
        )}

        {/* =========================================
            PAGE 2: MY COURSES & VIDEO PLAYER
           ========================================= */}
        {activeTab === 'courses' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            
            {/* Skeleton Loading State */}
            {isLoadingDashboard ? (
              <div className="space-y-6">
                <CourseProgressSkeleton />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <DashboardWidgetSkeleton />
                  <DashboardWidgetSkeleton />
                  <DashboardWidgetSkeleton />
                </div>
              </div>
            ) : (
              <>
                {/* Course Progress Component Overview */}
                {enrollments.length > 0 && (
                  <CourseProgress
                    courses={courses}
                    enrollments={enrollments}
                    activeCourseId={activeCourseId}
                    onSelectCourse={(courseId) => setActiveCourseId(courseId)}
                    onViewCertificate={(courseTitle, certId) => setCertificateModalData({
                      isOpen: true,
                      courseTitle: courseTitle,
                      certificateId: certId || `CERT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
                      date: new Date().toLocaleDateString()
                    })}
                  />
                )}
              </>
            )}

            {/* Filter Toggle Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <div>
                <h3 className="text-sm font-bold text-white">Course Library & Video Player</h3>
                <p className="text-xs text-slate-400">All courses require payment authorization. Unlocked courses grant full access.</p>
              </div>

              <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setCoursesFilter('enrolled')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    coursesFilter === 'enrolled'
                      ? 'bg-amber-400 text-slate-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Purchased Courses ({enrollments.length})
                </button>
                <button
                  onClick={() => setCoursesFilter('all')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    coursesFilter === 'all'
                      ? 'bg-amber-400 text-slate-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All Paid Catalog ({courses.length})
                </button>
              </div>
            </div>

            {/* IF ENROLLED LIST IS EMPTY AND USER IS IN ENROLLED TAB */}
            {coursesFilter === 'enrolled' && enrollments.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 mx-auto">
                  <Lock className="w-8 h-8" />
                </div>
                <div className="space-y-1 max-w-md mx-auto">
                  <h3 className="text-lg font-bold text-white">No Paid Courses Found</h3>
                  <p className="text-xs text-slate-400">
                    You have not purchased any courses yet. Browse our paid courses catalog and complete checkout to unlock interactive video lectures and resources.
                  </p>
                </div>
                <button
                  onClick={() => setCoursesFilter('all')}
                  className="px-6 py-3 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20"
                >
                  Explore Paid Course Catalog
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Side: Course Selector Sidebar */}
                <div className="lg:col-span-4 space-y-4">
                  <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400">Select Course</h3>

                  <div className="space-y-3">
                    {(coursesFilter === 'enrolled' ? courses.filter(c => enrollments.some(e => e.courseId === c.id)) : courses).map(course => {
                      const enrollment = enrollments.find(e => e.courseId === course.id);
                      const isEnrolled = !!enrollment;
                      const isSelected = course.id === activeCourseId;
                      const courseTotalLessons = course.curriculum.reduce((acc, mod) => acc + mod.lessons.length, 0) || 1;
                      const completedCount = enrollment?.completedLessons?.length || 0;
                      const percentVal = Math.min(100, Math.max(enrollment?.progressPercent || 0, Math.round((completedCount / courseTotalLessons) * 100)));

                      return (
                        <div
                          key={course.id}
                          onClick={() => setActiveCourseId(course.id)}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-slate-900 border-amber-400 ring-1 ring-amber-400 shadow-xl'
                              : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <img src={course.thumbnail} alt={course.title} className="w-16 h-12 object-cover rounded-xl shrink-0 border border-slate-800" />
                            <div className="space-y-1 overflow-hidden flex-1">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">{course.category}</span>
                                {isEnrolled ? (
                                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[9px] font-bold border border-emerald-500/20">
                                    {percentVal}% Complete
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[9px] font-bold border border-amber-500/20 flex items-center gap-1">
                                    <Lock className="w-2.5 h-2.5" /> ${course.price}
                                  </span>
                                )}
                              </div>
                              <h4 className="text-xs font-bold text-white truncate">{course.title}</h4>
                            </div>
                          </div>

                          {/* Mini Progress Bar for Enrolled Courses */}
                          {isEnrolled && (
                            <div className="mt-3 pt-2 border-t border-slate-800/80 space-y-1">
                              <div className="flex items-center justify-between text-[10px]">
                                <span className="text-slate-400 font-mono">{completedCount}/{courseTotalLessons} Lessons</span>
                                <span className="text-amber-400 font-bold">{percentVal}%</span>
                              </div>
                              <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                                <div
                                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-300"
                                  style={{ width: `${percentVal}%` }}
                                ></div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right Side: Main Video Player or Payment Lock Banner */}
                <div className="lg:col-span-8 space-y-6">
                  
                  {!isCoursePaidAndEnrolled ? (
                    /* PAYMENT REQUIRED LOCK OVERLAY */
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden">
                      <div className="w-20 h-20 rounded-3xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 mx-auto">
                        <Lock className="w-10 h-10" />
                      </div>

                      <div className="space-y-2 max-w-md mx-auto">
                        <span className="px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-bold uppercase tracking-widest">
                          Payment Validation Required
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                          {activeCourse.title}
                        </h2>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          This course requires an active paid enrollment ($ {activeCourse.price}). Complete checkout to unlock full video lectures, source code, and verified certification.
                        </p>
                      </div>

                      <div className="pt-2">
                        <button
                          onClick={() => openPaymentModal(activeCourse)}
                          className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-500/20 hover:from-amber-400 hover:to-amber-300 transition-all"
                        >
                          Unlock & Purchase Course (${activeCourse.price})
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* PAID COURSE CONTENT & VIDEO STREAM PLAYER */
                    <div className="space-y-6">
                      
                      {/* Video Player Box */}
                      <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                        <div className="relative aspect-video bg-black flex items-center justify-center group">
                          <iframe
                            src={currentLesson?.videoUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ"}
                            title={currentLesson?.title || "Course Video"}
                            className="w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        </div>

                        {/* Player Toolbar */}
                        <div className="p-5 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <span className="text-[10px] uppercase tracking-wider font-bold text-amber-400 block">Current Lecture</span>
                            <h3 className="text-base font-extrabold text-white">{currentLesson?.title || 'Course Lecture'}</h3>
                          </div>

                          <button
                            onClick={() => currentLesson && toggleLessonCompleted(currentLesson.id)}
                            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
                              completedLessons.includes(currentLesson?.id || '')
                                ? 'bg-emerald-500 text-slate-950'
                                : 'bg-slate-800 border border-slate-700 text-white hover:bg-slate-700'
                            }`}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>{completedLessons.includes(currentLesson?.id || '') ? 'Completed' : 'Mark Completed'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Progress Bar & Certificate Generator */}
                      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-300 font-bold">Overall Course Completion Progress</span>
                          <span className="text-amber-400 font-extrabold">{currentProgressPercent}% Completed</span>
                        </div>

                        <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                          <div
                            className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-500"
                            style={{ width: `${currentProgressPercent}%` }}
                          ></div>
                        </div>

                        {currentProgressPercent >= 100 && (
                          <div className="pt-2">
                            <button
                              onClick={() => setCertificateModalData({
                                isOpen: true,
                                courseTitle: activeCourse.title,
                                certificateId: activeEnrollment?.certificateId || `CERT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
                                date: new Date().toLocaleDateString()
                              })}
                              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg"
                            >
                              <Award className="w-4 h-4" />
                              <span>View & Download Verified Certificate</span>
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Course Content Sub-Navigation Tabs */}
                      <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
                        <button
                          onClick={() => setCourseViewTab('curriculum')}
                          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                            courseViewTab === 'curriculum'
                              ? 'bg-amber-400 text-slate-950 shadow-md'
                              : 'text-slate-400 hover:text-white hover:bg-slate-900'
                          }`}
                        >
                          <BookOpen className="w-4 h-4" />
                          <span>Curriculum Lectures ({allLessonsInActiveCourse.length})</span>
                        </button>

                        <button
                          onClick={() => setCourseViewTab('qa')}
                          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                            courseViewTab === 'qa'
                              ? 'bg-amber-400 text-slate-950 shadow-md'
                              : 'text-slate-400 hover:text-white hover:bg-slate-900'
                          }`}
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span>Q&A Discussion Forum</span>
                        </button>
                      </div>

                      {/* Tab Content Display */}
                      {courseViewTab === 'curriculum' ? (
                        /* Curriculum Lesson List */
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                          <h3 className="text-sm font-bold text-white">Course Curriculum Lectures</h3>

                          <div className="space-y-2">
                            {allLessonsInActiveCourse.map((lesson, idx) => {
                              const isDone = completedLessons.includes(lesson.id);
                              const isCurrent = lesson.id === (currentLesson?.id || '');

                              return (
                                <div
                                  key={lesson.id}
                                  onClick={() => setActiveLessonId(lesson.id)}
                                  className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                                    isCurrent
                                      ? 'bg-amber-400/10 border-amber-400 text-white'
                                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                                      isDone ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                                    }`}>
                                      {isDone ? <Check className="w-4 h-4" /> : idx + 1}
                                    </div>
                                    <span className="text-xs font-semibold">{lesson.title}</span>
                                  </div>

                                  <span className="text-[11px] font-mono text-slate-500">{lesson.duration}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        /* Per-Course Q&A Forum */
                        <CourseQAForum
                          course={activeCourse}
                          currentLessonId={currentLesson?.id}
                        />
                      )}

                    </div>
                  )}

                </div>

              </div>
            )}

          </div>
        )}

        {/* =========================================
            PAGE 3: EMAIL NOTIFICATIONS (FIREBASE CLOUD FUNCTION)
           ========================================= */}
        {activeTab === 'notifications' && (
          <div className="space-y-8 animate-in fade-in duration-200 max-w-5xl mx-auto">
            
            {/* Header Banner */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-lg shadow-amber-500/20">
                    <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-amber-400">
                      <Mail className="w-6 h-6" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-white">Firebase Email Dispatch Log</h2>
                    <p className="text-xs text-slate-400">
                      Automated confirmation emails sent via Cloud Function on course payment
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Firebase Cloud Functions Active</span>
                </div>
              </div>

              {/* Email List */}
              {emailNotifications.length === 0 ? (
                <div className="p-8 text-center bg-slate-950 border border-slate-800/80 rounded-2xl space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mx-auto">
                    <Mail className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-white">No Email Notifications Dispatched Yet</h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Enrolling and completing payment for any course automatically triggers our Firebase Cloud Function to render and dispatch an official HTML confirmation email to <span className="text-amber-400 font-semibold">{currentUserEmail}</span>.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => navigate('/courses')}
                      className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 text-xs font-bold hover:bg-amber-300 transition-all inline-flex items-center gap-1.5"
                    >
                      <GraduationCap className="w-4 h-4" /> Browse Courses & Test Enrollment Email
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {emailNotifications.map((notif) => (
                    <div 
                      key={notif.id}
                      className="bg-slate-950 border border-slate-800/80 hover:border-slate-700 rounded-2xl p-5 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                    >
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-extrabold uppercase tracking-wider">
                            {notif.status}
                          </span>
                          <span className="text-xs font-mono text-amber-400 font-bold">
                            {notif.transactionId}
                          </span>
                          <span className="text-xs text-slate-500">•</span>
                          <span className="text-xs text-slate-400">
                            {new Date(notif.sentAt).toLocaleString()}
                          </span>
                        </div>

                        <h4 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                          {notif.subject}
                        </h4>

                        <p className="text-xs text-slate-400 flex items-center gap-2">
                          <span>Recipient: <strong className="text-slate-200">{notif.to}</strong></span>
                          <span>•</span>
                          <span>Amount: <strong className="text-emerald-400">${notif.amountPaid}</strong></span>
                        </p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <button
                          onClick={() => setSelectedEmailForModal(notif)}
                          className="px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 text-white font-bold text-xs transition-all flex items-center gap-2 shadow-sm"
                        >
                          <FileText className="w-4 h-4 text-amber-400" />
                          <span>View Email & Cloud Logs</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* Modal render for Email Preview */}
        {selectedEmailForModal && (
          <EmailPreviewModal
            notification={selectedEmailForModal}
            onClose={() => setSelectedEmailForModal(null)}
            onResend={async (notif) => {
              if (courses.length > 0) {
                const targetCourse = courses.find(c => c.id === notif.courseId) || courses[0];
                await sendCourseEnrollmentEmail(targetCourse, {
                  id: `rcpt-${Date.now()}`,
                  courseId: targetCourse.id,
                  courseTitle: targetCourse.title,
                  amountPaid: notif.amountPaid,
                  paymentMethod: notif.paymentMethod,
                  transactionId: notif.transactionId,
                  studentEmail: notif.to,
                  studentName: notif.studentName,
                  paidAt: new Date().toISOString()
                });
              }
            }}
          />
        )}

        {/* =========================================
            PAGE 4: ACCOUNT SETTING
           ========================================= */}
        {activeTab === 'settings' && (
          <div className="space-y-8 animate-in fade-in duration-200 max-w-4xl mx-auto">
            
            {/* Section 1: Change Password */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Change Account Password</h3>
                  <p className="text-xs text-slate-400">Ensure your student credentials remain secure</p>
                </div>
              </div>

              {passwordMsg.text && (
                <div className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
                  passwordMsg.type === 'error' ? 'bg-rose-500/10 border border-rose-500/30 text-rose-300' : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                }`}>
                  {passwordMsg.type === 'error' ? <AlertCircle className="w-4 h-4 text-rose-400" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  <span>{passwordMsg.text}</span>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4 max-w-lg">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Current Password</label>
                  <input
                    type="password"
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">New Password</label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat new password"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs shadow-md"
                >
                  Update Password
                </button>
              </form>
            </div>

            {/* Section 2: Notification Preferences */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-sky-400/10 border border-sky-400/30 flex items-center justify-center text-sky-400">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Notification Preferences</h3>
                  <p className="text-xs text-slate-400">Choose what email alerts you receive</p>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between p-3.5 bg-slate-950 border border-slate-800 rounded-2xl">
                  <div>
                    <span className="font-bold text-white block">Course Announcement & Modules</span>
                    <span className="text-slate-400">Get notified when new lectures or source files are uploaded</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifCourse}
                    onChange={(e) => setNotifCourse(e.target.checked)}
                    className="w-4 h-4 accent-amber-400 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 bg-slate-950 border border-slate-800 rounded-2xl">
                  <div>
                    <span className="font-bold text-white block">Live Consultation Reminders</span>
                    <span className="text-slate-400">Receive Zoom calendar reminders before scheduled sessions</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifReminders}
                    onChange={(e) => setNotifReminders(e.target.checked)}
                    className="w-4 h-4 accent-amber-400 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 bg-slate-950 border border-slate-800 rounded-2xl">
                  <div>
                    <span className="font-bold text-white block">Certificate Issuance Alerts</span>
                    <span className="text-slate-400">Get emailed when a new course completion certificate is generated</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifCertificates}
                    onChange={(e) => setNotifCertificates(e.target.checked)}
                    className="w-4 h-4 accent-amber-400 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Paid Invoices & Transaction History */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Payment History & Invoices</h3>
                  <p className="text-xs text-slate-400">View paid course transactions and download receipts</p>
                </div>
              </div>

              {myReceipts.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400 bg-slate-950 rounded-2xl border border-slate-800">
                  No payment receipts recorded yet. Purchased course invoices will appear here.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950 text-slate-400 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="p-3">Course</th>
                        <th className="p-3">Txn ID</th>
                        <th className="p-3">Amount</th>
                        <th className="p-3">Method</th>
                        <th className="p-3">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {myReceipts.map(rcpt => (
                        <tr key={rcpt.id} className="hover:bg-slate-850">
                          <td className="p-3 font-bold text-white">{rcpt.courseTitle}</td>
                          <td className="p-3 font-mono text-amber-400">{rcpt.transactionId}</td>
                          <td className="p-3 text-emerald-400 font-bold">${rcpt.amountPaid}</td>
                          <td className="p-3">{rcpt.paymentMethod}</td>
                          <td className="p-3 text-slate-400">{new Date(rcpt.paidAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* =========================================
            PAGE 4: SIGN OUT
           ========================================= */}
        {activeTab === 'signout' && (
          <div className="max-w-xl mx-auto py-12 animate-in zoom-in-95 duration-200">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 text-center space-y-6 shadow-2xl">
              <div className="w-20 h-20 rounded-3xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
                <LogOut className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-extrabold text-white">Sign Out of Student Account?</h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Are you sure you want to log out, <span className="text-white font-bold">{currentUserName}</span>? Your course progress and active certificates will remain safely stored.
                </p>
              </div>

              <div className="flex items-center justify-center gap-4 pt-2">
                <button
                  onClick={() => setActiveTab('courses')}
                  className="px-6 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700 transition-all"
                >
                  Stay Signed In
                </button>
                <button
                  onClick={() => {
                    studentLogout();
                    navigate('home');
                  }}
                  className="px-6 py-3 rounded-xl bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-500/20 hover:bg-rose-600 transition-all"
                >
                  Confirm Sign Out
                </button>
              </div>
            </div>
          </div>
        )}

      </section>

      {/* Certificate Modal Component */}
      {certificateModalData.isOpen && (
        <CertificateModal
          courseTitle={certificateModalData.courseTitle}
          studentName={currentUserName}
          certificateId={certificateModalData.certificateId}
          completionDate={certificateModalData.date}
          onClose={() => setCertificateModalData(prev => ({ ...prev, isOpen: false }))}
        />
      )}

    </div>
  );
};
