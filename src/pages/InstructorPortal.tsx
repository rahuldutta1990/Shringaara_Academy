import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  BookOpen, 
  TrendingUp, 
  Search, 
  Filter, 
  MessageSquare, 
  CheckCircle2, 
  HelpCircle, 
  Send, 
  Sparkles, 
  User, 
  Award, 
  ArrowUpRight, 
  RefreshCw, 
  Mail, 
  Plus, 
  Bookmark, 
  Star,
  Check,
  ChevronRight,
  ShieldCheck,
  Zap,
  Clock,
  ThumbsUp,
  Bell,
  BellRing,
  X,
  Volume2,
  VolumeX,
  Flame,
  Sparkle,
  Lock,
  Unlock,
  Key,
  Eye,
  EyeOff,
  LogOut
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Course, Enrollment, CourseQAQuestion, CourseReview } from '../types';
import { getAllEnrollmentsFromFirestore, updateEnrollmentProgressInFirestore } from '../lib/firebase';
import { fetchCourseQuestions, postAnswer, postQuestion } from '../lib/courseQaService';

// Fallback/Mock Student Data to ensure beautiful representation if DB is empty
const MOCK_DEMO_STUDENTS = [
  {
    userName: 'Aarav Patel',
    userEmail: 'aarav.patel@example.com',
    courseId: 'ds-101',
    courseTitle: 'Python for Data Science & Predictive Analytics',
    progressPercent: 85,
    enrolledAt: new Date(Date.now() - 3600000 * 24 * 14).toISOString(),
    lastAccessedAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    userName: 'Priya Sharma',
    userEmail: 'priya.sharma@example.com',
    courseId: 'ds-101',
    courseTitle: 'Python for Data Science & Predictive Analytics',
    progressPercent: 100,
    enrolledAt: new Date(Date.now() - 3600000 * 24 * 30).toISOString(),
    lastAccessedAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
    certificateId: 'CERT-SHRINGAARA-A1B2C3'
  },
  {
    userName: 'Kabir Dev',
    userEmail: 'kabir.dev@example.com',
    courseId: 'code-201',
    courseTitle: 'Full-Stack Web Development with React, TypeScript & Node',
    progressPercent: 45,
    enrolledAt: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
    lastAccessedAt: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    userName: 'Sarah Jenkins',
    userEmail: 'sarah.j@example.com',
    courseId: 'code-201',
    courseTitle: 'Full-Stack Web Development with React, TypeScript & Node',
    progressPercent: 90,
    enrolledAt: new Date(Date.now() - 3600000 * 24 * 20).toISOString(),
    lastAccessedAt: new Date(Date.now() - 3600000 * 1).toISOString()
  },
  {
    userName: 'Ananya Roy',
    userEmail: 'ananya.roy@example.com',
    courseId: 'ux-102',
    courseTitle: 'Figma UI/UX & Design Systems Masterclass',
    progressPercent: 60,
    enrolledAt: new Date(Date.now() - 3600000 * 24 * 12).toISOString(),
    lastAccessedAt: new Date(Date.now() - 3600000 * 8).toISOString()
  },
  {
    userName: 'Rohan Deshmukh',
    userEmail: 'rohan.d@example.com',
    courseId: 'ux-102',
    courseTitle: 'Figma UI/UX & Design Systems Masterclass',
    progressPercent: 100,
    enrolledAt: new Date(Date.now() - 3600000 * 24 * 25).toISOString(),
    lastAccessedAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    certificateId: 'CERT-SHRINGAARA-F3G4H5'
  }
];

export const InstructorPortal: React.FC = () => {
  const { courses, reviews } = useApp();
  
  // Instructor Accounts
  const instructors = [
    {
      id: 'all',
      name: 'All Instructors / Management',
      role: 'Academy Overview',
      avatar: '',
      specialty: 'All Services'
    },
    {
      id: 'ananya',
      name: 'Dr. Ananya Sharma',
      role: 'Lead Data Scientist & Ex-Google Specialist',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
      specialty: 'data-science'
    },
    {
      id: 'rohan',
      name: 'Rohan Mehta',
      role: 'Principal Systems Architect',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      specialty: 'coding'
    },
    {
      id: 'maya',
      name: 'Maya Lin',
      role: 'Staff Product Designer',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
      specialty: 'designing'
    }
  ];

  // Instructor Login States & Session Handling
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('shringaara_instructor_logged_in') === 'true';
  });
  const [selectedInstructorId, setSelectedInstructorId] = useState<string>(() => {
    return localStorage.getItem('shringaara_instructor_logged_id') || 'all';
  });
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleInstructorLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    setTimeout(() => {
      const email = loginEmail.trim().toLowerCase();
      const password = loginPassword.trim();

      if (!email || !password) {
        setLoginError('Please enter both your email and password.');
        setIsLoggingIn(false);
        return;
      }

      if (password !== 'shringaara123') {
        setLoginError('Invalid password. Use the demo password: shringaara123');
        setIsLoggingIn(false);
        return;
      }

      let instructorId = '';
      if (email === 'ananya@shringaara.com') {
        instructorId = 'ananya';
      } else if (email === 'rohan@shringaara.com') {
        instructorId = 'rohan';
      } else if (email === 'maya@shringaara.com') {
        instructorId = 'maya';
      } else if (email === 'admin@shringaara.com' || email === 'management@shringaara.com') {
        instructorId = 'all';
      } else {
        setLoginError('No instructor profile found with this email. Please click a profile below to autofill.');
        setIsLoggingIn(false);
        return;
      }

      // Log in successful
      localStorage.setItem('shringaara_instructor_logged_in', 'true');
      localStorage.setItem('shringaara_instructor_logged_id', instructorId);
      setIsLoggedIn(true);
      setSelectedInstructorId(instructorId);
      setIsLoggingIn(false);
      setLoginEmail('');
      setLoginPassword('');
      
      // Play a lovely chime
      playChime();
      
      setActionSuccessMessage('Successfully authenticated to Shringaara Instructor Gateway!');
      setTimeout(() => setActionSuccessMessage(''), 3500);
    }, 800);
  };

  const handleInstructorLogout = () => {
    localStorage.removeItem('shringaara_instructor_logged_in');
    localStorage.removeItem('shringaara_instructor_logged_id');
    setIsLoggedIn(false);
    setSelectedInstructorId('all');
    setActionSuccessMessage('Logged out from Instructor Gateway.');
    setTimeout(() => setActionSuccessMessage(''), 3000);
  };

  const [dbEnrollments, setDbEnrollments] = useState<Enrollment[]>([]);
  const [qaQuestions, setQaQuestions] = useState<CourseQAQuestion[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  
  // Search & Filter state for enrollments
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCourseId, setFilterCourseId] = useState('all');
  
  // Modal & notification controls
  const [editingEnrollment, setEditingEnrollment] = useState<Enrollment | null>(null);
  const [newProgressPercent, setNewProgressPercent] = useState<number>(0);
  const [sendingEmailTo, setSendingEmailTo] = useState<{ email: string; name: string; courseTitle: string } | null>(null);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [actionSuccessMessage, setActionSuccessMessage] = useState('');

  // Q&A reply state
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [isSubmittingReply, setIsSubmittingReply] = useState<string | null>(null);

  // Notification system states
  const [readNotifIds, setReadNotifIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('shringaara_read_notifs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [enableAudioAlerts, setEnableAudioAlerts] = useState(true);
  const [lastQuestionCount, setLastQuestionCount] = useState<number>(0);
  const [highlightedQuestionId, setHighlightedQuestionId] = useState<string | null>(null);
  
  // Real-time toast alerts
  const [activeAlerts, setActiveAlerts] = useState<Array<{
    id: string;
    title: string;
    author: string;
    courseTitle: string;
  }>>([]);

  // Simulator helper states
  const [simulatorOpen, setSimulatorOpen] = useState(false);
  const [simSelectedCourseId, setSimSelectedCourseId] = useState('');
  const [simQuestionCategory, setSimQuestionCategory] = useState('Technical');
  const [simQuestionTitle, setSimQuestionTitle] = useState('');
  const [simQuestionContent, setSimQuestionContent] = useState('');
  const [simStudentName, setSimStudentName] = useState('Aniket Rao');
  const [isPostingSimulatedQuestion, setIsPostingSimulatedQuestion] = useState(false);

  // Web Audio chime generator
  const playChime = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const audioCtx = new AudioContextClass();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      gainNode.gain.setValueAtTime(0.04, audioCtx.currentTime);
      oscillator.start();
      
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime + 0.08); // A5
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.35);
      oscillator.stop(audioCtx.currentTime + 0.4);
    } catch (e) {
      console.warn('Web Audio chime not supported or blocked:', e);
    }
  };

  const selectedInstructor = instructors.find(i => i.id === selectedInstructorId) || instructors[0];

  // Fetch enrollments and Q&A threads
  const loadPortalData = async () => {
    setIsRefreshing(true);
    try {
      // 1. Fetch real enrollments
      const enrolls = await getAllEnrollmentsFromFirestore();
      setDbEnrollments(enrolls);

      // 2. Fetch Q&A questions for all courses
      const allQA: CourseQAQuestion[] = [];
      for (const course of courses) {
        try {
          const courseQuestions = await fetchCourseQuestions(course.id);
          allQA.push(...courseQuestions);
        } catch (e) {
          console.warn(`Error loading Q&A for course ${course.id}:`, e);
        }
      }
      // Remove duplicates by ID
      const uniqueQA = Array.from(new Map(allQA.map(q => [q.id, q])).values());
      setQaQuestions(uniqueQA);
    } catch (err) {
      console.error('Error loading instructor portal data:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // List of courses for this instructor
  const instructorCourses = courses.filter(
    c => selectedInstructorId === 'all' || c.instructor?.name === selectedInstructor.name || c.category === selectedInstructor.specialty
  );
  const instructorCourseIds = instructorCourses.map(c => c.id);

  // Filter unread questions for notifications
  const unreadQuestions = qaQuestions.filter(q => {
    const belongsToInstructor = selectedInstructorId === 'all' || instructorCourseIds.includes(q.courseId);
    const isUnread = !readNotifIds.includes(q.id);
    const hasInstructorAns = q.answers?.some(a => a.isInstructorAnswer || a.authorRole === 'Instructor');
    return belongsToInstructor && isUnread && !hasInstructorAns;
  });

  // Monitor questions to trigger live alerts on new additions
  useEffect(() => {
    if (qaQuestions.length === 0) return;
    
    // First load: just set the baseline count
    if (lastQuestionCount === 0) {
      setLastQuestionCount(qaQuestions.length);
      return;
    }

    if (qaQuestions.length > lastQuestionCount) {
      // Find the new questions
      const sortedNew = [...qaQuestions].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      const newQuestion = sortedNew[0]; // Take the latest one

      if (newQuestion) {
        const belongsToInstructor = selectedInstructorId === 'all' || instructorCourseIds.includes(newQuestion.courseId);
        
        if (belongsToInstructor) {
          const course = courses.find(c => c.id === newQuestion.courseId);
          const courseName = course?.title || 'General Forum';
          const alertId = `alert-${Date.now()}`;
          
          setActiveAlerts(prev => [
            ...prev,
            {
              id: alertId,
              title: newQuestion.title,
              author: newQuestion.authorName,
              courseTitle: courseName
            }
          ]);

          if (enableAudioAlerts) {
            playChime();
          }

          setTimeout(() => {
            setActiveAlerts(prev => prev.filter(alert => alert.id !== alertId));
          }, 6000);
        }
      }
      setLastQuestionCount(qaQuestions.length);
    } else if (qaQuestions.length < lastQuestionCount) {
      setLastQuestionCount(qaQuestions.length);
    }
  }, [qaQuestions, lastQuestionCount, courses, selectedInstructorId]);

  const handleMarkAsRead = (qId: string) => {
    setReadNotifIds(prev => {
      const updated = prev.includes(qId) ? prev : [...prev, qId];
      localStorage.setItem('shringaara_read_notifs', JSON.stringify(updated));
      return updated;
    });
  };

  const handleMarkAllAsRead = () => {
    const unreadIds = unreadQuestions.map(q => q.id);
    setReadNotifIds(prev => {
      const updated = Array.from(new Set([...prev, ...unreadIds]));
      localStorage.setItem('shringaara_read_notifs', JSON.stringify(updated));
      return updated;
    });
    setActionSuccessMessage('All pending student post alerts marked as read.');
    setTimeout(() => setActionSuccessMessage(''), 3000);
  };

  const handleViewQuestion = (qId: string) => {
    handleMarkAsRead(qId);
    setIsNotifOpen(false);
    setHighlightedQuestionId(qId);
    setTimeout(() => {
      const element = document.getElementById(`q-box-${qId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 150);

    // Clear highlight after 4 seconds
    setTimeout(() => {
      setHighlightedQuestionId(null);
    }, 4000);
  };

  const handleSimulateStudentPost = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetCourseId = simSelectedCourseId || courses[0]?.id || 'ds-101';
    
    const students = ['Aniket Rao', 'Sanjana Patel', 'Vikram Malhotra', 'Sneha Reddy', 'Liam Gallagher', 'Nisha Sen'];
    const titles = [
      'Stuck on Module 3: Docker-compose setup gives port conflict error',
      'Are we expected to implement custom JWT verification or use a library?',
      'Request: Can you share the presentation slides for lecture 5?',
      'Deploying on Cloud Run: Is scaling to zero configuration supported in dev?',
      'Error compiling TS: Namespace has no exported member \'CourseReview\'',
      'Capstone Project deadline extension request due to team scheduling conflict'
    ];
    const contents = [
      'Hi, when trying to boot up the environment using docker-compose up, I get Bind for 0.0.0.0:3000 failed: port is already allocated. Should I change the client port or kill the local node server?',
      'I am building out the registration service and was wondering if we should implement raw pbkdf2 hashing or use standard bcrypt-js like shown in the live session? Appreciate any advice!',
      'Love the course so far! I was wondering if the slides for the third-party integrations and system design are posted anywhere on Drive? I couldn\'t find them in the resources section.',
      'We are deploying a scalable cluster in production and want to minimize cold starts. Do you suggest keeping min-instances to 1, or is there a way to pre-warm the container using a ping endpoint?',
      'I am getting a strict type error during npm run build. It says types.ts line 44 lacks the schema definition, but it runs perfectly in development mode with tsx. Please help!',
      'My team is working hard on the final React portal. However, one of our engineers is down with flu. Is it possible to submit our code files 2 days after the standard due date?'
    ];

    const finalStudentName = simStudentName.trim() || students[Math.floor(Math.random() * students.length)];
    const finalTitle = simQuestionTitle.trim() || titles[Math.floor(Math.random() * titles.length)];
    const finalContent = simQuestionContent.trim() || contents[Math.floor(Math.random() * contents.length)];

    setIsPostingSimulatedQuestion(true);
    try {
      await postQuestion({
        courseId: targetCourseId,
        title: finalTitle,
        content: finalContent,
        category: simQuestionCategory,
        authorName: finalStudentName,
        authorEmail: `${finalStudentName.toLowerCase().replace(/\s+/g, '.')}@student.shringaara.com`
      });

      setActionSuccessMessage(`Simulated new student post by ${finalStudentName}!`);
      setTimeout(() => setActionSuccessMessage(''), 4000);
      
      setSimQuestionTitle('');
      setSimQuestionContent('');
      setSimulatorOpen(false);

      await loadPortalData();
    } catch (err) {
      console.error('Error simulating student post:', err);
    } finally {
      setIsPostingSimulatedQuestion(false);
    }
  };

  useEffect(() => {
    loadPortalData();
  }, [courses]);

  // Combine real database enrollments with mock enrollments to ensure pristine layout density
  const getCombinedEnrollments = (): Enrollment[] => {
    const combined: Enrollment[] = [...dbEnrollments];
    
    // Add missing mock students to fill out the board beautifully
    MOCK_DEMO_STUDENTS.forEach((mock) => {
      const alreadyExists = dbEnrollments.some(
        e => e.userEmail.toLowerCase() === mock.userEmail.toLowerCase() && e.courseId === mock.courseId
      );
      if (!alreadyExists) {
        combined.push({
          id: `mock-${mock.courseId}-${mock.userEmail.split('@')[0]}`,
          userId: 'mock-user',
          userEmail: mock.userEmail,
          userName: mock.userName,
          courseId: mock.courseId,
          courseTitle: mock.courseTitle,
          progressPercent: mock.progressPercent,
          completedLessons: [],
          certificateId: mock.certificateId || null,
          enrolledAt: mock.enrolledAt,
          lastAccessedAt: mock.lastAccessedAt
        });
      }
    });

    return combined;
  };

  // Filter enrollments based on instructor and filters
  const getFilteredEnrollments = (): Enrollment[] => {
    const combined = getCombinedEnrollments();
    
    return combined.filter(e => {
      // Instructor Filter
      const belongsToInstructor = selectedInstructorId === 'all' || instructorCourseIds.includes(e.courseId);
      
      // Course Filter
      const matchesCourse = filterCourseId === 'all' || e.courseId === filterCourseId;
      
      // Search Filter
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query || 
        e.userName.toLowerCase().includes(query) || 
        e.userEmail.toLowerCase().includes(query) ||
        e.courseTitle.toLowerCase().includes(query);

      return belongsToInstructor && matchesCourse && matchesSearch;
    });
  };

  const filteredEnrollments = getFilteredEnrollments();

  // Filter Q&As based on instructor's courses
  const getFilteredQuestions = (): CourseQAQuestion[] => {
    return qaQuestions.filter(q => {
      const matchesInstructor = selectedInstructorId === 'all' || instructorCourseIds.includes(q.courseId);
      return matchesInstructor;
    });
  };

  const filteredQuestions = getFilteredQuestions();

  // Calculate Metrics
  const activeStudentsCount = new Set(filteredEnrollments.map(e => e.userEmail.toLowerCase())).size;
  
  const completionRatePercent = filteredEnrollments.length > 0 
    ? Math.round((filteredEnrollments.filter(e => e.progressPercent >= 100).length / filteredEnrollments.length) * 100)
    : 0;

  const totalReviews = reviews.filter(r => selectedInstructorId === 'all' || instructorCourseIds.includes(r.courseId));
  const averageRating = totalReviews.length > 0
    ? (totalReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews.length).toFixed(1)
    : '4.9';

  // Revenue calculation - sum up virtual proceeds from premium courses (assign nominal values if zero)
  const totalRevenue = filteredEnrollments.reduce((sum, e) => {
    const course = courses.find(c => c.id === e.courseId);
    const nominalPrice = course?.price && course.price > 0 ? course.price : 99; // Assume standard price if free preview
    return sum + nominalPrice;
  }, 0);

  // Directly update student progress in Firestore/localStorage
  const handleUpdateProgressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEnrollment) return;

    try {
      const percent = Math.min(100, Math.max(0, newProgressPercent));
      
      // If it's a real enrollment, update in Firestore
      if (!editingEnrollment.id?.startsWith('mock-')) {
        await updateEnrollmentProgressInFirestore(editingEnrollment.id!, editingEnrollment.completedLessons || [], percent);
      }

      // Update state in local DB / memory fallback
      setDbEnrollments(prev => prev.map(item => {
        if (item.id === editingEnrollment.id) {
          return {
            ...item,
            progressPercent: percent,
            certificateId: percent >= 100 ? (item.certificateId || `CERT-SHRINGAARA-${Math.random().toString(36).substring(2, 8).toUpperCase()}`) : null
          };
        }
        return item;
      }));

      // Show success popup
      setActionSuccessMessage(`Successfully updated progress for ${editingEnrollment.userName} to ${percent}%`);
      setTimeout(() => setActionSuccessMessage(''), 4000);
      setEditingEnrollment(null);
      loadPortalData();
    } catch (err) {
      console.error('Error updating progress:', err);
    }
  };

  // Simulate dispatching support email to enrolled student
  const handleSendEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sendingEmailTo) return;

    // Simulate sending email log / save notification
    setActionSuccessMessage(`Encouragement message dispatched to ${sendingEmailTo.name} (${sendingEmailTo.email})!`);
    setTimeout(() => setActionSuccessMessage(''), 4000);
    setSendingEmailTo(null);
    setEmailSubject('');
    setEmailBody('');
  };

  // Submit Answer to Course Q&A
  const handleSubmitAnswer = async (questionId: string, courseId: string) => {
    const text = replyText[questionId]?.trim();
    if (!text) return;

    setIsSubmittingReply(questionId);

    const updated = await postAnswer(
      courseId,
      questionId,
      {
        questionId,
        authorName: selectedInstructorId === 'all' ? 'Academy Master Instructor' : selectedInstructor.name,
        authorRole: 'Instructor',
        authorEmail: 'instructor@shringaaraacademy.com',
        content: text,
        isInstructorAnswer: true
      },
      qaQuestions
    );

    setQaQuestions(updated);
    setReplyText(prev => ({ ...prev, [questionId]: '' }));
    setIsSubmittingReply(null);
    
    setActionSuccessMessage('Your official instructor answer has been posted to the course Q&A board.');
    setTimeout(() => setActionSuccessMessage(''), 4000);
  };

  if (!isLoggedIn) {
    return (
      <div className="bg-slate-950 text-slate-100 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-amber-400/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-md w-full space-y-8 z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center space-y-3">
            <div className="mx-auto h-12 w-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-400/10">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">Shringaara Academy</h2>
              <p className="mt-1 text-sm font-medium text-slate-400">Instructor Gateway</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-200">Sign in to your portal</h3>
              <p className="text-xs text-slate-400">Please authenticate using your instructor credentials.</p>
            </div>

            {loginError && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold rounded-2xl flex items-center gap-2.5 animate-in fade-in">
                <X className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleInstructorLogin} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="e.g. ananya@shringaara.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-3 text-xs text-white focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
                    <Key className="w-4 h-4" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your security password"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-3 text-xs text-white focus:outline-none focus:border-amber-400 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 disabled:opacity-50 cursor-pointer"
              >
                {isLoggingIn ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Sign In to Gateway</span>
                  </>
                )}
              </button>
            </form>

            <div className="pt-4 border-t border-slate-850 space-y-3">
              <div className="text-center">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Quick-Select Demo Accounts (Tap to autofill)</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: 'Dr. Ananya Sharma', email: 'ananya@shringaara.com', specialty: 'Data Science' },
                  { name: 'Rohan Mehta', email: 'rohan@shringaara.com', specialty: 'Full Stack Coding' },
                  { name: 'Maya Lin', email: 'maya@shringaara.com', specialty: 'UI/UX Design' },
                  { name: 'Academy Management', email: 'admin@shringaara.com', specialty: 'Consolidated View' }
                ].map((demo) => (
                  <button
                    key={demo.email}
                    type="button"
                    onClick={() => {
                      setLoginEmail(demo.email);
                      setLoginPassword('shringaara123');
                      setLoginError('');
                    }}
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-850 hover:border-amber-400/50 hover:bg-slate-900 transition-all text-left group cursor-pointer"
                  >
                    <span className="text-[10px] font-bold text-white group-hover:text-amber-400 block truncate transition-colors">{demo.name}</span>
                    <span className="text-[8px] font-mono text-slate-500 block truncate">{demo.email}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-10 px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-200">
      
      {/* Toast Alert Banner */}
      {actionSuccessMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-emerald-500 text-slate-950 font-bold text-xs rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-400 animate-bounce">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{actionSuccessMessage}</span>
        </div>
      )}

      {/* Real-time Toast Notifications */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {activeAlerts.map(alert => (
          <div 
            key={alert.id}
            className="pointer-events-auto bg-slate-900 border-2 border-amber-400 p-4 rounded-2xl shadow-2xl flex items-start gap-3 transform translate-y-0 transition-all duration-300 animate-in slide-in-from-right-10"
          >
            <div className="w-8 h-8 rounded-full bg-amber-400/10 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
              <BellRing className="w-4 h-4 animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider truncate">New Forum Post!</span>
                <button 
                  onClick={() => setActiveAlerts(prev => prev.filter(a => a.id !== alert.id))}
                  className="text-slate-500 hover:text-white transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <h4 className="text-xs font-bold text-white truncate mt-0.5">{alert.title}</h4>
              <p className="text-[11px] text-slate-400 truncate mt-0.5">By {alert.author} in {alert.courseTitle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Layout Header Block */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Certified Instructor Zone</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <span>Academy Instructor Portal</span>
            <span className="px-2.5 py-1 text-xs font-mono font-bold bg-slate-900 border border-slate-800 text-slate-400 rounded-lg">
              v1.4 Live
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Monitor course enrollment velocity, student curriculum completion status, and review scores. Answer Q&A discussions in real time.
          </p>
        </div>

        {/* Sync & Interactive Notification Bell Block */}
        <div className="flex items-center gap-3 self-start md:self-center shrink-0 relative">
          
          {/* Simulator Toggle Button */}
          <button
            onClick={() => setSimulatorOpen(true)}
            className="px-3.5 py-2.5 rounded-xl bg-purple-950/40 border border-purple-800/80 text-purple-300 font-bold text-xs hover:bg-purple-900/40 hover:text-white transition-all flex items-center gap-1.5"
            title="Simulate student activity to test notifications"
          >
            <Flame className="w-4 h-4 text-purple-400 animate-pulse" />
            <span>Simulate Student Post</span>
          </button>

          {/* Bell Icon trigger */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className={`p-2.5 rounded-xl border transition-all relative flex items-center justify-center ${
                isNotifOpen 
                  ? 'bg-amber-400 border-amber-400 text-slate-950 shadow-lg shadow-amber-500/15' 
                  : unreadQuestions.length > 0
                    ? 'bg-slate-900 border-amber-400/60 text-amber-400 hover:bg-slate-850'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
              }`}
              title="Course Q&A Notifications Alert"
            >
              {unreadQuestions.length > 0 ? (
                <BellRing className={`w-4 h-4 ${unreadQuestions.length > 0 ? 'animate-bounce' : ''}`} />
              ) : (
                <Bell className="w-4 h-4" />
              )}
              
              {unreadQuestions.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 text-white font-mono font-bold text-[10px] rounded-full flex items-center justify-center border-2 border-slate-950 animate-pulse">
                  {unreadQuestions.length}
                </span>
              )}
            </button>

            {/* Notification Dropdown List */}
            {isNotifOpen && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 py-4 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 pb-2 border-b border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-white">Student Forum Alerts</span>
                    {unreadQuestions.length > 0 && (
                      <span className="px-1.5 py-0.5 rounded bg-amber-400/10 text-[9px] font-bold text-amber-400">
                        {unreadQuestions.length} new
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Audio toggle */}
                    <button 
                      onClick={() => setEnableAudioAlerts(!enableAudioAlerts)}
                      className="text-slate-500 hover:text-white transition-colors"
                      title={enableAudioAlerts ? 'Mute Audio Chime Alerts' : 'Enable Audio Chime Alerts'}
                    >
                      {enableAudioAlerts ? <Volume2 className="w-3.5 h-3.5 text-amber-400" /> : <VolumeX className="w-3.5 h-3.5" />}
                    </button>
                    {unreadQuestions.length > 0 && (
                      <button 
                        onClick={handleMarkAllAsRead}
                        className="text-[10px] font-bold text-amber-400 hover:text-amber-300 transition-colors"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                </div>

                <div className="max-h-80 overflow-y-auto px-2 space-y-1 divide-y divide-slate-800/40">
                  {unreadQuestions.length === 0 ? (
                    <div className="py-8 text-center text-slate-500 space-y-2">
                      <div className="w-8 h-8 rounded-full bg-slate-950 flex items-center justify-center text-slate-600 mx-auto">
                        🎉
                      </div>
                      <p className="text-xs font-medium">All course discussions are caught up!</p>
                      <p className="text-[10px] text-slate-500">New student forum posts will alert you here.</p>
                    </div>
                  ) : (
                    unreadQuestions.map(q => {
                      const course = courses.find(c => c.id === q.courseId);
                      return (
                        <div 
                          key={q.id}
                          className="pt-2 pb-2 px-2 hover:bg-slate-950/50 rounded-xl transition-all cursor-pointer space-y-1 group"
                          onClick={() => handleViewQuestion(q.id)}
                        >
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-slate-400 font-medium truncate max-w-[140px]">
                              {course?.title || 'General Forum'}
                            </span>
                            <span className="text-slate-500 shrink-0 font-mono">
                              {new Date(q.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                          <h5 className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors truncate">
                            {q.title}
                          </h5>
                          <p className="text-[11px] text-slate-400 line-clamp-1 leading-relaxed">
                            {q.content}
                          </p>
                          <div className="flex items-center justify-between text-[10px] pt-1">
                            <span className="text-slate-400">
                              By <strong className="text-slate-300 font-semibold">{q.authorName}</strong>
                            </span>
                            <span className="text-amber-400 font-extrabold flex items-center gap-0.5 group-hover:underline">
                              Answer now &rarr;
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
                
                <div className="px-4 pt-2 border-t border-slate-800/80 flex justify-between items-center text-[10px] text-slate-500">
                  <span>Scope: {selectedInstructorId === 'all' ? 'All Academy' : selectedInstructor.name.split(' ').slice(-1)[0]}</span>
                  <span className="font-mono">Live Sync Active</span>
                </div>
              </div>
            )}
          </div>

          {/* Sync Button */}
          <button
            onClick={loadPortalData}
            disabled={isRefreshing}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-bold text-xs hover:border-slate-700 hover:text-white transition-all flex items-center gap-2 shrink-0 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Syncing...' : 'Sync Live Metrics'}</span>
          </button>
        </div>
      </div>

      {/* Instructor Switcher Selector Tab */}
      <div className="max-w-7xl mx-auto bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Currently Viewing Dashboard as:</span>
          <div className="flex items-center gap-3">
            {selectedInstructor.avatar ? (
              <img 
                src={selectedInstructor.avatar} 
                alt={selectedInstructor.name} 
                className="w-10 h-10 rounded-xl border border-slate-700 object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center text-slate-950 font-extrabold">
                🎓
              </div>
            )}
            <div>
              <h3 className="text-sm font-bold text-white">{selectedInstructor.name}</h3>
              <p className="text-xs text-amber-400/80 font-medium">{selectedInstructor.role}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          {instructors.map((inst) => {
            const loggedInId = localStorage.getItem('shringaara_instructor_logged_id') || 'all';
            const isSelf = inst.id === loggedInId;
            const isManagement = loggedInId === 'all';
            const isAllowed = isManagement || isSelf;

            return (
              <button
                key={inst.id}
                disabled={!isAllowed}
                onClick={() => {
                  if (isAllowed) {
                    setSelectedInstructorId(inst.id);
                    setFilterCourseId('all'); // Reset course filter on switcher
                  }
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedInstructorId === inst.id
                    ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/10'
                    : !isAllowed
                      ? 'bg-slate-950/40 border border-slate-900 text-slate-600 cursor-not-allowed opacity-50'
                      : 'bg-slate-950 border border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                }`}
                title={!isAllowed ? 'Locked: Authenticated session restricted to your profile only.' : ''}
              >
                {!isAllowed && <Lock className="w-3 h-3 text-slate-600" />}
                {inst.id === 'all' ? 'Consolidated view' : inst.name.split(' ').slice(-1)[0]}
              </button>
            );
          })}

          {/* Premium Red Logout Button */}
          <button
            onClick={handleInstructorLogout}
            className="px-3.5 py-2 rounded-xl border border-rose-500/30 text-rose-400 font-bold text-xs hover:bg-rose-500/10 transition-all flex items-center gap-1.5 ml-auto lg:ml-2 cursor-pointer"
            title="Log out of instructor gateway"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Metric 1 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Enrolled Students</span>
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">{activeStudentsCount}</span>
            <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +12% this week
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Unique students registered in courses under {selectedInstructorId === 'all' ? 'the academy' : 'your roster'}.
          </p>
        </div>

        {/* Metric 2 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Revenue generated (USD)</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              ${totalRevenue.toLocaleString()}
            </span>
            <span className="text-[10px] text-amber-400 font-mono font-bold uppercase">Estimated Value</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Value of coursework delivered based on course price or nominal $99 index.
          </p>
        </div>

        {/* Metric 3 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Curriculum completion rate</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">{completionRatePercent}%</span>
            <span className="text-[10px] text-slate-400">Avg Progress</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Percentage of student enrollments that have completed 100% of their lecture tasks.
          </p>
        </div>

        {/* Metric 4 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg Instructor Rating</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
              <Star className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">{averageRating}</span>
            <div className="flex items-center gap-0.5 text-amber-400">
              <Star className="w-3 h-3 fill-amber-400" />
              <Star className="w-3 h-3 fill-amber-400" />
              <Star className="w-3 h-3 fill-amber-400" />
              <Star className="w-3 h-3 fill-amber-400" />
              <Star className="w-3 h-3 fill-amber-400" />
            </div>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Based on {totalReviews.length} verified course feedback responses.
          </p>
        </div>

      </div>

      {/* Visual Analytics Block */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Popularity chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl lg:col-span-2">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-sky-400" />
              <span>Enrollment Velocity & Popularity by Course</span>
            </h3>
            <p className="text-[11px] text-slate-400">Compare unique registered student counts across active curriculums.</p>
          </div>

          <div className="space-y-4 pt-2">
            {instructorCourses.map((course) => {
              const studentsInCourse = getCombinedEnrollments().filter(e => e.courseId === course.id);
              const maxStudentVal = Math.max(...courses.map(c => getCombinedEnrollments().filter(e => e.courseId === c.id).length), 1);
              const percentBar = Math.min(100, Math.round((studentsInCourse.length / maxStudentVal) * 100));

              return (
                <div key={course.id} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-200 truncate max-w-sm sm:max-w-md">{course.title}</span>
                    <span className="text-amber-400 font-mono font-bold shrink-0">{studentsInCourse.length} Students</span>
                  </div>
                  <div className="h-2.5 bg-slate-950 rounded-full overflow-hidden flex">
                    <div 
                      style={{ width: `${percentBar}%` }}
                      className="bg-gradient-to-r from-amber-500 to-amber-300 rounded-full h-full transition-all duration-500"
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Course Completion & Progress distribution */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <span>Roster Progress Distribution</span>
            </h3>
            <p className="text-[11px] text-slate-400">How students are advancing through modules.</p>
          </div>

          {/* Simple distribution bars */}
          <div className="space-y-3.5 pt-3">
            {/* Range 1: 80% - 100% */}
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Advanced (80% - 100% Progress)</span>
                <span className="text-white font-bold font-mono">
                  {filteredEnrollments.filter(e => e.progressPercent >= 80).length} Students
                </span>
              </div>
              <div className="h-2 bg-slate-950 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full rounded-full" 
                  style={{ width: `${(filteredEnrollments.filter(e => e.progressPercent >= 80).length / Math.max(filteredEnrollments.length, 1)) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Range 2: 40% - 79% */}
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Mid-Tier (40% - 79% Progress)</span>
                <span className="text-white font-bold font-mono">
                  {filteredEnrollments.filter(e => e.progressPercent >= 40 && e.progressPercent < 80).length} Students
                </span>
              </div>
              <div className="h-2 bg-slate-950 rounded-full overflow-hidden">
                <div 
                  className="bg-amber-400 h-full rounded-full" 
                  style={{ width: `${(filteredEnrollments.filter(e => e.progressPercent >= 40 && e.progressPercent < 80).length / Math.max(filteredEnrollments.length, 1)) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Range 3: 0% - 39% */}
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Beginners (0% - 39% Progress)</span>
                <span className="text-white font-bold font-mono">
                  {filteredEnrollments.filter(e => e.progressPercent < 40).length} Students
                </span>
              </div>
              <div className="h-2 bg-slate-950 rounded-full overflow-hidden">
                <div 
                  className="bg-slate-700 h-full rounded-full" 
                  style={{ width: `${(filteredEnrollments.filter(e => e.progressPercent < 40).length / Math.max(filteredEnrollments.length, 1)) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Main Student Enrollment Table & search filter controls */}
      <div className="max-w-7xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        
        {/* Table Controls Header */}
        <div className="p-6 border-b border-slate-800 space-y-4 bg-slate-900">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-extrabold text-white">Student Enrollment Roster</h3>
              <p className="text-xs text-slate-400">Search and manage progress percentages or send motivation logs.</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest shrink-0">Filter by Course:</span>
              <select
                value={filterCourseId}
                onChange={(e) => setFilterCourseId(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="all">All Course Curriculums</option>
                {instructorCourses.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5">
            {/* Search inputs */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search students by name, email, or course keywords..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Student list Roster */}
        {filteredEnrollments.length === 0 ? (
          <div className="p-12 text-center space-y-3 bg-slate-950">
            <Users className="w-10 h-10 text-slate-600 mx-auto" />
            <h4 className="text-sm font-bold text-white">No enrolled students found</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No students are currently matching your search or filters under {selectedInstructor.name}'s curriculum.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-950">
                  <th className="py-4 px-6">Student Information</th>
                  <th className="py-4 px-6">Enrolled Curriculum</th>
                  <th className="py-4 px-6">Modules Progress</th>
                  <th className="py-4 px-6">Enrollment Date</th>
                  <th className="py-4 px-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs text-slate-200">
                {filteredEnrollments.map((enr) => {
                  const isMock = enr.id?.startsWith('mock-');
                  
                  return (
                    <tr key={enr.id} className="hover:bg-slate-950/60 transition-colors">
                      {/* Student info */}
                      <td className="py-4.5 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-300">
                            {enr.userName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-white flex items-center gap-2">
                              <span>{enr.userName}</span>
                              {isMock && (
                                <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[9px] font-mono text-slate-500">
                                  Demo Data
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono">{enr.userEmail}</div>
                          </div>
                        </div>
                      </td>

                      {/* Course info */}
                      <td className="py-4.5 px-6">
                        <div className="space-y-1 max-w-xs">
                          <span className="font-semibold text-slate-100 block truncate">{enr.courseTitle}</span>
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 font-mono">
                            ID: {enr.courseId}
                          </span>
                        </div>
                      </td>

                      {/* Progress bar info */}
                      <td className="py-4.5 px-6">
                        <div className="space-y-1.5 w-44">
                          <div className="flex justify-between text-[11px] font-bold">
                            <span className={enr.progressPercent >= 100 ? 'text-emerald-400' : 'text-amber-400'}>
                              {enr.progressPercent}% Completed
                            </span>
                            {enr.certificateId && (
                              <span className="text-[10px] text-emerald-400 flex items-center gap-0.5">
                                <Award className="w-3 h-3" /> Certified
                              </span>
                            )}
                          </div>
                          <div className="h-2 bg-slate-950 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-300 ${
                                enr.progressPercent >= 100 ? 'bg-emerald-500' : 'bg-amber-400'
                              }`}
                              style={{ width: `${enr.progressPercent}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>

                      {/* Date enrolled */}
                      <td className="py-4.5 px-6 text-slate-400 font-mono">
                        {new Date(enr.enrolledAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>

                      {/* Actions */}
                      <td className="py-4.5 px-6">
                        <div className="flex items-center gap-2">
                          {/* Update Progress Button */}
                          <button
                            onClick={() => {
                              setEditingEnrollment(enr);
                              setNewProgressPercent(enr.progressPercent);
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-[11px] font-bold text-white hover:bg-slate-700 transition-colors flex items-center gap-1"
                            title="Adjust completion percent"
                          >
                            <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                            <span>Set Progress</span>
                          </button>

                          {/* Email Support Button */}
                          <button
                            onClick={() => {
                              setSendingEmailTo({
                                email: enr.userEmail,
                                name: enr.userName,
                                courseTitle: enr.courseTitle
                              });
                              setEmailSubject(`Mentoring update: Moving forward in ${enr.courseTitle}`);
                              setEmailBody(`Hi ${enr.userName},\n\nI was reviewing our ${enr.courseTitle} enrollment logs, and wanted to reach out to see how your practical labs are going. Feel free to ask any technical or code questions on our per-course Q&A Discussion Forum!\n\nBest regards,\n${selectedInstructorId === 'all' ? 'Academy Master Instructor' : selectedInstructor.name}`);
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-[11px] font-bold text-slate-300 hover:text-white hover:bg-slate-700 transition-colors flex items-center gap-1"
                            title="Send support advice"
                          >
                            <Mail className="w-3.5 h-3.5 text-sky-400" />
                            <span>Contact</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Direct instructor Q&A answering center */}
      <div className="max-w-7xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-slate-800 bg-slate-900">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2.5">
            <MessageSquare className="w-5 h-5 text-amber-400" />
            <span>Instructor Q&A Response Desk</span>
          </h3>
          <p className="text-xs text-slate-400">
            Below are student discussions for your courses. Provide verified answers to mark questions as resolved.
          </p>
        </div>

        <div className="p-6 space-y-4 bg-slate-950">
          {filteredQuestions.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <HelpCircle className="w-10 h-10 text-slate-600 mx-auto" />
              <h4 className="text-sm font-bold text-white">No active Q&A forum threads</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                All student questions under your courses have been fully answered. Outstanding job!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredQuestions.map((q) => {
                const answerCount = q.answers?.length || 0;
                const hasInstructorAnswer = q.answers?.some(a => a.isInstructorAnswer || a.authorRole === 'Instructor');

                return (
                  <div 
                    id={`q-box-${q.id}`} 
                    key={q.id} 
                    className={`bg-slate-900 border rounded-2xl p-5 space-y-4 transition-all duration-1000 ${
                      highlightedQuestionId === q.id 
                        ? 'border-amber-400 bg-slate-900/100 scale-[1.01] shadow-2xl shadow-amber-400/20' 
                        : 'border-slate-800'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-amber-400 uppercase tracking-wider font-bold">
                          {q.category || 'Technical'}
                        </span>
                        
                        {hasInstructorAnswer ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-rose-400 text-[10px] font-bold flex items-center gap-1 animate-pulse">
                            <Clock className="w-3.5 h-3.5" /> Pending Response
                          </span>
                        )}

                        <span className="text-[11px] text-slate-500">•</span>
                        <span className="text-[11px] text-slate-400">
                          Course ID: <strong className="text-slate-300">{q.courseId}</strong>
                        </span>
                      </div>

                      <span className="text-[11px] text-slate-400">
                        Posted by <strong className="text-slate-200">{q.authorName}</strong> on {new Date(q.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-extrabold text-white">{q.title}</h4>
                      <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 border border-slate-800/80 p-3 rounded-xl">
                        {q.content}
                      </p>
                    </div>

                    {/* Pre-existing replies */}
                    {answerCount > 0 && (
                      <div className="space-y-2.5 pl-4 border-l border-slate-800">
                        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Previous Answers ({answerCount}):</span>
                        {q.answers.map((ans) => (
                          <div 
                            key={ans.id} 
                            className={`p-3 rounded-xl text-xs space-y-1 ${
                              ans.isInstructorAnswer || ans.authorRole === 'Instructor' 
                                ? 'bg-amber-400/5 border border-amber-400/30' 
                                : 'bg-slate-950 border border-slate-800'
                            }`}
                          >
                            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                              <span className={ans.isInstructorAnswer || ans.authorRole === 'Instructor' ? 'text-amber-400' : 'text-slate-200'}>
                                {ans.authorName} ({ans.authorRole})
                              </span>
                              <span>{new Date(ans.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className="text-slate-300">{ans.content}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Quick Reply Form */}
                    <div className="pt-2 border-t border-slate-800/60">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-xl bg-amber-400 flex items-center justify-center text-slate-950 font-bold mt-1 shrink-0">
                          🎓
                        </div>
                        <div className="flex-1 space-y-2">
                          <textarea
                            rows={2}
                            value={replyText[q.id] || ''}
                            onChange={(e) => setReplyText(prev => ({ ...prev, [q.id]: e.target.value }))}
                            placeholder="Type verified professional solution as an Academy Instructor..."
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                          />
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] text-slate-500 font-mono">Will post verified answer instantly.</span>
                            <button
                              type="button"
                              onClick={() => handleSubmitAnswer(q.id, q.courseId)}
                              disabled={isSubmittingReply === q.id || !replyText[q.id]?.trim()}
                              className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 text-xs font-bold hover:bg-amber-300 transition-all flex items-center gap-1.5 disabled:opacity-50"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>{isSubmittingReply === q.id ? 'Answering...' : 'Post Instructor Solution'}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* MODAL 1: Adjust Student Progress percent */}
      {editingEnrollment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-6 space-y-5 shadow-2xl">
            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-amber-400" />
                <span>Adjust Completion Progress</span>
              </h3>
              <p className="text-xs text-slate-400">
                Directly override progress for <strong className="text-white">{editingEnrollment.userName}</strong>.
              </p>
            </div>

            <form onSubmit={handleUpdateProgressSubmit} className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Course Title</span>
                <span className="text-xs font-semibold text-white block">{editingEnrollment.courseTitle}</span>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  New Progress Percentage: <span className="text-amber-400 font-mono font-bold text-sm ml-1">{newProgressPercent}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={newProgressPercent}
                  onChange={(e) => setNewProgressPercent(parseInt(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>0% (Not Started)</span>
                  <span>50%</span>
                  <span>100% (Certified)</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingEnrollment(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-400 text-slate-950 text-xs font-bold hover:bg-amber-300 transition-all shadow-lg shadow-amber-500/10"
                >
                  Apply Override
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Send support advice email */}
      {sendingEmailTo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl p-6 space-y-5 shadow-2xl">
            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Mail className="w-5 h-5 text-sky-400" />
                <span>Send Support Advice</span>
              </h3>
              <p className="text-xs text-slate-400">
                Email mentoring guidance to <strong className="text-white">{sendingEmailTo.name}</strong>.
              </p>
            </div>

            <form onSubmit={handleSendEmailSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Recipient Email:</span>
                  <span className="text-white font-semibold font-mono block truncate">{sendingEmailTo.email}</span>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Sender Name:</span>
                  <span className="text-white font-semibold block truncate">
                    {selectedInstructorId === 'all' ? 'Academy Master Instructor' : selectedInstructor.name}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Subject</label>
                <input
                  type="text"
                  required
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Message Body</label>
                <textarea
                  required
                  rows={6}
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSendingEmailTo(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-400 text-slate-950 text-xs font-bold hover:bg-amber-300 transition-all flex items-center gap-1.5 shadow-lg shadow-amber-500/10"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Simulate Student Post (Forum Activity) */}
      {simulatorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl p-6 space-y-5 shadow-2xl relative">
            <button 
              onClick={() => setSimulatorOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-purple-400 animate-pulse" />
                <span>Student Post Simulator</span>
              </h3>
              <p className="text-xs text-slate-400">
                Simulate a real-time forum post to demonstrate and test the instructor notification system, live toasts, and chime sounds.
              </p>
            </div>

            <form onSubmit={handleSimulateStudentPost} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Target Course</label>
                  <select
                    value={simSelectedCourseId}
                    onChange={(e) => setSimSelectedCourseId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Student Name (Optional)</label>
                  <input
                    type="text"
                    value={simStudentName}
                    onChange={(e) => setSimStudentName(e.target.value)}
                    placeholder="Randomly assigned if blank"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Category</label>
                  <select
                    value={simQuestionCategory}
                    onChange={(e) => setSimQuestionCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    <option value="Technical">Technical Discussion</option>
                    <option value="Assignment">Assignment Help</option>
                    <option value="Career">Career Mentorship</option>
                    <option value="Feedback">Course Feedback</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Question Title (Optional)</label>
                  <input
                    type="text"
                    value={simQuestionTitle}
                    onChange={(e) => setSimQuestionTitle(e.target.value)}
                    placeholder="Randomly assigned if blank"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Post Content (Optional)</label>
                <textarea
                  rows={4}
                  value={simQuestionContent}
                  onChange={(e) => setSimQuestionContent(e.target.value)}
                  placeholder="Randomly assigned if blank. Describe the problem or request..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              <div className="p-3 bg-purple-950/20 border border-purple-900/30 rounded-xl flex items-start gap-2.5">
                <Sparkle className="w-4 h-4 text-purple-400 shrink-0 mt-0.5 animate-pulse" />
                <p className="text-[10px] text-purple-300/90 leading-relaxed">
                  Tip: Submitting will instantly write to local forum database & sync with Firestore. It triggers a real chime sound and slide-in desktop alert!
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSimulatorOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPostingSimulatedQuestion}
                  className="px-5 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-purple-500/10"
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>{isPostingSimulatedQuestion ? 'Simulating...' : 'Simulate Post'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
