import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, Sparkles, Bell, ShieldCheck } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const NewsletterSignup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [categoryPreference, setCategoryPreference] = useState('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      // Save subscriber to Firestore
      await addDoc(collection(db, 'newsletter_subscribers'), {
        email: cleanEmail,
        preference: categoryPreference,
        subscribedAt: serverTimestamp(),
        source: 'Footer Newsletter Component'
      });
    } catch (err) {
      console.warn('Firestore newsletter write warning (using local persistence):', err);
    }

    // Always fallback to localStorage
    try {
      const existing = JSON.parse(localStorage.getItem('shringaara_subscribers') || '[]');
      if (!existing.includes(cleanEmail)) {
        existing.push(cleanEmail);
        localStorage.setItem('shringaara_subscribers', JSON.stringify(existing));
      }
    } catch (e) {
      console.warn('LocalStorage subscriber save warning:', e);
    }

    setIsSubmitting(false);
    setIsSuccess(true);
    setEmail('');
  };

  return (
    <div id="newsletter-signup-box" className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
            Academy Newsletter
          </span>
        </div>
        <h3 className="text-base font-extrabold text-white">
          Stay Ahead with New Course Releases & Events
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Get weekly tech insights, course launch discounts, and invitations to live technical workshops. Zero spam.
        </p>
      </div>

      {isSuccess ? (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs space-y-2 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 font-bold text-emerald-400">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>You're Subscribed!</span>
          </div>
          <p className="text-[11px] text-slate-300">
            Thank you for subscribing. We've added your email to our VIP announcement dispatch list.
          </p>
          <button
            type="button"
            onClick={() => setIsSuccess(false)}
            className="text-[11px] text-amber-400 font-bold hover:underline pt-1 block"
          >
            Subscribe another email
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          {errorMsg && (
            <p className="text-[11px] text-red-400 font-semibold bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-lg">
              {errorMsg}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-2">
            {/* Email Input */}
            <div className="relative flex-1">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            {/* Interest Category Selector */}
            <select
              value={categoryPreference}
              onChange={(e) => setCategoryPreference(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="all">All Topics</option>
              <option value="data-science">Data Science</option>
              <option value="coding">Software Dev</option>
              <option value="designing">UI/UX Design</option>
              <option value="qa">QA Testing</option>
            </select>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 hover:bg-amber-300 transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Joining...' : 'Subscribe'}</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>We respect your privacy. Unsubscribe anytime with one click.</span>
          </div>
        </form>
      )}
    </div>
  );
};
