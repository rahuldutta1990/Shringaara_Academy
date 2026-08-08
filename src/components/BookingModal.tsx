import React, { useState, useEffect } from 'react';
import { X, Calendar as CalendarIcon, Clock, Video, CheckCircle2, AlertCircle, Copy, Download, ExternalLink, ArrowRight, Sparkles, User, Mail, Phone, MessageSquare } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ServiceCategory, Booking } from '../types';

export const BookingModal: React.FC = () => {
  const { isBookingModalOpen, closeBookingModal, selectedBookingService, handleBookingSubmit, currentUserEmail, currentUserName, bookings } = useApp();

  const [service, setService] = useState<ServiceCategory>(selectedBookingService || 'data-science');
  const [name, setName] = useState(currentUserName || '');
  const [email, setEmail] = useState(currentUserEmail || '');
  const [phone, setPhone] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [timeSlot, setTimeSlot] = useState<string>('03:30 PM - 04:30 PM');
  const [notes, setNotes] = useState('');
  const [addToGoogleCal, setAddToGoogleCal] = useState(true);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [copiedZoom, setCopiedZoom] = useState(false);

  // Sync selected service if passed from parent
  useEffect(() => {
    if (selectedBookingService) {
      setService(selectedBookingService);
    }
  }, [selectedBookingService]);

  // Set default date to tomorrow YYYY-MM-DD
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setSelectedDate(tomorrow.toISOString().split('T')[0]);
  }, [isBookingModalOpen]);

  if (!isBookingModalOpen) return null;

  // Active bookings count for this user
  const activeUserBookings = bookings.filter(
    b => b.userEmail.toLowerCase() === email.toLowerCase().trim() && b.status === 'scheduled'
  );
  const activeCount = activeUserBookings.length;

  const TIME_SLOTS = [
    '09:00 AM - 10:00 AM',
    '10:30 AM - 11:30 AM',
    '02:00 PM - 03:00 PM',
    '03:30 PM - 04:30 PM',
    '05:00 PM - 06:00 PM'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim() || !email.trim()) {
      setErrorMsg('Please enter your full name and email address.');
      return;
    }

    if (!selectedDate) {
      setErrorMsg('Please select a valid consultation date.');
      return;
    }

    // Check 24 hour lead time
    const bookingDateTime = new Date(`${selectedDate}T10:00:00`);
    const now = new Date();
    if (bookingDateTime.getTime() - now.getTime() < 12 * 60 * 60 * 1000) {
      setErrorMsg('Please select a date at least 24 hours in advance.');
      return;
    }

    // Check Max 2 limit
    if (activeCount >= 2) {
      setErrorMsg('You already have 2 active consultations scheduled (maximum limit reached). Please complete existing sessions before booking a new one.');
      return;
    }

    setLoading(true);

    try {
      // Generate Zoom details
      const meetingId = Math.floor(10000000000 + Math.random() * 90000000000).toString();
      const passcode = Math.floor(100000 + Math.random() * 900000).toString();
      const zoomUrl = `https://zoom.us/j/${meetingId}?pwd=${passcode}`;

      const newBookingData = {
        userName: name.trim(),
        userEmail: email.toLowerCase().trim(),
        userPhone: phone.trim(),
        serviceCategory: service,
        scheduledDate: selectedDate,
        timeSlot: timeSlot,
        status: 'scheduled' as const,
        zoomUrl,
        zoomPasscode: passcode,
        notes: notes.trim()
      };

      const result = await handleBookingSubmit(newBookingData);
      setConfirmedBooking(result);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error processing consultation booking.');
    } finally {
      setLoading(false);
    }
  };

  const copyZoomUrl = () => {
    if (confirmedBooking?.zoomUrl) {
      navigator.clipboard.writeText(confirmedBooking.zoomUrl);
      setCopiedZoom(true);
      setTimeout(() => setCopiedZoom(false), 2500);
    }
  };

  const generateGoogleCalendarUrl = () => {
    if (!confirmedBooking) return '#';
    const dateStr = confirmedBooking.scheduledDate.replace(/-/g, '');
    const startTime = '153000'; // Default 3:30 PM UTC representation
    const endTime = '163000';
    const title = encodeURIComponent(`Shringaara Academy Consultation (${confirmedBooking.serviceCategory.toUpperCase()})`);
    const details = encodeURIComponent(`1-on-1 Consultation Session\nZoom Join Link: ${confirmedBooking.zoomUrl}\nPasscode: ${confirmedBooking.zoomPasscode}`);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dateStr}T${startTime}Z/${dateStr}T${endTime}Z&details=${details}`;
  };

  const downloadIcsFile = () => {
    if (!confirmedBooking) return;
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Shringaara Academy//Consultation Booking//EN
BEGIN:VEVENT
SUMMARY:Shringaara Academy Consultation - ${confirmedBooking.serviceCategory.toUpperCase()}
DESCRIPTION:Join Zoom Meeting: ${confirmedBooking.zoomUrl}\\nPasscode: ${confirmedBooking.zoomPasscode}
DTSTART:${confirmedBooking.scheduledDate.replace(/-/g, '')}T153000Z
DTEND:${confirmedBooking.scheduledDate.replace(/-/g, '')}T163000Z
LOCATION:${confirmedBooking.zoomUrl}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `Shringaara-Consultation-${confirmedBooking.scheduledDate}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8 text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950/60 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 font-bold">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Schedule 1-on-1 Consultation</h3>
              <p className="text-xs text-slate-400">Direct technical strategy & learning roadmap session</p>
            </div>
          </div>
          <button
            onClick={closeBookingModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* SUCCESS CONFIRMATION VIEW */}
          {confirmedBooking ? (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-base text-white">Consultation Booking Confirmed!</h4>
                  <p className="text-xs text-emerald-300 mt-0.5">
                    A confirmation email with meeting instructions has been generated for <span className="underline font-semibold">{confirmedBooking.userEmail}</span>.
                  </p>
                </div>
              </div>

              {/* Booking Specs Summary */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-xs text-slate-500 block uppercase font-bold">Scheduled Date</span>
                    <span className="font-semibold text-white">{confirmedBooking.scheduledDate}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block uppercase font-bold">Time Slot</span>
                    <span className="font-semibold text-amber-400">{confirmedBooking.timeSlot}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block uppercase font-bold">Service Category</span>
                    <span className="font-semibold text-white capitalize">{confirmedBooking.serviceCategory.replace('-', ' ')}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block uppercase font-bold">Active Limit</span>
                    <span className="font-semibold text-slate-300">{activeCount + 1}/2 Max Consultations</span>
                  </div>
                </div>

                {/* Zoom Box */}
                <div className="pt-3 border-t border-slate-800">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Video className="w-4 h-4 text-sky-400" /> Auto-Generated Zoom Meeting
                    </span>
                    <span className="text-[10px] text-amber-400/90 font-medium">Passcode: {confirmedBooking.zoomPasscode}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={confirmedBooking.zoomUrl}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none"
                    />
                    <button
                      onClick={copyZoomUrl}
                      className="px-3 py-2 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 border border-sky-500/40 text-xs font-semibold shrink-0 flex items-center gap-1 transition-colors"
                    >
                      {copiedZoom ? 'Copied!' : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1.5">
                    * Note: Zoom metadata is encrypted and automatically purged 24 hours post-meeting according to privacy policy.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href={generateGoogleCalendarUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-amber-400" /> Add to Google Calendar
                </a>

                <button
                  onClick={downloadIcsFile}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-sky-400" /> Download .ICS Calendar
                </button>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    setConfirmedBooking(null);
                    closeBookingModal();
                  }}
                  className="px-6 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-sm hover:bg-amber-300 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* FORM INPUT VIEW */
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Active Bookings Limit Alert Banner */}
              {activeCount > 0 && (
                <div className={`p-3 rounded-xl text-xs flex items-center justify-between border ${
                  activeCount >= 2 
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' 
                    : 'bg-slate-800 border-slate-700 text-slate-300'
                }`}>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-400" />
                    Consultation Status: <strong className="text-white">{activeCount}/2 Active Scheduled</strong>
                  </span>
                  {activeCount >= 2 && <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Max Limit Reached</span>}
                </div>
              )}

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Full Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@example.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Service & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Service Category *</label>
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value as ServiceCategory)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 transition-colors"
                  >
                    <option value="data-science">Data Analytics & Data Science</option>
                    <option value="coding">Development & Coding</option>
                    <option value="design">Design & UI/UX Systems</option>
                    <option value="qa">Quality Assurance & Testing</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Phone Number (Optional)</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Date & Time Slot Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Select Date *</label>
                  <input
                    type="date"
                    required
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Available Time Slot *</label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 transition-colors"
                  >
                    {TIME_SLOTS.map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Topic or Questions (Optional)</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Tell us briefly about your goals, project context, or specific questions..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 transition-colors resize-none"
                />
              </div>

              {/* Google Calendar Toggle */}
              <div className="pt-1 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="googleCalToggle"
                  checked={addToGoogleCal}
                  onChange={(e) => setAddToGoogleCal(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-800 text-amber-500 focus:ring-amber-400 h-4 w-4"
                />
                <label htmlFor="googleCalToggle" className="text-xs text-slate-400 cursor-pointer">
                  Auto-generate Google Calendar sync link upon booking
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={closeBookingModal}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || activeCount >= 2}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
                >
                  {loading ? 'Processing Booking...' : 'Confirm Consultation'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
