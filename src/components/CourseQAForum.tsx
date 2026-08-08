import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Send, 
  ThumbsUp, 
  CheckCircle2, 
  HelpCircle, 
  Search, 
  Filter, 
  User, 
  Plus, 
  ChevronDown, 
  ChevronUp, 
  Award, 
  Sparkles,
  ShieldCheck,
  Tag
} from 'lucide-react';
import { CourseQAQuestion, CourseQAAnswer, Course } from '../types';
import { useApp } from '../context/AppContext';
import { fetchCourseQuestions, postQuestion, postAnswer, toggleUpvoteQuestion } from '../lib/courseQaService';

interface CourseQAForumProps {
  course: Course;
  currentLessonId?: string;
}

export const CourseQAForum: React.FC<CourseQAForumProps> = ({ course, currentLessonId }) => {
  const { currentUserName, currentUserEmail, isStudentLoggedIn, openAuthModal, isAdmin } = useApp();
  
  const [questions, setQuestions] = useState<CourseQAQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filter & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'resolved' | 'unanswered'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  
  // New Question Form
  const [isAsking, setIsAsking] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<'General' | 'Technical' | 'Lecture Code' | 'Assignment'>('Technical');
  const [isPosting, setIsPosting] = useState(false);

  // Active Expanded Question for Replies
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [isSubmittingReply, setIsSubmittingReply] = useState<string | null>(null);

  // Load questions
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    fetchCourseQuestions(course.id).then(data => {
      if (isMounted) {
        setQuestions(data);
        setIsLoading(false);
        // Expand first question by default if available
        if (data.length > 0) {
          setExpandedQuestionId(data[0].id);
        }
      }
    });
    return () => { isMounted = false; };
  }, [course.id]);

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isStudentLoggedIn && !isAdmin) {
      openAuthModal('login');
      return;
    }

    if (!newTitle.trim() || !newContent.trim()) return;

    setIsPosting(true);
    const created = await postQuestion({
      courseId: course.id,
      lessonId: currentLessonId,
      authorName: currentUserName || (isAdmin ? 'Academy Admin' : 'Student Learner'),
      authorEmail: currentUserEmail || 'student@example.com',
      title: newTitle.trim(),
      content: newContent.trim(),
      category: newCategory
    });

    setQuestions(prev => [created, ...prev]);
    setNewTitle('');
    setNewContent('');
    setIsAsking(false);
    setIsPosting(false);
    setExpandedQuestionId(created.id);
  };

  const handleAddAnswer = async (questionId: string) => {
    if (!isStudentLoggedIn && !isAdmin) {
      openAuthModal('login');
      return;
    }

    const text = replyText[questionId]?.trim();
    if (!text) return;

    setIsSubmittingReply(questionId);

    const isInstructor = isAdmin || course.instructor?.name === currentUserName;
    const authorRole = isInstructor ? 'Instructor' : 'Student';

    const updated = await postAnswer(
      course.id,
      questionId,
      {
        questionId,
        authorName: currentUserName || (isInstructor ? (course.instructor?.name || 'Academy Instructor') : 'Student Learner'),
        authorRole: authorRole,
        authorEmail: currentUserEmail || 'student@example.com',
        content: text,
        isInstructorAnswer: isInstructor
      },
      questions
    );

    setQuestions(updated);
    setReplyText(prev => ({ ...prev, [questionId]: '' }));
    setIsSubmittingReply(null);
  };

  const handleUpvote = async (questionId: string) => {
    const updated = await toggleUpvoteQuestion(course.id, questionId, questions);
    setQuestions(updated);
  };

  // Filtering Logic
  const filteredQuestions = questions.filter(q => {
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery = !query || 
      q.title.toLowerCase().includes(query) || 
      q.content.toLowerCase().includes(query) ||
      q.authorName.toLowerCase().includes(query);

    const matchesStatus = 
      filterStatus === 'all' ? true :
      filterStatus === 'resolved' ? q.isResolved :
      !q.isResolved;

    const matchesCat = filterCategory === 'all' || q.category === filterCategory;

    return matchesQuery && matchesStatus && matchesCat;
  });

  return (
    <div id="course-qa-forum" className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-extrabold text-white">Course Q&A Discussion Forum</h3>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-extrabold text-xs border border-amber-400/40">
                {questions.length} Questions
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Ask questions about lecture topics, code syntax, or capstone labs. Answered directly by <span className="text-amber-400 font-semibold">{course.instructor?.name || 'Course Instructor'}</span>.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (!isStudentLoggedIn && !isAdmin) {
              openAuthModal('login');
            } else {
              setIsAsking(!isAsking);
            }
          }}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold text-xs hover:from-amber-400 hover:to-amber-300 transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{isAsking ? 'Cancel Post' : 'Ask a Question'}</span>
        </button>
      </div>

      {/* Ask Question Form */}
      {isAsking && (
        <form onSubmit={handleAskQuestion} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span>Post New Question to {course.title}</span>
            </h4>
            <span className="text-xs text-slate-400">Posting as: <strong className="text-amber-400">{currentUserName || 'Student'}</strong></span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2 space-y-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Question Title</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g., How do I fix CORS error in Lesson 3 API fetch?"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Category Tag</label>
              <select
                value={newCategory}
                onChange={(e: any) => setNewCategory(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="Technical">Technical & Debugging</option>
                <option value="Lecture Code">Lecture Code Syntax</option>
                <option value="Assignment">Assignment & Capstone</option>
                <option value="General">General Question</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Detailed Question Description</label>
            <textarea
              required
              rows={3}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Describe what you are trying to accomplish, error messages, or code snippets..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={() => setIsAsking(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPosting}
              className="px-5 py-2.5 rounded-xl bg-amber-400 text-slate-950 text-xs font-bold hover:bg-amber-300 transition-all flex items-center gap-2 shadow-md disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isPosting ? 'Publishing...' : 'Submit Question'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        
        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions or keywords..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Filter dropdowns */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filterStatus}
            onChange={(e: any) => setFilterStatus(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-amber-400"
          >
            <option value="all">All Statuses</option>
            <option value="resolved">Instructor Answered</option>
            <option value="unanswered">Unanswered</option>
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-amber-400"
          >
            <option value="all">All Tags</option>
            <option value="Technical">Technical</option>
            <option value="Lecture Code">Lecture Code</option>
            <option value="Assignment">Assignment</option>
            <option value="General">General</option>
          </select>
        </div>
      </div>

      {/* Question Cards List */}
      {isLoading ? (
        <div className="space-y-4 py-8 text-center animate-pulse">
          <div className="h-20 bg-slate-950 border border-slate-800 rounded-2xl"></div>
          <div className="h-20 bg-slate-950 border border-slate-800 rounded-2xl"></div>
        </div>
      ) : filteredQuestions.length === 0 ? (
        <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-10 text-center space-y-3">
          <HelpCircle className="w-10 h-10 text-slate-600 mx-auto" />
          <h4 className="text-sm font-bold text-white">No questions match your filter criteria</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Be the first student to post a question for {course.title}!
          </p>
          <button
            onClick={() => setIsAsking(true)}
            className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs"
          >
            Post Question Now
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQuestions.map((q) => {
            const isExpanded = expandedQuestionId === q.id;
            const answerCount = q.answers?.length || 0;
            const hasInstructorAnswer = q.answers?.some(a => a.isInstructorAnswer || a.authorRole === 'Instructor');

            return (
              <div 
                key={q.id}
                className={`bg-slate-950 border rounded-2xl transition-all overflow-hidden ${
                  isExpanded ? 'border-amber-400/60 shadow-xl' : 'border-slate-800/80 hover:border-slate-700'
                }`}
              >
                {/* Question Header */}
                <div 
                  onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                  className="p-5 cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {q.category && (
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-amber-400 text-[10px] font-bold flex items-center gap-1">
                          <Tag className="w-2.5 h-2.5" />
                          {q.category}
                        </span>
                      )}

                      {hasInstructorAnswer ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-extrabold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Instructor Answered
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold">
                          Pending Response
                        </span>
                      )}

                      <span className="text-[11px] text-slate-500">•</span>
                      <span className="text-[11px] text-slate-400">
                        Posted by <strong className="text-slate-200">{q.authorName}</strong>
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {new Date(q.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white hover:text-amber-400 transition-colors">
                      {q.title}
                    </h4>

                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {q.content}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-slate-800 w-full sm:w-auto justify-between sm:justify-end">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpvote(q.id);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold hover:text-amber-400 hover:border-amber-400/40 transition-colors flex items-center gap-1.5"
                    >
                      <ThumbsUp className="w-3.5 h-3.5 text-amber-400" />
                      <span>{q.upvotes}</span>
                    </button>

                    <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                      <span>{answerCount} {answerCount === 1 ? 'Answer' : 'Answers'}</span>
                    </span>

                    <div className="text-slate-500 p-1">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Answer Body & Discussion Thread */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-slate-800/80 space-y-5 bg-slate-900/50">
                    
                    {/* Full question description */}
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 leading-relaxed space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Question Details:</span>
                      <p>{q.content}</p>
                    </div>

                    {/* Answers List */}
                    <div className="space-y-3">
                      <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <span>Discussion & Answers ({answerCount})</span>
                      </h5>

                      {answerCount === 0 ? (
                        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/60 text-xs text-slate-400 text-center">
                          No answers submitted yet. Be the first to help out!
                        </div>
                      ) : (
                        q.answers.map((ans) => (
                          <div 
                            key={ans.id}
                            className={`p-4 rounded-2xl border space-y-2 text-xs transition-all ${
                              ans.isInstructorAnswer || ans.authorRole === 'Instructor'
                                ? 'bg-amber-400/5 border-amber-400/40 ring-1 ring-amber-400/20'
                                : 'bg-slate-950 border-slate-800'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                                  ans.isInstructorAnswer || ans.authorRole === 'Instructor'
                                    ? 'bg-amber-400 text-slate-950'
                                    : 'bg-slate-800 text-slate-300'
                                }`}>
                                  {ans.authorName.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-white">{ans.authorName}</span>
                                    {ans.isInstructorAnswer || ans.authorRole === 'Instructor' ? (
                                      <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-extrabold text-[9px] uppercase tracking-wider flex items-center gap-1">
                                        <Award className="w-2.5 h-2.5" />
                                        Instructor
                                      </span>
                                    ) : (
                                      <span className="text-[10px] text-slate-400 font-medium">Student</span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <span className="text-[10px] text-slate-500">
                                {new Date(ans.createdAt).toLocaleString()}
                              </span>
                            </div>

                            <p className="text-slate-200 leading-relaxed pl-9">
                              {ans.content}
                            </p>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Post Reply Input Box */}
                    <div className="pt-2 border-t border-slate-800">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-400 text-xs font-bold shrink-0 mt-1">
                          {(currentUserName || 'U').charAt(0)}
                        </div>
                        <div className="flex-1 space-y-2">
                          <textarea
                            rows={2}
                            value={replyText[q.id] || ''}
                            onChange={(e) => setReplyText(prev => ({ ...prev, [q.id]: e.target.value }))}
                            placeholder={`Reply to ${q.authorName}'s question...`}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                          />
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-slate-500">
                              {isAdmin ? 'Replying as Certified Instructor' : 'Replying as Enrolled Student'}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleAddAnswer(q.id)}
                              disabled={isSubmittingReply === q.id || !replyText[q.id]?.trim()}
                              className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300 transition-all flex items-center gap-1.5 disabled:opacity-50"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>{isSubmittingReply === q.id ? 'Posting...' : 'Post Answer'}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
