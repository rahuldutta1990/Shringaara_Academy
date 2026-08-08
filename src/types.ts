export type ServiceCategory = 'data-science' | 'coding' | 'design' | 'qa' | 'designing';

export interface ServiceInfo {
  id: ServiceCategory;
  title: string;
  tagline: string;
  description: string;
  features: string[];
  iconName: string;
  badge: string;
  heroHeadline: string;
  capabilities: string[];
  outcomes: string[];
  faqs: { question: string; answer: string }[];
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
  description: string;
  resources?: { title: string; url: string }[];
  isFreePreview?: boolean;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  category: ServiceCategory;
  description: string;
  longDescription?: string;
  instructor: {
    name: string;
    role: string;
    avatar: string;
    bio: string;
  };
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  duration: string;
  rating: number;
  reviewCount: number;
  price: number;
  thumbnail: string;
  curriculum: Module[];
  featured?: boolean;
  learningOutcomes: string[];
  prerequisites: string[];
  createdAt?: string;
}

export interface Booking {
  id?: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  serviceCategory: ServiceCategory;
  scheduledDate: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "09:00 AM - 10:00 AM"
  status: 'scheduled' | 'completed' | 'cancelled';
  zoomUrl: string;
  zoomPasscode: string;
  notes?: string;
  adminNotes?: string;
  createdAt: string;
  deletedZoomAt?: string | null;
}

export interface Enrollment {
  id?: string;
  userId: string;
  userEmail: string;
  userName: string;
  courseId: string;
  courseTitle: string;
  progressPercent: number;
  completedLessons: string[];
  certificateId?: string | null;
  enrolledAt: string;
  lastAccessedAt?: string;
}

export interface WorkProject {
  id: string;
  title: string;
  category: ServiceCategory;
  client: string;
  tagline: string;
  summary: string;
  impact: string;
  tags: string[];
  image: string;
  caseStudy: {
    challenge: string;
    solution: string;
    results: string[];
  };
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  quote: string;
  service: ServiceCategory;
  rating: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: 'student' | 'admin';
  createdAt: string;
}

export interface StudentUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  studentId?: string;
  registeredAt: string;
}

export interface CoursePaymentReceipt {
  id: string;
  courseId: string;
  courseTitle: string;
  amountPaid: number;
  paymentMethod: string;
  transactionId: string;
  studentEmail: string;
  studentName: string;
  paidAt: string;
}

export interface CourseReview {
  id: string;
  courseId: string;
  studentEmail: string;
  studentName: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  logoUrl?: string; // Data URL or image link
  faviconUrl?: string; // Data URL or image link
  contactEmail: string;
  contactPhone: string;
  address: string;
  footerText: string;
}

export interface AdminCredentials {
  adminId: string;
  password: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface EmailNotificationLog {
  timestamp: string;
  stage: string;
  message: string;
}

export interface EmailNotification {
  id: string;
  to: string;
  studentName: string;
  subject: string;
  courseTitle: string;
  courseId: string;
  transactionId: string;
  amountPaid: number;
  paymentMethod: string;
  sentAt: string;
  status: 'PENDING' | 'SENT' | 'DELIVERED' | 'FAILED';
  deliveryLogs?: EmailNotificationLog[];
  htmlBody: string;
}

export interface CourseQAAnswer {
  id: string;
  questionId: string;
  authorName: string;
  authorRole: 'Instructor' | 'Student' | 'TA';
  authorAvatar?: string;
  authorEmail: string;
  content: string;
  createdAt: string;
  isInstructorAnswer?: boolean;
  upvotes: number;
}

export interface CourseQAQuestion {
  id: string;
  courseId: string;
  lessonId?: string;
  authorName: string;
  authorEmail: string;
  authorAvatar?: string;
  title: string;
  content: string;
  category?: 'General' | 'Technical' | 'Lecture Code' | 'Assignment';
  createdAt: string;
  upvotes: number;
  isResolved: boolean;
  answers: CourseQAAnswer[];
}

export interface PageContent {
  privacy: {
    title: string;
    lastUpdated: string;
    content: string;
  };
  terms: {
    title: string;
    lastUpdated: string;
    content: string;
  };
  faq: {
    title: string;
    subtitle: string;
    items: FaqItem[];
  };
  contact: {
    title: string;
    subtitle: string;
    email: string;
    phone: string;
    address: string;
    workingHours: string;
    mapEmbedUrl?: string;
  };
  refund: {
    title: string;
    lastUpdated: string;
    content: string;
  };
  about: {
    title: string;
    subtitle: string;
    missionText: string;
    visionText: string;
    storyText: string;
  };
  home: {
    heroTitle: string;
    heroSubtitle: string;
    ctaText: string;
  };
}

