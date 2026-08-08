import { collection, addDoc, getDocs, query, where, doc, updateDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { CourseQAQuestion, CourseQAAnswer } from '../types';

export const QA_COLLECTION = 'course_qa_questions';

// Initial seed questions to ensure immediate rich content for every course
const INITIAL_SEED_QUESTIONS: Record<string, CourseQAQuestion[]> = {
  default: [
    {
      id: 'qa-seed-1',
      courseId: 'all',
      title: 'How do I submit the final capstone project code repository?',
      content: 'I have finished all video modules and the local code build works. Where should I upload my GitHub repository link for instructor review?',
      category: 'Assignment',
      authorName: 'Alex Rivera',
      authorEmail: 'alex.rivera@example.com',
      createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
      upvotes: 6,
      isResolved: true,
      answers: [
        {
          id: 'ans-seed-1',
          questionId: 'qa-seed-1',
          authorName: 'Dr. Sarah Lin',
          authorRole: 'Instructor',
          authorEmail: 'sarah.lin@shringaara.com',
          content: 'Hi Alex! Excellent progress. You can submit your GitHub repository link under the Capstone Module tab in your student dashboard. Our instructor team reviews submissions within 24 hours to issue your verified completion certificate.',
          createdAt: new Date(Date.now() - 3600000 * 36).toISOString(),
          isInstructorAnswer: true,
          upvotes: 8
        }
      ]
    },
    {
      id: 'qa-seed-2',
      courseId: 'all',
      title: 'Troubleshooting Node version compatibility in setup lab',
      content: 'Getting a syntax error when running the dev server with Node v16. Is Node v18 or v20 required for this course codebase?',
      category: 'Technical',
      authorName: 'Michael Chang',
      authorEmail: 'm.chang@example.com',
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      upvotes: 4,
      isResolved: true,
      answers: [
        {
          id: 'ans-seed-2',
          questionId: 'qa-seed-2',
          authorName: 'David K. (TA)',
          authorRole: 'TA',
          authorEmail: 'david.ta@shringaara.com',
          content: 'Yes! Node v18 LTS or higher is recommended due to native ES module support and Vite 5 compatibility. Updating via nvm or Node installer will resolve that syntax error immediately.',
          createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
          isInstructorAnswer: true,
          upvotes: 5
        }
      ]
    }
  ]
};

export async function fetchCourseQuestions(courseId: string): Promise<CourseQAQuestion[]> {
  let list: CourseQAQuestion[] = [];

  try {
    const q = query(
      collection(db, QA_COLLECTION),
      where('courseId', 'in', [courseId, 'all'])
    );
    const snap = await getDocs(q);
    snap.forEach((docSnap) => {
      list.push({ id: docSnap.id, ...docSnap.data() } as CourseQAQuestion);
    });
  } catch (err) {
    console.warn('Firestore Q&A fetch warning, using local fallback:', err);
  }

  // Local Storage & Seed Merging
  try {
    const localStr = localStorage.getItem(`shringaara_qa_${courseId}`);
    if (localStr) {
      const localList: CourseQAQuestion[] = JSON.parse(localStr);
      const existingIds = new Set(list.map(q => q.id));
      localList.forEach(q => {
        if (!existingIds.has(q.id)) {
          list.push(q);
        }
      });
    }
  } catch (e) {}

  if (list.length === 0) {
    const defaultSeeds = INITIAL_SEED_QUESTIONS.default.map(q => ({
      ...q,
      courseId
    }));
    list = defaultSeeds;
    localStorage.setItem(`shringaara_qa_${courseId}`, JSON.stringify(defaultSeeds));
  }

  return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function postQuestion(question: Omit<CourseQAQuestion, 'id' | 'createdAt' | 'upvotes' | 'isResolved' | 'answers'>): Promise<CourseQAQuestion> {
  const newQuestion: CourseQAQuestion = {
    ...question,
    id: `q-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    createdAt: new Date().toISOString(),
    upvotes: 0,
    isResolved: false,
    answers: []
  };

  try {
    await addDoc(collection(db, QA_COLLECTION), {
      ...newQuestion,
      createdAtServer: serverTimestamp()
    });
  } catch (err) {
    console.warn('Firestore postQuestion write warning:', err);
  }

  // Local sync
  try {
    const localKey = `shringaara_qa_${question.courseId}`;
    const existingStr = localStorage.getItem(localKey);
    const existing: CourseQAQuestion[] = existingStr ? JSON.parse(existingStr) : [];
    const updated = [newQuestion, ...existing];
    localStorage.setItem(localKey, JSON.stringify(updated));
  } catch (e) {}

  return newQuestion;
}

export async function postAnswer(
  courseId: string,
  questionId: string,
  answerData: Omit<CourseQAAnswer, 'id' | 'createdAt' | 'upvotes'>,
  allQuestions: CourseQAQuestion[]
): Promise<CourseQAQuestion[]> {
  const newAnswer: CourseQAAnswer = {
    ...answerData,
    id: `ans-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    questionId,
    createdAt: new Date().toISOString(),
    upvotes: 0
  };

  const updatedQuestions = allQuestions.map(q => {
    if (q.id === questionId) {
      const isInst = answerData.authorRole === 'Instructor' || answerData.isInstructorAnswer;
      return {
        ...q,
        isResolved: isInst ? true : q.isResolved,
        answers: [...(q.answers || []), newAnswer]
      };
    }
    return q;
  });

  // Save local
  try {
    localStorage.setItem(`shringaara_qa_${courseId}`, JSON.stringify(updatedQuestions));
  } catch (e) {}

  // Update Firestore if id is doc
  try {
    const targetQ = updatedQuestions.find(q => q.id === questionId);
    if (targetQ) {
      const docRef = doc(db, QA_COLLECTION, questionId);
      await updateDoc(docRef, {
        answers: targetQ.answers,
        isResolved: targetQ.isResolved
      });
    }
  } catch (err) {
    console.warn('Firestore updateDoc answer error:', err);
  }

  return updatedQuestions;
}

export async function toggleUpvoteQuestion(
  courseId: string,
  questionId: string,
  allQuestions: CourseQAQuestion[]
): Promise<CourseQAQuestion[]> {
  const updated = allQuestions.map(q => {
    if (q.id === questionId) {
      return { ...q, upvotes: q.upvotes + 1 };
    }
    return q;
  });

  try {
    localStorage.setItem(`shringaara_qa_${courseId}`, JSON.stringify(updated));
  } catch (e) {}

  return updated;
}
