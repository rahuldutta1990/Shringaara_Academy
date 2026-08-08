import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Star, MessageSquare, Send, CheckCircle2, User, ThumbsUp, LogIn } from 'lucide-react';

interface StudentReviewsProps {
  courseId: string;
}

export const StudentReviews: React.FC<StudentReviewsProps> = ({ courseId }) => {
  const { reviews, addCourseReview, isStudentLoggedIn, currentUserName, openAuthModal, enrollments } = useApp();

  const [selectedRating, setSelectedRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [commentText, setCommentText] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccessMsg, setSubmitSuccessMsg] = useState<string>('');

  // Filter reviews for this course
  const courseReviews = reviews.filter((r) => r.courseId === courseId);

  // Is student enrolled?
  const isEnrolled = enrollments.some((e) => e.courseId === courseId);

  // Average rating
  const totalReviews = courseReviews.length;
  const avgRating = totalReviews > 0
    ? (courseReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
    : '5.0';

  // Star breakdown count
  const ratingCounts = [5, 4, 3, 2, 1].map((stars) => {
    const count = courseReviews.filter((r) => r.rating === stars).length;
    const percent = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
    return { stars, count, percent };
  });

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    addCourseReview(courseId, selectedRating, commentText.trim());
    setIsSubmitting(false);

    setCommentText('');
    setSelectedRating(5);
    setSubmitSuccessMsg('Thank you! Your testimonial and star rating have been published.');
    setTimeout(() => setSubmitSuccessMsg(''), 5000);
  };

  return (
    <div id={`student-reviews-${courseId}`} className="space-y-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400">Verified Testimonials</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">Student Reviews & Ratings</h2>
        </div>

        {/* Aggregate Badge */}
        <div className="flex items-center gap-3 bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-2xl">
          <div className="text-2xl font-extrabold text-amber-400 font-mono">{avgRating}</div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-3.5 h-3.5 ${
                    star <= Math.round(Number(avgRating))
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-slate-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-[11px] text-slate-400 font-medium block">
              Based on {totalReviews} student {totalReviews === 1 ? 'review' : 'reviews'}
            </span>
          </div>
        </div>
      </div>

      {/* Ratings Distribution & Submission Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Rating Breakdown Bar Chart */}
        <div className="lg:col-span-5 space-y-3 bg-slate-950 p-5 rounded-2xl border border-slate-800/80">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Rating Distribution</h3>
          
          <div className="space-y-2">
            {ratingCounts.map(({ stars, count, percent }) => (
              <div key={stars} className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1 w-12 text-slate-400 font-mono text-[11px]">
                  <span>{stars}</span>
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                </div>

                <div className="flex-1 h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-300"
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>

                <span className="w-10 text-right text-[10px] text-slate-500 font-mono">{count} ({percent}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Review Form or Login Prompt */}
        <div className="lg:col-span-7 bg-slate-950 p-5 sm:p-6 rounded-2xl border border-slate-800/80 space-y-4">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-amber-400" /> Write Your Course Testimonial
          </h3>

          {!isStudentLoggedIn ? (
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-3">
              <p className="text-xs text-slate-400">
                Log in as a registered student to leave your star rating and feedback for this course.
              </p>
              <button
                type="button"
                onClick={() => openAuthModal('login')}
                className="px-5 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 mx-auto hover:bg-amber-300 transition-all shadow-md"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Student Login to Review</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitReview} className="space-y-4">
              {submitSuccessMsg && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{submitSuccessMsg}</span>
                </div>
              )}

              {/* Star Rating Picker */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400 block">Select Rating</label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setSelectedRating(star)}
                      className="p-1 focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= (hoverRating || selectedRating)
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-700 hover:text-slate-500'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-extrabold text-amber-400 font-mono ml-2">
                    {hoverRating || selectedRating} / 5 Stars
                  </span>
                </div>
              </div>

              {/* Review Comment Text Box */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400 block">
                  Your Feedback / Review (Logged in as <span className="text-white font-bold">{currentUserName}</span>)
                </label>
                <textarea
                  rows={3}
                  required
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share your learning experience, course quality, or instructor feedback..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 placeholder:text-slate-600 resize-none"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting || !commentText.trim()}
                  className="px-6 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 hover:bg-amber-300 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Review</span>
                </button>
              </div>
            </form>
          )}
        </div>

      </div>

      {/* Review List */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Recent Testimonials ({courseReviews.length})
        </h3>

        {courseReviews.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500 bg-slate-950 rounded-2xl border border-slate-800">
            No reviews submitted yet for this course. Be the first student to submit a rating!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courseReviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-slate-950 border border-slate-800 p-4 sm:p-5 rounded-2xl space-y-3 relative flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 font-bold text-xs">
                        {rev.studentName ? rev.studentName.charAt(0).toUpperCase() : 'S'}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">{rev.studentName}</span>
                        <span className="text-[10px] text-slate-500 font-mono">Verified Student</span>
                      </div>
                    </div>

                    {/* Star Badge */}
                    <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 px-2 py-1 rounded-lg">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-[11px] font-extrabold text-amber-400 font-mono">{rev.rating}.0</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-500">
                  <span className="font-mono">{new Date(rev.createdAt).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <ThumbsUp className="w-3 h-3 text-emerald-400" /> Helpful Review
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
