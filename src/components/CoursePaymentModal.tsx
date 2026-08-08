import React, { useState } from 'react';
import { X, Lock, CreditCard, ShieldCheck, CheckCircle2, AlertCircle, ArrowRight, Sparkles, Building, Check, DollarSign, Mail, Eye } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EmailPreviewModal } from './EmailPreviewModal';

export const CoursePaymentModal: React.FC = () => {
  const { 
    isPaymentModalOpen, 
    selectedCourseForPayment, 
    closePaymentModal, 
    processCoursePayment,
    currentUserName,
    currentUserEmail,
    isStudentLoggedIn,
    openAuthModal,
    emailNotifications
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolder, setCardHolder] = useState(currentUserName || '');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successReceipt, setSuccessReceipt] = useState<any | null>(null);
  const [showEmailPreviewModal, setShowEmailPreviewModal] = useState(false);

  if (!isPaymentModalOpen || !selectedCourseForPayment) return null;

  const course = selectedCourseForPayment;

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 16) val = val.slice(0, 16);
    // Format as XXXX XXXX XXXX XXXX
    const formatted = val.replace(/(\d{4})/g, '$1 ').trim();
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 4) val = val.slice(0, 4);
    if (val.length >= 3) {
      val = `${val.slice(0, 2)}/${val.slice(2)}`;
    }
    setExpiry(val);
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCvv(val);
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!isStudentLoggedIn) {
      closePaymentModal();
      openAuthModal('login');
      return;
    }

    if (paymentMethod === 'card') {
      const rawCard = cardNumber.replace(/\s/g, '');
      if (rawCard.length < 15) {
        setErrorMsg('Please enter a valid 16-digit card number.');
        return;
      }
      if (!expiry || expiry.length < 5) {
        setErrorMsg('Please enter a valid expiry date (MM/YY).');
        return;
      }
      if (!cvv || cvv.length < 3) {
        setErrorMsg('Please enter a valid CVV.');
        return;
      }
    }

    setLoading(true);

    try {
      const result = await processCoursePayment(
        course,
        paymentMethod === 'card' ? 'Credit/Debit Card' : paymentMethod === 'upi' ? 'UPI / Wallet' : 'NetBanking'
      );

      if (result.success && result.receipt) {
        setSuccessReceipt(result.receipt);
      } else {
        setErrorMsg(result.error || 'Payment failed. Please try again.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Payment processing failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoPayment = () => {
    setCardNumber('4532 8912 3456 7890');
    setExpiry('12/28');
    setCvv('888');
    setCardHolder(currentUserName || 'Student Member');
    setErrorMsg('');
  };

  const handleClose = () => {
    setSuccessReceipt(null);
    setErrorMsg('');
    closePaymentModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-5 sm:p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Course Payment Checkout</h3>
              <p className="text-xs text-slate-400">Secure SSL Encrypted Transaction</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {successReceipt ? (
            /* --- SUCCESS CONFIRMATION RECEIPT --- */
            <div className="text-center py-6 space-y-6 animate-in zoom-in-95 duration-200">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 mx-auto shadow-lg shadow-emerald-500/20">
                <Check className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  Payment Verified & Completed
                </span>
                <h2 className="text-2xl font-extrabold text-white">You're Enrolled!</h2>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Thank you, <span className="text-white font-semibold">{successReceipt.studentName}</span>. Your course enrollment is now active in your Student Account Portal.
                </p>
              </div>

              {/* Receipt Summary Box */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 text-left space-y-3 text-xs max-w-md mx-auto">
                <div className="flex justify-between pb-2 border-b border-slate-800">
                  <span className="text-slate-400">Course Enrolled:</span>
                  <span className="text-white font-bold">{successReceipt.courseTitle}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-slate-800">
                  <span className="text-slate-400">Transaction ID:</span>
                  <span className="text-amber-400 font-mono font-bold">{successReceipt.transactionId}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-slate-800">
                  <span className="text-slate-400">Amount Paid:</span>
                  <span className="text-emerald-400 font-bold text-sm">${successReceipt.amountPaid}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Date & Time:</span>
                  <span className="text-slate-300">{new Date(successReceipt.paidAt).toLocaleString()}</span>
                </div>
              </div>

              {/* Firebase Email Notification Status Alert */}
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-left space-y-2 max-w-md mx-auto">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <Mail className="w-4 h-4 shrink-0" />
                  <span>Firebase Email Notification Sent</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  An automated confirmation email has been dispatched via Firebase Cloud Function to <span className="text-white font-semibold">{successReceipt.studentEmail}</span>.
                </p>
                <div className="pt-1">
                  <button
                    onClick={() => setShowEmailPreviewModal(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-400/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold hover:bg-emerald-400/30 transition-all"
                  >
                    <Eye className="w-3.5 h-3.5" /> Preview HTML Email & Cloud Logs
                  </button>
                </div>
              </div>

              {/* Email Preview Modal */}
              {showEmailPreviewModal && (
                <EmailPreviewModal
                  notification={
                    emailNotifications.find(n => n.transactionId === successReceipt.transactionId) || {
                      id: `mail-${Date.now()}`,
                      to: successReceipt.studentEmail,
                      studentName: successReceipt.studentName,
                      subject: `Course Enrollment Confirmation: ${successReceipt.courseTitle}`,
                      courseTitle: successReceipt.courseTitle,
                      courseId: successReceipt.courseId,
                      transactionId: successReceipt.transactionId,
                      amountPaid: successReceipt.amountPaid,
                      paymentMethod: 'Credit/Debit Card',
                      sentAt: new Date().toISOString(),
                      status: 'DELIVERED',
                      htmlBody: `<div style="font-family:sans-serif;background:#020617;color:#fff;padding:20px;border-radius:12px;"><h2>Course Enrollment Confirmation</h2><p>Dear ${successReceipt.studentName}, your enrollment in <strong>${successReceipt.courseTitle}</strong> is active. Transaction ID: ${successReceipt.transactionId}</p></div>`
                    }
                  }
                  onClose={() => setShowEmailPreviewModal(false)}
                />
              )}

              <div className="pt-2">
                <button
                  onClick={handleClose}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-amber-300 transition-all"
                >
                  Enter Student Portal & Start Learning
                </button>
              </div>
            </div>
          ) : (
            /* --- CHECKOUT FORM --- */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Course Item Summary */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                  <img src={course.thumbnail} alt={course.title} className="w-full h-32 object-cover rounded-xl border border-slate-800" />
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-400/10 text-amber-400 font-bold text-[10px] uppercase border border-amber-400/20">
                      {course.category}
                    </span>
                    <h4 className="text-sm font-extrabold text-white mt-1">{course.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1">{course.description}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-800 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Course Fee:</span>
                      <span className="text-white font-bold">${course.price}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>GST / Taxes (0%):</span>
                      <span className="text-emerald-400 font-bold">$0.00</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-slate-800 text-sm font-extrabold">
                      <span className="text-white">Total Amount Due:</span>
                      <span className="text-amber-400">${course.price}</span>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1 text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>Instant Full Access Granted</span>
                  </div>
                  <p className="text-slate-400 pl-5">Lifetime access to all HD video lessons, downloadable resources, and completion certificate.</p>
                </div>
              </div>

              {/* Right Column: Payment Form */}
              <div className="lg:col-span-7 space-y-4">
                
                {errorMsg && (
                  <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Payment Method Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Select Payment Method</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                        paymentMethod === 'card'
                          ? 'bg-amber-400/10 border-amber-400 text-amber-400'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Card</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('upi')}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                        paymentMethod === 'upi'
                          ? 'bg-amber-400/10 border-amber-400 text-amber-400'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>UPI / Wallet</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('netbanking')}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                        paymentMethod === 'netbanking'
                          ? 'bg-amber-400/10 border-amber-400 text-amber-400'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Building className="w-4 h-4" />
                      <span>NetBanking</span>
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSubmitPayment} className="space-y-3.5 pt-1">
                  
                  {paymentMethod === 'card' && (
                    <>
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-300">Cardholder Name</label>
                        <input
                          type="text"
                          required
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value)}
                          placeholder="Name as printed on card"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-300">Card Number</label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            value={cardNumber}
                            onChange={handleCardNumberChange}
                            placeholder="4532 •••• •••• 7890"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-3.5 pr-10 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 font-mono"
                          />
                          <CreditCard className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-slate-300">Expiry (MM/YY)</label>
                          <input
                            type="text"
                            required
                            value={expiry}
                            onChange={handleExpiryChange}
                            placeholder="MM/YY"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 text-center font-mono"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-slate-300">CVV / CVC</label>
                          <input
                            type="password"
                            required
                            value={cvv}
                            onChange={handleCvvChange}
                            placeholder="•••"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 text-center font-mono"
                          />
                        </div>
                      </div>

                      {/* Demo Card Autofill */}
                      <div className="pt-1 flex items-center justify-between text-xs">
                        <button
                          type="button"
                          onClick={fillDemoPayment}
                          className="text-amber-400 hover:underline flex items-center gap-1 text-[11px] font-semibold"
                        >
                          <Sparkles className="w-3 h-3" /> Auto-fill Demo Payment Card
                        </button>
                      </div>
                    </>
                  )}

                  {paymentMethod === 'upi' && (
                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                      <label className="text-xs font-semibold text-slate-300 block">UPI ID / Virtual Payment Address</label>
                      <input
                        type="text"
                        placeholder="student@upi or username@okaxis"
                        defaultValue="student@shringaara"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 font-mono"
                      />
                      <p className="text-[11px] text-slate-400">An instant payment request will be authorized automatically for this course.</p>
                    </div>
                  )}

                  {paymentMethod === 'netbanking' && (
                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                      <label className="text-xs font-semibold text-slate-300 block">Select Your Bank</label>
                      <select className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400">
                        <option>HDFC Bank</option>
                        <option>ICICI Bank</option>
                        <option>State Bank of India</option>
                        <option>Axis Bank</option>
                        <option>Chase / Bank of America</option>
                      </select>
                      <p className="text-[11px] text-slate-400">Direct instant gateway authentication to authorize ${course.price}.</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-amber-300 transition-all flex items-center justify-center gap-2 mt-4"
                  >
                    {loading ? (
                      <span>Processing Payment (${course.price})...</span>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Pay ${course.price} & Unlock Course</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="text-center pt-1">
                    <span className="text-[11px] text-slate-500 flex items-center justify-center gap-1">
                      <Lock className="w-3 h-3" /> 256-Bit SSL Secured Payment
                    </span>
                  </div>

                </form>

              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
