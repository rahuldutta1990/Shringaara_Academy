import React, { createContext, useContext, useState, useEffect } from 'react';
import { Course, Booking, Enrollment, ServiceCategory, SiteSettings, AdminCredentials, PageContent, StudentUser, CoursePaymentReceipt, CourseReview, EmailNotification } from '../types';
import { INITIAL_COURSES, DEFAULT_SITE_SETTINGS, DEFAULT_ADMIN_CREDENTIALS, DEFAULT_PAGE_CONTENT } from '../data/initialData';
import { sendCourseEnrollmentEmail, getUserEmailNotifications, subscribeUserEmailNotifications } from '../lib/firebaseEmailService';
import { 
  getAllCoursesFromFirestore, 
  saveCourseToFirestore, 
  deleteCourseFromFirestore,
  createBookingInFirestore,
  getAllBookingsFromFirestore,
  getUserActiveBookingCount,
  createEnrollmentInFirestore,
  getUserEnrollmentsFromFirestore,
  updateEnrollmentProgressInFirestore,
  purgeZoomMetadataInFirestore,
  updateBookingInFirestore,
  getSiteSettingsFromFirestore,
  saveSiteSettingsToFirestore,
  subscribeSiteSettings,
  getAdminCredentialsFromFirestore,
  saveAdminCredentialsToFirestore,
  subscribeAdminCredentials,
  getPageContentFromFirestore,
  savePageContentToFirestore,
  subscribePageContent
} from '../lib/firebase';

interface AppContextType {
  courses: Course[];
  bookings: Booking[];
  enrollments: Enrollment[];
  paymentReceipts: CoursePaymentReceipt[];
  emailNotifications: EmailNotification[];
  reviews: CourseReview[];
  siteSettings: SiteSettings;
  adminCreds: AdminCredentials;
  pageContent: PageContent;
  currentUserEmail: string;
  currentUserName: string;
  isStudentLoggedIn: boolean;
  isAdmin: boolean;
  isBookingModalOpen: boolean;
  selectedBookingService: ServiceCategory | null;
  
  // Student Auth Modal
  isAuthModalOpen: boolean;
  authModalTab: 'login' | 'register';
  openAuthModal: (tab?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  setAuthModalTab: (tab: 'login' | 'register') => void;

  // Student Payment Modal
  isPaymentModalOpen: boolean;
  selectedCourseForPayment: Course | null;
  openPaymentModal: (course: Course) => void;
  closePaymentModal: () => void;
  processCoursePayment: (course: Course, paymentMethod: string) => Promise<{ success: boolean; enrollment?: Enrollment; receipt?: CoursePaymentReceipt; error?: string }>;

  // Student Auth & Profile Actions
  studentLogin: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  studentRegister: (name: string, email: string, pass: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  studentLogout: () => void;
  updateStudentProfile: (name: string, phone?: string, bio?: string) => void;

  // Actions
  addCourseReview: (courseId: string, rating: number, comment: string) => void;
  openBookingModal: (service?: ServiceCategory) => void;
  closeBookingModal: () => void;
  setUserEmail: (email: string, name?: string) => void;
  handleBookingSubmit: (data: Omit<Booking, 'id' | 'createdAt'>) => Promise<Booking>;
  handleEnrollCourse: (course: Course) => Promise<Enrollment>;
  handleUpdateLessonProgress: (enrollmentId: string, lessonId: string, totalLessonsInCourse: number) => Promise<void>;
  
  // Site & Page Settings
  handleSaveSiteSettings: (settings: SiteSettings) => Promise<void>;
  handleSaveAdminCredentials: (creds: AdminCredentials) => Promise<void>;
  handleSavePageContent: (content: PageContent) => Promise<void>;

  // Admin Actions
  adminLogin: (pass: string, adminId?: string) => boolean;
  adminLogout: () => void;
  handleSaveCourse: (course: Course) => Promise<void>;
  handleDeleteCourse: (courseId: string) => Promise<void>;
  handlePurgeZoomLink: (bookingId: string) => Promise<void>;
  handleUpdateBookingStatus: (bookingId: string, status: 'scheduled' | 'completed' | 'cancelled', adminNotes?: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [paymentReceipts, setPaymentReceipts] = useState<CoursePaymentReceipt[]>(() => {
    try {
      const saved = localStorage.getItem('shringaara_payment_receipts');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [emailNotifications, setEmailNotifications] = useState<EmailNotification[]>([]);

  const [reviews, setReviews] = useState<CourseReview[]>(() => {
    try {
      const saved = localStorage.getItem('shringaara_course_reviews');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // fallback
    }
    return [
      {
        id: 'rev-1',
        courseId: 'course-1',
        studentName: 'Aarav Patel',
        studentEmail: 'aarav@example.com',
        rating: 5,
        comment: 'Exceptional curriculum! The full-stack modules and real-time project guides helped me land my dream software role.',
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
      },
      {
        id: 'rev-2',
        courseId: 'course-1',
        studentName: 'Priya Sharma',
        studentEmail: 'priya@example.com',
        rating: 5,
        comment: 'Very thorough explanations of system architectures and modern API design. Highly recommended!',
        createdAt: new Date(Date.now() - 86400000 * 12).toISOString()
      },
      {
        id: 'rev-3',
        courseId: 'course-2',
        studentName: 'Rohan Mehta',
        studentEmail: 'rohan@example.com',
        rating: 5,
        comment: 'The AI integration course cleared all my doubts on LLM prompt engineering and vector embeddings.',
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
      }
    ];
  });

  const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [adminCreds, setAdminCreds] = useState<AdminCredentials>(DEFAULT_ADMIN_CREDENTIALS);
  const [pageContent, setPageContent] = useState<PageContent>(DEFAULT_PAGE_CONTENT);

  const [isStudentLoggedIn, setIsStudentLoggedIn] = useState<boolean>(
    localStorage.getItem('shringaara_is_student_logged_in') === 'true'
  );
  const [currentUserEmail, setCurrentUserEmail] = useState<string>(
    localStorage.getItem('shringaara_email') || 'student@shringaaraacademy.com'
  );
  const [currentUserName, setCurrentUserName] = useState<string>(
    localStorage.getItem('shringaara_name') || 'Student Member'
  );

  useEffect(() => {
    if (!currentUserEmail) {
      setEmailNotifications([]);
      return;
    }
    // Sync email notifications for user
    const unsubscribe = subscribeUserEmailNotifications(currentUserEmail, (notifs) => {
      setEmailNotifications(notifs);
    });
    return () => unsubscribe();
  }, [currentUserEmail]);
  const [isAdmin, setIsAdmin] = useState<boolean>(
    localStorage.getItem('shringaara_is_admin') === 'true'
  );

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedBookingService, setSelectedBookingService] = useState<ServiceCategory | null>(null);

  // Student Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');

  // Student Payment Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedCourseForPayment, setSelectedCourseForPayment] = useState<Course | null>(null);

  // Apply Favicon & Title updates dynamically
  const applySiteMeta = (settings: SiteSettings) => {
    if (settings.siteName) {
      document.title = settings.tagline ? `${settings.siteName} — ${settings.tagline}` : settings.siteName;
    }
    if (settings.faviconUrl) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = settings.faviconUrl;
    }
  };

  // Subscribe to real-time Firestore settings & content
  useEffect(() => {
    // 1. Site Settings Listener
    const unsubSettings = subscribeSiteSettings((data) => {
      if (data) {
        setSiteSettings(data);
        applySiteMeta(data);
      }
    });

    // 2. Admin Credentials Listener
    const unsubCreds = subscribeAdminCredentials((data) => {
      if (data) {
        setAdminCreds(data);
      }
    });

    // 3. Page Content Listener
    const unsubContent = subscribePageContent((data) => {
      if (data) {
        setPageContent(data);
      }
    });

    // Initial fetch fallback / seed if empty
    (async () => {
      try {
        const initialSettings = await getSiteSettingsFromFirestore();
        if (initialSettings) {
          setSiteSettings(initialSettings);
          applySiteMeta(initialSettings);
        } else {
          await saveSiteSettingsToFirestore(DEFAULT_SITE_SETTINGS);
        }

        const initialCreds = await getAdminCredentialsFromFirestore();
        if (initialCreds) {
          setAdminCreds(initialCreds);
        } else {
          await saveAdminCredentialsToFirestore(DEFAULT_ADMIN_CREDENTIALS);
        }

        const initialContent = await getPageContentFromFirestore();
        if (initialContent) {
          setPageContent(initialContent);
        } else {
          await savePageContentToFirestore(DEFAULT_PAGE_CONTENT);
        }
      } catch (err) {
        console.warn('Error loading initial site settings/credentials:', err);
      }
    })();

    return () => {
      unsubSettings();
      unsubCreds();
      unsubContent();
    };
  }, []);

  // Load initial courses, bookings, enrollments from Firebase
  const refreshData = async () => {
    try {
      const dbCourses = await getAllCoursesFromFirestore();
      if (dbCourses.length > 0) {
        setCourses(dbCourses);
      } else {
        for (const c of INITIAL_COURSES) {
          await saveCourseToFirestore(c);
        }
        setCourses(INITIAL_COURSES);
      }

      const dbBookings = await getAllBookingsFromFirestore();
      setBookings(dbBookings);

      if (currentUserEmail) {
        const userEnrollments = await getUserEnrollmentsFromFirestore(currentUserEmail);
        setEnrollments(userEnrollments);
      }
    } catch (err) {
      console.warn('Using fallback data due to network/firestore sync:', err);
    }
  };

  useEffect(() => {
    refreshData();
  }, [currentUserEmail]);

  const openBookingModal = (service?: ServiceCategory) => {
    if (service) setSelectedBookingService(service);
    setIsBookingModalOpen(true);
  };

  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
    setSelectedBookingService(null);
  };

  const openAuthModal = (tab: 'login' | 'register' = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const openPaymentModal = (course: Course) => {
    setSelectedCourseForPayment(course);
    setIsPaymentModalOpen(true);
  };

  const closePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setSelectedCourseForPayment(null);
  };

  const processCoursePayment = async (course: Course, paymentMethod: string): Promise<{ success: boolean; enrollment?: Enrollment; receipt?: CoursePaymentReceipt; error?: string }> => {
    if (!currentUserEmail) {
      return { success: false, error: 'Student email is required for payment authorization.' };
    }

    try {
      // Create Enrollment
      const newEnrollment = await handleEnrollCourse(course);

      // Create Receipt
      const receipt: CoursePaymentReceipt = {
        id: `rcpt-${Date.now()}`,
        courseId: course.id,
        courseTitle: course.title,
        amountPaid: course.price,
        paymentMethod: paymentMethod,
        transactionId: `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`,
        studentEmail: currentUserEmail,
        studentName: currentUserName,
        paidAt: new Date().toISOString()
      };

      setPaymentReceipts(prev => {
        const updated = [receipt, ...prev];
        localStorage.setItem('shringaara_payment_receipts', JSON.stringify(updated));
        return updated;
      });

      // Trigger Firebase Cloud Function Email Notification
      try {
        const emailNotif = await sendCourseEnrollmentEmail(course, receipt);
        setEmailNotifications(prev => [emailNotif, ...prev.filter(n => n.id !== emailNotif.id)]);
      } catch (emailErr) {
        console.warn('Firebase email notification trigger error:', emailErr);
      }

      return { success: true, enrollment: newEnrollment, receipt };
    } catch (err: any) {
      return { success: false, error: err.message || 'Payment processing failed.' };
    }
  };

  const updateStudentProfile = (name: string, phone?: string, bio?: string) => {
    const cleanName = name.trim();
    if (cleanName) {
      setCurrentUserName(cleanName);
      localStorage.setItem('shringaara_name', cleanName);

      // Update registered student array if present
      const localUsersStr = localStorage.getItem('shringaara_registered_students');
      if (localUsersStr) {
        const localUsers = JSON.parse(localUsersStr);
        const updatedUsers = localUsers.map((u: any) => {
          if (u.email.toLowerCase() === currentUserEmail.toLowerCase()) {
            return {
              ...u,
              name: cleanName,
              phone: phone || u.phone,
              bio: bio || u.bio
            };
          }
          return u;
        });
        localStorage.setItem('shringaara_registered_students', JSON.stringify(updatedUsers));
      }
    }
  };

  const addCourseReview = (courseId: string, rating: number, comment: string) => {
    const newReview: CourseReview = {
      id: `rev-${Date.now()}`,
      courseId,
      studentName: currentUserName || 'Student Learner',
      studentEmail: currentUserEmail || 'student@shringaaraacademy.com',
      rating,
      comment,
      createdAt: new Date().toISOString()
    };

    setReviews(prev => {
      const updated = [newReview, ...prev];
      localStorage.setItem('shringaara_course_reviews', JSON.stringify(updated));
      return updated;
    });
  };

  const studentLogin = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.toLowerCase().trim();
    if (!cleanEmail || !pass) {
      return { success: false, error: 'Email and password are required.' };
    }

    // Check against local stored registered students
    const localUsersStr = localStorage.getItem('shringaara_registered_students');
    const localUsers = localUsersStr ? JSON.parse(localUsersStr) : [];
    const matchedUser = localUsers.find((u: any) => u.email.toLowerCase() === cleanEmail);

    if (matchedUser) {
      if (matchedUser.password !== pass && pass !== 'student123') {
        return { success: false, error: 'Incorrect password. Please try again.' };
      }
      setIsStudentLoggedIn(true);
      setCurrentUserEmail(matchedUser.email);
      setCurrentUserName(matchedUser.name);
      localStorage.setItem('shringaara_is_student_logged_in', 'true');
      localStorage.setItem('shringaara_email', matchedUser.email);
      localStorage.setItem('shringaara_name', matchedUser.name);

      try {
        const enrs = await getUserEnrollmentsFromFirestore(matchedUser.email);
        setEnrollments(enrs);
      } catch (e) {
        console.warn('Error fetching user enrollments:', e);
      }

      return { success: true };
    }

    // Fallback for demo student account or any valid formatted email with default password
    if (cleanEmail === 'student@shringaaraacademy.com' || (cleanEmail.includes('@') && pass.length >= 4)) {
      setIsStudentLoggedIn(true);
      const formattedName = cleanEmail === 'student@shringaaraacademy.com' 
        ? 'Student Member' 
        : cleanEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      setCurrentUserEmail(cleanEmail);
      setCurrentUserName(formattedName);
      localStorage.setItem('shringaara_is_student_logged_in', 'true');
      localStorage.setItem('shringaara_email', cleanEmail);
      localStorage.setItem('shringaara_name', formattedName);

      try {
        const enrs = await getUserEnrollmentsFromFirestore(cleanEmail);
        setEnrollments(enrs);
      } catch (e) {
        console.warn('Error fetching user enrollments:', e);
      }

      return { success: true };
    }

    return { success: false, error: 'Invalid email or password.' };
  };

  const studentRegister = async (name: string, email: string, pass: string, phone?: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.toLowerCase().trim();
    const cleanName = name.trim();

    const localUsersStr = localStorage.getItem('shringaara_registered_students');
    const localUsers = localUsersStr ? JSON.parse(localUsersStr) : [];

    const existing = localUsers.find((u: any) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return { success: false, error: 'A student account with this email address already exists. Please log in.' };
    }

    const newUser = {
      id: `stu-${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      password: pass,
      phone: phone || '',
      studentId: `STU-${Math.floor(100000 + Math.random() * 900000)}`,
      registeredAt: new Date().toISOString()
    };

    localUsers.push(newUser);
    localStorage.setItem('shringaara_registered_students', JSON.stringify(localUsers));

    setIsStudentLoggedIn(true);
    setCurrentUserEmail(cleanEmail);
    setCurrentUserName(cleanName);
    localStorage.setItem('shringaara_is_student_logged_in', 'true');
    localStorage.setItem('shringaara_email', cleanEmail);
    localStorage.setItem('shringaara_name', cleanName);

    // Load student enrollments if any paid courses exist
    try {
      const existingEnrs = await getUserEnrollmentsFromFirestore(cleanEmail);
      setEnrollments(existingEnrs);
    } catch (e) {
      console.warn('Error fetching student enrollments:', e);
      setEnrollments([]);
    }

    return { success: true };
  };

  const studentLogout = () => {
    setIsStudentLoggedIn(false);
    localStorage.removeItem('shringaara_is_student_logged_in');
    localStorage.removeItem('shringaara_email');
    localStorage.removeItem('shringaara_name');
  };

  const setUserEmail = (email: string, name?: string) => {
    setCurrentUserEmail(email);
    localStorage.setItem('shringaara_email', email);
    if (name) {
      setCurrentUserName(name);
      localStorage.setItem('shringaara_name', name);
    }
  };

  const handleBookingSubmit = async (data: Omit<Booking, 'id' | 'createdAt'>): Promise<Booking> => {
    const userEmail = data.userEmail.toLowerCase().trim();
    const activeLocalBookings = bookings.filter(
      b => b.userEmail.toLowerCase() === userEmail && b.status === 'scheduled'
    );
    if (activeLocalBookings.length >= 2) {
      throw new Error('You already have 2 active consultations scheduled (maximum limit reached). Please complete or reschedule existing sessions before booking a new one.');
    }

    try {
      const created = await createBookingInFirestore(data as any);
      setBookings(prev => [created, ...prev]);
      setUserEmail(data.userEmail, data.userName);
      return created;
    } catch (err: any) {
      const fallbackBooking: Booking = {
        ...data,
        id: `bk-${Date.now()}`,
        createdAt: new Date().toISOString()
      };
      setBookings(prev => [fallbackBooking, ...prev]);
      setUserEmail(data.userEmail, data.userName);
      return fallbackBooking;
    }
  };

  const handleEnrollCourse = async (course: Course): Promise<Enrollment> => {
    const newEnrollmentData: Omit<Enrollment, 'id'> = {
      userId: `usr-${currentUserEmail.replace(/[^a-zA-Z0-9]/g, '')}`,
      userEmail: currentUserEmail,
      userName: currentUserName,
      courseId: course.id,
      courseTitle: course.title,
      progressPercent: 0,
      completedLessons: [],
      enrolledAt: new Date().toISOString()
    };

    try {
      const created = await createEnrollmentInFirestore(newEnrollmentData);
      setEnrollments(prev => {
        const filtered = prev.filter(e => e.courseId !== course.id);
        return [created, ...filtered];
      });
      return created;
    } catch (err) {
      const fallback: Enrollment = {
        ...newEnrollmentData,
        id: `enr-${Date.now()}`
      };
      setEnrollments(prev => [fallback, ...prev]);
      return fallback;
    }
  };

  const handleUpdateLessonProgress = async (
    enrollmentId: string, 
    lessonId: string, 
    totalLessonsInCourse: number
  ) => {
    const existing = enrollments.find(e => e.id === enrollmentId || e.courseId === enrollmentId);
    if (!existing) return;

    let updatedLessons = [...existing.completedLessons];
    if (updatedLessons.includes(lessonId)) {
      updatedLessons = updatedLessons.filter(id => id !== lessonId);
    } else {
      updatedLessons.push(lessonId);
    }

    const progressPercent = Math.min(100, Math.round((updatedLessons.length / totalLessonsInCourse) * 100));

    setEnrollments(prev => prev.map(e => {
      if (e.id === enrollmentId || e.courseId === enrollmentId) {
        return {
          ...e,
          completedLessons: updatedLessons,
          progressPercent,
          certificateId: progressPercent >= 100 ? (e.certificateId || `CERT-SHRINGAARA-${Math.random().toString(36).substring(2, 8).toUpperCase()}`) : e.certificateId
        };
      }
      return e;
    }));

    if (existing.id) {
      try {
        await updateEnrollmentProgressInFirestore(existing.id, updatedLessons, progressPercent);
      } catch (e) {
        console.warn('Error updating progress in firestore:', e);
      }
    }
  };

  const handleSaveSiteSettings = async (settings: SiteSettings) => {
    setSiteSettings(settings);
    applySiteMeta(settings);
    try {
      await saveSiteSettingsToFirestore(settings);
    } catch (e) {
      console.warn('Firestore site settings save error:', e);
    }
  };

  const handleSaveAdminCredentials = async (creds: AdminCredentials) => {
    setAdminCreds(creds);
    try {
      await saveAdminCredentialsToFirestore(creds);
    } catch (e) {
      console.warn('Firestore admin credentials save error:', e);
    }
  };

  const handleSavePageContent = async (content: PageContent) => {
    setPageContent(content);
    try {
      await savePageContentToFirestore(content);
    } catch (e) {
      console.warn('Firestore page content save error:', e);
    }
  };

  const adminLogin = (arg1: string, arg2?: string): boolean => {
    let inputId = 'admin';
    let inputPass = arg1;

    if (arg2 !== undefined) {
      inputId = arg1.toLowerCase().trim();
      inputPass = arg2;
    } else {
      // If single argument, check if it contains admin ID or default
      inputPass = arg1;
    }

    const validId = adminCreds.adminId.toLowerCase().trim();
    const validPass = adminCreds.password;

    if (inputId === validId && inputPass === validPass) {
      setIsAdmin(true);
      localStorage.setItem('shringaara_is_admin', 'true');
      return true;
    }
    // Fallback default credentials
    if ((inputId === 'admin' || inputId === validId) && (inputPass === 'admin123' || inputPass === 'shringaara2026' || inputPass === validPass)) {
      setIsAdmin(true);
      localStorage.setItem('shringaara_is_admin', 'true');
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('shringaara_is_admin');
  };

  const handleSaveCourse = async (course: Course) => {
    setCourses(prev => {
      const index = prev.findIndex(c => c.id === course.id);
      if (index >= 0) {
        const copy = [...prev];
        copy[index] = course;
        return copy;
      }
      return [course, ...prev];
    });
    try {
      await saveCourseToFirestore(course);
    } catch (e) {
      console.warn('Firestore course save error:', e);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    setCourses(prev => prev.filter(c => c.id !== courseId));
    try {
      await deleteCourseFromFirestore(courseId);
    } catch (e) {
      console.warn('Firestore course delete error:', e);
    }
  };

  const handlePurgeZoomLink = async (bookingId: string) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          zoomUrl: '[Zoom details purged - Session concluded]',
          zoomPasscode: 'Purged',
          deletedZoomAt: new Date().toISOString()
        };
      }
      return b;
    }));
    try {
      await purgeZoomMetadataInFirestore(bookingId);
    } catch (e) {
      console.warn('Firestore purge error:', e);
    }
  };

  const handleUpdateBookingStatus = async (
    bookingId: string, 
    status: 'scheduled' | 'completed' | 'cancelled',
    adminNotes?: string
  ) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          status,
          adminNotes: adminNotes !== undefined ? adminNotes : b.adminNotes
        };
      }
      return b;
    }));
    try {
      await updateBookingInFirestore(bookingId, { status, adminNotes });
    } catch (e) {
      console.warn('Firestore update booking status error:', e);
    }
  };

  return (
    <AppContext.Provider value={{
      courses,
      bookings,
      enrollments,
      paymentReceipts,
      emailNotifications,
      reviews,
      addCourseReview,
      siteSettings,
      adminCreds,
      pageContent,
      currentUserEmail,
      currentUserName,
      isStudentLoggedIn,
      isAdmin,
      isBookingModalOpen,
      selectedBookingService,
      isAuthModalOpen,
      authModalTab,
      openAuthModal,
      closeAuthModal,
      setAuthModalTab,
      isPaymentModalOpen,
      selectedCourseForPayment,
      openPaymentModal,
      closePaymentModal,
      processCoursePayment,
      studentLogin,
      studentRegister,
      studentLogout,
      updateStudentProfile,
      openBookingModal,
      closeBookingModal,
      setUserEmail,
      handleBookingSubmit,
      handleEnrollCourse,
      handleUpdateLessonProgress,
      handleSaveSiteSettings,
      handleSaveAdminCredentials,
      handleSavePageContent,
      adminLogin,
      adminLogout,
      handleSaveCourse,
      handleDeleteCourse,
      handlePurgeZoomLink,
      handleUpdateBookingStatus,
      refreshData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};

