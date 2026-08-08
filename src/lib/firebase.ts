import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { Booking, Course, Enrollment, SiteSettings, AdminCredentials, PageContent } from '../types';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with custom databaseId if specified
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || undefined);
export const auth = getAuth(app);

// Collection References
export const COURSES_COL = 'courses';
export const BOOKINGS_COL = 'bookings';
export const ENROLLMENTS_COL = 'enrollments';
export const USERS_COL = 'users';
export const SITE_SETTINGS_COL = 'site_settings';
export const ADMIN_SETTINGS_COL = 'admin_settings';
export const PAGE_CONTENT_COL = 'page_content';

// --- BOOKINGS HELPERS ---

/**
 * Checks how many active bookings exist for a specific email
 * Enforces the MAX 2 CONSULTATIONS limit
 */
export async function getUserActiveBookingCount(email: string): Promise<number> {
  try {
    const q = query(
      collection(db, BOOKINGS_COL),
      where('userEmail', '==', email.toLowerCase().trim()),
      where('status', '==', 'scheduled')
    );
    const snapshot = await getDocs(q);
    return snapshot.size;
  } catch (err) {
    console.warn('Error checking active booking count:', err);
    return 0;
  }
}

/**
 * Creates a consultation booking
 */
export async function createBookingInFirestore(bookingData: Omit<Booking, 'id'>): Promise<Booking> {
  // Verify max 2 limit first
  const activeCount = await getUserActiveBookingCount(bookingData.userEmail);
  if (activeCount >= 2) {
    throw new Error('You already have 2 active consultations scheduled. Please complete or cancel existing sessions before scheduling a new one.');
  }

  const docRef = await addDoc(collection(db, BOOKINGS_COL), {
    ...bookingData,
    userEmail: bookingData.userEmail.toLowerCase().trim(),
    createdAt: new Date().toISOString(),
    serverTime: serverTimestamp()
  });

  return {
    ...bookingData,
    id: docRef.id
  };
}

/**
 * Get all bookings (for Admin or User)
 */
export async function getAllBookingsFromFirestore(): Promise<Booking[]> {
  try {
    const snapshot = await getDocs(collection(db, BOOKINGS_COL));
    const list: Booking[] = [];
    snapshot.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as Booking);
    });
    // Sort descending by createdAt
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (err) {
    console.error('Error fetching bookings:', err);
    return [];
  }
}

/**
 * Update booking status or admin notes
 */
export async function updateBookingInFirestore(bookingId: string, updates: Partial<Booking>): Promise<void> {
  const docRef = doc(db, BOOKINGS_COL, bookingId);
  await updateDoc(docRef, { ...updates });
}

/**
 * Purge Zoom metadata for expired bookings
 */
export async function purgeZoomMetadataInFirestore(bookingId: string): Promise<void> {
  const docRef = doc(db, BOOKINGS_COL, bookingId);
  await updateDoc(docRef, {
    zoomUrl: '[Zoom details purged - Session concluded]',
    zoomPasscode: 'Purged',
    deletedZoomAt: new Date().toISOString()
  });
}

// --- COURSES HELPERS ---

export async function getAllCoursesFromFirestore(): Promise<Course[]> {
  try {
    const snapshot = await getDocs(collection(db, COURSES_COL));
    const list: Course[] = [];
    snapshot.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as Course);
    });
    return list;
  } catch (err) {
    console.error('Error fetching courses from Firestore:', err);
    return [];
  }
}

export async function saveCourseToFirestore(course: Course): Promise<void> {
  const docRef = doc(db, COURSES_COL, course.id);
  await setDoc(docRef, course, { merge: true });
}

export async function deleteCourseFromFirestore(courseId: string): Promise<void> {
  await deleteDoc(doc(db, COURSES_COL, courseId));
}

// --- ENROLLMENTS HELPERS ---

export async function getAllEnrollmentsFromFirestore(): Promise<Enrollment[]> {
  try {
    const snapshot = await getDocs(collection(db, ENROLLMENTS_COL));
    const list: Enrollment[] = [];
    snapshot.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as Enrollment);
    });
    return list;
  } catch (err) {
    console.error('Error getting all enrollments from Firestore:', err);
    return [];
  }
}

export async function getUserEnrollmentsFromFirestore(email: string): Promise<Enrollment[]> {
  try {
    const q = query(
      collection(db, ENROLLMENTS_COL),
      where('userEmail', '==', email.toLowerCase().trim())
    );
    const snapshot = await getDocs(q);
    const list: Enrollment[] = [];
    snapshot.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as Enrollment);
    });
    return list;
  } catch (err) {
    console.error('Error getting enrollments:', err);
    return [];
  }
}

export async function createEnrollmentInFirestore(enrollment: Omit<Enrollment, 'id'>): Promise<Enrollment> {
  // Check if already enrolled
  const existingQ = query(
    collection(db, ENROLLMENTS_COL),
    where('userEmail', '==', enrollment.userEmail.toLowerCase().trim()),
    where('courseId', '==', enrollment.courseId)
  );
  const existingSnap = await getDocs(existingQ);
  if (!existingSnap.empty) {
    const existingDoc = existingSnap.docs[0];
    return { id: existingDoc.id, ...existingDoc.data() } as Enrollment;
  }

  const docRef = await addDoc(collection(db, ENROLLMENTS_COL), {
    ...enrollment,
    userEmail: enrollment.userEmail.toLowerCase().trim(),
    enrolledAt: new Date().toISOString()
  });

  return {
    ...enrollment,
    id: docRef.id
  };
}

export async function updateEnrollmentProgressInFirestore(
  enrollmentId: string, 
  completedLessons: string[], 
  progressPercent: number
): Promise<void> {
  const docRef = doc(db, ENROLLMENTS_COL, enrollmentId);
  const updates: Partial<Enrollment> = {
    completedLessons,
    progressPercent,
    lastAccessedAt: new Date().toISOString()
  };
  if (progressPercent >= 100 && !updates.certificateId) {
    updates.certificateId = `CERT-SHRINGAARA-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  }
  await updateDoc(docRef, updates);
}

// --- SITE SETTINGS HELPERS ---

export async function getSiteSettingsFromFirestore(): Promise<SiteSettings | null> {
  try {
    const docRef = doc(db, SITE_SETTINGS_COL, 'general');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as SiteSettings;
    }
    return null;
  } catch (err) {
    console.error('Error fetching site settings:', err);
    return null;
  }
}

export async function saveSiteSettingsToFirestore(settings: SiteSettings): Promise<void> {
  const docRef = doc(db, SITE_SETTINGS_COL, 'general');
  await setDoc(docRef, settings, { merge: true });
}

export function subscribeSiteSettings(callback: (settings: SiteSettings) => void) {
  const docRef = doc(db, SITE_SETTINGS_COL, 'general');
  return onSnapshot(docRef, (snap) => {
    if (snap.exists()) {
      callback(snap.data() as SiteSettings);
    }
  }, (err) => {
    console.warn('Site settings snapshot error:', err);
  });
}

// --- ADMIN CREDENTIALS HELPERS ---

export async function getAdminCredentialsFromFirestore(): Promise<AdminCredentials | null> {
  try {
    const docRef = doc(db, ADMIN_SETTINGS_COL, 'credentials');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as AdminCredentials;
    }
    return null;
  } catch (err) {
    console.error('Error fetching admin credentials:', err);
    return null;
  }
}

export async function saveAdminCredentialsToFirestore(creds: AdminCredentials): Promise<void> {
  const docRef = doc(db, ADMIN_SETTINGS_COL, 'credentials');
  await setDoc(docRef, creds, { merge: true });
}

export function subscribeAdminCredentials(callback: (creds: AdminCredentials) => void) {
  const docRef = doc(db, ADMIN_SETTINGS_COL, 'credentials');
  return onSnapshot(docRef, (snap) => {
    if (snap.exists()) {
      callback(snap.data() as AdminCredentials);
    }
  }, (err) => {
    console.warn('Admin credentials snapshot error:', err);
  });
}

// --- PAGE CONTENT HELPERS ---

export async function getPageContentFromFirestore(): Promise<PageContent | null> {
  try {
    const docRef = doc(db, PAGE_CONTENT_COL, 'main');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as PageContent;
    }
    return null;
  } catch (err) {
    console.error('Error fetching page content:', err);
    return null;
  }
}

export async function savePageContentToFirestore(content: PageContent): Promise<void> {
  const docRef = doc(db, PAGE_CONTENT_COL, 'main');
  await setDoc(docRef, content, { merge: true });
}

export function subscribePageContent(callback: (content: PageContent) => void) {
  const docRef = doc(db, PAGE_CONTENT_COL, 'main');
  return onSnapshot(docRef, (snap) => {
    if (snap.exists()) {
      callback(snap.data() as PageContent);
    }
  }, (err) => {
    console.warn('Page content snapshot error:', err);
  });
}

