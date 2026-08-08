import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Course, Booking, ServiceCategory, SiteSettings, AdminCredentials, PageContent, FaqItem } from '../types';
import { 
  Lock, ShieldCheck, Key, LogOut, Plus, Trash2, Edit3, CheckCircle, XCircle, 
  RefreshCw, BarChart3, BookOpen, Calendar, Users, Eye, FileText, Database, 
  Sparkles, Video, Upload, Image as ImageIcon, Save, Check, HelpCircle, UserCheck, 
  Layout, Globe, Phone, Mail, MapPin, Clock, ArrowRight
} from 'lucide-react';

export const Admin: React.FC = () => {
  const { 
    isAdmin, 
    adminLogin, 
    adminLogout, 
    bookings, 
    courses, 
    enrollments, 
    handleSaveCourse, 
    handleDeleteCourse, 
    handlePurgeZoomLink,
    handleUpdateBookingStatus,
    refreshData,
    siteSettings,
    handleSaveSiteSettings,
    adminCreds,
    handleSaveAdminCredentials,
    pageContent,
    handleSavePageContent
  } = useApp();

  // Authentication gate state
  const [adminIdInput, setAdminIdInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState(false);

  // Active Tab state
  const [activeTab, setActiveTab] = useState<'analytics' | 'branding' | 'pages' | 'security' | 'bookings' | 'courses' | 'enrollments'>('analytics');
  
  // Page content editing sub-tab
  const [pageSubTab, setPageSubTab] = useState<'home' | 'about' | 'privacy' | 'terms' | 'refund' | 'contact' | 'faq'>('home');

  // Local Form States
  const [localSiteSettings, setLocalSiteSettings] = useState<SiteSettings>(siteSettings);
  const [localAdminCreds, setLocalAdminCreds] = useState<AdminCredentials>(adminCreds);
  const [localPageContent, setLocalPageContent] = useState<PageContent>(pageContent);

  // Success Feedback Toast States
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Booking filter state
  const [bookingFilterStatus, setBookingFilterStatus] = useState<string>('all');

  // Course Editor Modal State
  const [editingCourse, setEditingCourse] = useState<Partial<Course> | null>(null);

  // Keep local states synced when remote state changes
  React.useEffect(() => {
    setLocalSiteSettings(siteSettings);
  }, [siteSettings]);

  React.useEffect(() => {
    setLocalAdminCreds(adminCreds);
  }, [adminCreds]);

  React.useEffect(() => {
    setLocalPageContent(pageContent);
  }, [pageContent]);

  const showSuccessToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 4000);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = adminLogin(adminIdInput, passwordInput);
    if (!success) {
      setAuthError(true);
    } else {
      setAuthError(false);
      setPasswordInput('');
      setAdminIdInput('');
    }
  };

  // Image File Reader Helper for Logo and Favicon
  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size too large! Please upload an image under 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setLocalSiteSettings(prev => ({ ...prev, logoUrl: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFaviconFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1 * 1024 * 1024) {
        alert('Favicon size too large! Please upload an icon under 1MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setLocalSiteSettings(prev => ({ ...prev, faviconUrl: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const saveBrandingSettings = async () => {
    await handleSaveSiteSettings(localSiteSettings);
    showSuccessToast('Branding & Site Settings saved! Applied instantly to the website.');
  };

  const saveAdminCreds = async () => {
    if (!localAdminCreds.adminId || !localAdminCreds.password) {
      alert('Admin ID and Password cannot be empty.');
      return;
    }
    await handleSaveAdminCredentials(localAdminCreds);
    showSuccessToast('Admin Credentials updated in database successfully!');
  };

  const savePagesContent = async () => {
    await handleSavePageContent(localPageContent);
    showSuccessToast('Page details saved! Real-time reflection applied to frontend.');
  };

  // --- LOGIN GATE SCREEN IF NOT AUTHENTICATED ---
  if (!isAdmin) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6 shadow-2xl text-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-400 flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-extrabold text-white">Shringaara Admin Portal</h2>
            <p className="text-xs text-slate-400">Database Authentication Gate (Admin ID & Password)</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {authError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-center">
                Invalid Admin ID or Passcode. Default: ID: <strong>admin</strong> | Pass: <strong>admin123</strong> or <strong>shringaara2026</strong>.
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Admin ID *</label>
              <div className="relative">
                <UserCheck className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={adminIdInput}
                  onChange={(e) => setAdminIdInput(e.target.value)}
                  placeholder="admin"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Admin Password *</label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Authenticate & Open Dashboard</span>
            </button>
          </form>

          <div className="pt-2 text-center text-[11px] text-slate-500">
            Shringaara Academy • Firestore Database Protected
          </div>
        </div>
      </div>
    );
  }

  // --- PROTECTED ADMIN DASHBOARD ---
  const filteredBookings = bookingFilterStatus === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === bookingFilterStatus);

  const totalRevenue = courses.reduce((acc, c) => acc + (c.price * enrollments.filter(e => e.courseId === c.id).length), 0);

  return (
    <div className="space-y-8 pb-16 pt-6">
      
      {/* Toast Notification Banner */}
      {saveToast && (
        <div className="fixed top-24 right-6 z-50 bg-emerald-500 text-slate-950 px-5 py-3 rounded-xl font-bold text-xs shadow-2xl border border-emerald-300 flex items-center gap-2 animate-bounce">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Top Admin Header Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-white">Administrative Management Dashboard</h1>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                  Real-time Database Live
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Control site logos, favicons, dynamic page contents, admin credentials, courses, and bookings.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={refreshData}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Refresh Firestore Data"
            >
              <RefreshCw className="w-4 h-4" /> Sync Database
            </button>
            <button
              onClick={adminLogout}
              className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-4 h-4" /> Logout Admin
            </button>
          </div>
        </div>
      </section>

      {/* Admin Navigation Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto scrollbar-none">
          {[
            { id: 'analytics', label: 'Platform Analytics', icon: <BarChart3 className="w-4 h-4" /> },
            { id: 'branding', label: 'Logo & Favicon Uploader', icon: <ImageIcon className="w-4 h-4" /> },
            { id: 'pages', label: 'Informational Pages Manager', icon: <Layout className="w-4 h-4" /> },
            { id: 'security', label: 'Admin ID & Password', icon: <Key className="w-4 h-4" /> },
            { id: 'bookings', label: `Consultations (${bookings.length})`, icon: <Calendar className="w-4 h-4" /> },
            { id: 'courses', label: `Courses (${courses.length})`, icon: <BookOpen className="w-4 h-4" /> },
            { id: 'enrollments', label: `Enrollments (${enrollments.length})`, icon: <Users className="w-4 h-4" /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/10'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* TAB 1: ANALYTICS */}
      {activeTab === 'analytics' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
              <span className="text-xs text-slate-500 font-bold uppercase">Total Bookings</span>
              <div className="text-2xl font-extrabold text-amber-400">{bookings.length}</div>
              <div className="text-[10px] text-slate-400">{bookings.filter(b => b.status === 'scheduled').length} Active Scheduled</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
              <span className="text-xs text-slate-500 font-bold uppercase">Active Courses</span>
              <div className="text-2xl font-extrabold text-sky-400">{courses.length}</div>
              <div className="text-[10px] text-slate-400">{courses.filter(c => c.featured).length} Featured on Home</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
              <span className="text-xs text-slate-500 font-bold uppercase">Student Enrollments</span>
              <div className="text-2xl font-extrabold text-purple-400">{enrollments.length}</div>
              <div className="text-[10px] text-slate-400">{enrollments.filter(e => e.progressPercent >= 100).length} Certificates Issued</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
              <span className="text-xs text-slate-500 font-bold uppercase">Estimated Revenue</span>
              <div className="text-2xl font-extrabold text-emerald-400">${totalRevenue}</div>
              <div className="text-[10px] text-slate-400">All courses current pricing</div>
            </div>
          </div>
        </section>
      )}

      {/* TAB 2: LOGO, FAVICON & BRANDING MANAGER */}
      {activeTab === 'branding' && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-white">Logo & Favicon Uploader Provision</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Upload specific size brand logo and browser favicon. Changes update the database and reflect immediately without a page refresh.
                </p>
              </div>
              <button
                onClick={saveBrandingSettings}
                className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-400/20 transition-all"
              >
                <Save className="w-4 h-4" /> Save Branding Settings
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Logo Uploader */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-amber-400" />
                    <span>Website Brand Logo</span>
                  </h3>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-amber-400 font-mono">
                    240 × 80 px (Max 2MB)
                  </span>
                </div>

                {/* Preview Box */}
                <div className="h-28 bg-slate-900 border border-dashed border-slate-700 rounded-xl flex items-center justify-center p-4 text-center">
                  {localSiteSettings.logoUrl ? (
                    <img
                      src={localSiteSettings.logoUrl}
                      alt="Brand Logo Preview"
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <div className="text-xs text-slate-500 space-y-1">
                      <Sparkles className="w-6 h-6 text-amber-400 mx-auto opacity-40" />
                      <div>No custom logo uploaded yet.</div>
                      <div className="text-[10px] text-slate-600">Default fallback icon is active.</div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-300">Upload Logo Image File</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoFileUpload}
                    className="block w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-amber-400 hover:file:bg-slate-700 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Or Paste Direct Image URL</label>
                  <input
                    type="text"
                    value={localSiteSettings.logoUrl || ''}
                    onChange={(e) => setLocalSiteSettings({ ...localSiteSettings, logoUrl: e.target.value })}
                    placeholder="https://example.com/logo.png"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              {/* Favicon Uploader */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Globe className="w-4 h-4 text-amber-400" />
                    <span>Browser Favicon</span>
                  </h3>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-amber-400 font-mono">
                    32 × 32 px (Max 1MB)
                  </span>
                </div>

                {/* Preview Box */}
                <div className="h-28 bg-slate-900 border border-dashed border-slate-700 rounded-xl flex items-center justify-center p-4 text-center">
                  {localSiteSettings.faviconUrl ? (
                    <div className="flex items-center gap-3">
                      <img
                        src={localSiteSettings.faviconUrl}
                        alt="Favicon Preview"
                        className="w-8 h-8 object-contain rounded-md border border-slate-700"
                      />
                      <span className="text-xs text-slate-300 font-mono">Live Favicon Preview</span>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-500 space-y-1">
                      <Globe className="w-6 h-6 text-slate-600 mx-auto" />
                      <div>No custom favicon uploaded.</div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-300">Upload Favicon Icon File (.ico / .png)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFaviconFileUpload}
                    className="block w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-amber-400 hover:file:bg-slate-700 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Or Paste Direct Favicon URL</label>
                  <input
                    type="text"
                    value={localSiteSettings.faviconUrl || ''}
                    onChange={(e) => setLocalSiteSettings({ ...localSiteSettings, faviconUrl: e.target.value })}
                    placeholder="https://example.com/favicon.ico"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

            </div>

            {/* General Site Metadata Details */}
            <div className="pt-6 border-t border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white">General Site Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Site Name</label>
                  <input
                    type="text"
                    value={localSiteSettings.siteName}
                    onChange={(e) => setLocalSiteSettings({ ...localSiteSettings, siteName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Site Tagline</label>
                  <input
                    type="text"
                    value={localSiteSettings.tagline}
                    onChange={(e) => setLocalSiteSettings({ ...localSiteSettings, tagline: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Contact Email</label>
                  <input
                    type="email"
                    value={localSiteSettings.contactEmail}
                    onChange={(e) => setLocalSiteSettings({ ...localSiteSettings, contactEmail: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Contact Phone</label>
                  <input
                    type="text"
                    value={localSiteSettings.contactPhone}
                    onChange={(e) => setLocalSiteSettings({ ...localSiteSettings, contactPhone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-400 mb-1 font-semibold">Physical Address</label>
                  <input
                    type="text"
                    value={localSiteSettings.address}
                    onChange={(e) => setLocalSiteSettings({ ...localSiteSettings, address: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-400 mb-1 font-semibold">Footer About Summary</label>
                  <textarea
                    rows={2}
                    value={localSiteSettings.footerText}
                    onChange={(e) => setLocalSiteSettings({ ...localSiteSettings, footerText: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={saveBrandingSettings}
                  className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-400/20 transition-all"
                >
                  <Save className="w-4 h-4" /> Save Branding & Settings
                </button>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* TAB 3: DYNAMIC INFORMATIONAL PAGES MANAGER */}
      {activeTab === 'pages' && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-white">Dynamic Informational Pages Editor</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Edit headlines, policy bodies, FAQs, and contact details. Saving immediately updates the database and reflects live on the website without refresh.
                </p>
              </div>
              <button
                onClick={savePagesContent}
                className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-400/20 transition-all shrink-0"
              >
                <Save className="w-4 h-4" /> Save Page Content
              </button>
            </div>

            {/* Sub-navigation for Page selection */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800">
              {[
                { id: 'home', label: 'Home Hero' },
                { id: 'about', label: 'About Us' },
                { id: 'privacy', label: 'Privacy Policy' },
                { id: 'terms', label: 'Terms of Service' },
                { id: 'refund', label: 'Refund Policy' },
                { id: 'contact', label: 'Contact Page' },
                { id: 'faq', label: 'FAQ Center' }
              ].map(sub => (
                <button
                  key={sub.id}
                  onClick={() => setPageSubTab(sub.id as any)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    pageSubTab === sub.id
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>

            {/* HOME PAGE EDIT FORM */}
            {pageSubTab === 'home' && (
              <div className="space-y-4 text-xs">
                <h3 className="text-sm font-bold text-white">Home Page Hero Configuration</h3>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Hero Main Headline Title</label>
                  <input
                    type="text"
                    value={localPageContent.home.heroTitle}
                    onChange={(e) => setLocalPageContent({
                      ...localPageContent,
                      home: { ...localPageContent.home, heroTitle: e.target.value }
                    })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Hero Subtitle Text</label>
                  <textarea
                    rows={3}
                    value={localPageContent.home.heroSubtitle}
                    onChange={(e) => setLocalPageContent({
                      ...localPageContent,
                      home: { ...localPageContent.home, heroSubtitle: e.target.value }
                    })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Primary CTA Button Text</label>
                  <input
                    type="text"
                    value={localPageContent.home.ctaText}
                    onChange={(e) => setLocalPageContent({
                      ...localPageContent,
                      home: { ...localPageContent.home, ctaText: e.target.value }
                    })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>
            )}

            {/* ABOUT PAGE EDIT FORM */}
            {pageSubTab === 'about' && (
              <div className="space-y-4 text-xs">
                <h3 className="text-sm font-bold text-white">About Us Page Details</h3>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Title</label>
                  <input
                    type="text"
                    value={localPageContent.about.title}
                    onChange={(e) => setLocalPageContent({
                      ...localPageContent,
                      about: { ...localPageContent.about, title: e.target.value }
                    })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Subtitle</label>
                  <textarea
                    rows={2}
                    value={localPageContent.about.subtitle}
                    onChange={(e) => setLocalPageContent({
                      ...localPageContent,
                      about: { ...localPageContent.about, subtitle: e.target.value }
                    })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Mission Statement</label>
                  <textarea
                    rows={3}
                    value={localPageContent.about.missionText}
                    onChange={(e) => setLocalPageContent({
                      ...localPageContent,
                      about: { ...localPageContent.about, missionText: e.target.value }
                    })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Vision Statement</label>
                  <textarea
                    rows={3}
                    value={localPageContent.about.visionText}
                    onChange={(e) => setLocalPageContent({
                      ...localPageContent,
                      about: { ...localPageContent.about, visionText: e.target.value }
                    })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Origin Story</label>
                  <textarea
                    rows={3}
                    value={localPageContent.about.storyText}
                    onChange={(e) => setLocalPageContent({
                      ...localPageContent,
                      about: { ...localPageContent.about, storyText: e.target.value }
                    })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>
            )}

            {/* PRIVACY POLICY EDIT FORM */}
            {pageSubTab === 'privacy' && (
              <div className="space-y-4 text-xs">
                <h3 className="text-sm font-bold text-white">Privacy Policy Page Details</h3>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Page Title</label>
                  <input
                    type="text"
                    value={localPageContent.privacy.title}
                    onChange={(e) => setLocalPageContent({
                      ...localPageContent,
                      privacy: { ...localPageContent.privacy, title: e.target.value }
                    })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Last Updated Date</label>
                  <input
                    type="text"
                    value={localPageContent.privacy.lastUpdated}
                    onChange={(e) => setLocalPageContent({
                      ...localPageContent,
                      privacy: { ...localPageContent.privacy, lastUpdated: e.target.value }
                    })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Full Privacy Policy Content</label>
                  <textarea
                    rows={12}
                    value={localPageContent.privacy.content}
                    onChange={(e) => setLocalPageContent({
                      ...localPageContent,
                      privacy: { ...localPageContent.privacy, content: e.target.value }
                    })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* TERMS OF SERVICE EDIT FORM */}
            {pageSubTab === 'terms' && (
              <div className="space-y-4 text-xs">
                <h3 className="text-sm font-bold text-white">Terms of Service Page Details</h3>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Page Title</label>
                  <input
                    type="text"
                    value={localPageContent.terms.title}
                    onChange={(e) => setLocalPageContent({
                      ...localPageContent,
                      terms: { ...localPageContent.terms, title: e.target.value }
                    })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Last Updated Date</label>
                  <input
                    type="text"
                    value={localPageContent.terms.lastUpdated}
                    onChange={(e) => setLocalPageContent({
                      ...localPageContent,
                      terms: { ...localPageContent.terms, lastUpdated: e.target.value }
                    })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Full Terms of Service Content</label>
                  <textarea
                    rows={12}
                    value={localPageContent.terms.content}
                    onChange={(e) => setLocalPageContent({
                      ...localPageContent,
                      terms: { ...localPageContent.terms, content: e.target.value }
                    })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* REFUND POLICY EDIT FORM */}
            {pageSubTab === 'refund' && (
              <div className="space-y-4 text-xs">
                <h3 className="text-sm font-bold text-white">Refund & Cancellation Policy Details</h3>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Page Title</label>
                  <input
                    type="text"
                    value={localPageContent.refund.title}
                    onChange={(e) => setLocalPageContent({
                      ...localPageContent,
                      refund: { ...localPageContent.refund, title: e.target.value }
                    })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Last Updated Date</label>
                  <input
                    type="text"
                    value={localPageContent.refund.lastUpdated}
                    onChange={(e) => setLocalPageContent({
                      ...localPageContent,
                      refund: { ...localPageContent.refund, lastUpdated: e.target.value }
                    })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Full Refund Policy Content</label>
                  <textarea
                    rows={12}
                    value={localPageContent.refund.content}
                    onChange={(e) => setLocalPageContent({
                      ...localPageContent,
                      refund: { ...localPageContent.refund, content: e.target.value }
                    })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* CONTACT PAGE EDIT FORM */}
            {pageSubTab === 'contact' && (
              <div className="space-y-4 text-xs">
                <h3 className="text-sm font-bold text-white">Contact Page Content & Info</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Page Title</label>
                    <input
                      type="text"
                      value={localPageContent.contact.title}
                      onChange={(e) => setLocalPageContent({
                        ...localPageContent,
                        contact: { ...localPageContent.contact, title: e.target.value }
                      })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Email</label>
                    <input
                      type="email"
                      value={localPageContent.contact.email}
                      onChange={(e) => setLocalPageContent({
                        ...localPageContent,
                        contact: { ...localPageContent.contact, email: e.target.value }
                      })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Phone</label>
                    <input
                      type="text"
                      value={localPageContent.contact.phone}
                      onChange={(e) => setLocalPageContent({
                        ...localPageContent,
                        contact: { ...localPageContent.contact, phone: e.target.value }
                      })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Working Hours</label>
                    <input
                      type="text"
                      value={localPageContent.contact.workingHours}
                      onChange={(e) => setLocalPageContent({
                        ...localPageContent,
                        contact: { ...localPageContent.contact, workingHours: e.target.value }
                      })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-slate-400 mb-1 font-semibold">Subtitle Description</label>
                    <input
                      type="text"
                      value={localPageContent.contact.subtitle}
                      onChange={(e) => setLocalPageContent({
                        ...localPageContent,
                        contact: { ...localPageContent.contact, subtitle: e.target.value }
                      })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-slate-400 mb-1 font-semibold">Address</label>
                    <input
                      type="text"
                      value={localPageContent.contact.address}
                      onChange={(e) => setLocalPageContent({
                        ...localPageContent,
                        contact: { ...localPageContent.contact, address: e.target.value }
                      })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* FAQ PAGE EDIT FORM */}
            {pageSubTab === 'faq' && (
              <div className="space-y-6 text-xs">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">FAQ Questions & Answers Manager</h3>
                  <button
                    onClick={() => {
                      const newItem: FaqItem = {
                        id: `faq-${Date.now()}`,
                        question: 'New Question Title',
                        answer: 'Answer text goes here...',
                        category: 'General'
                      };
                      setLocalPageContent({
                        ...localPageContent,
                        faq: {
                          ...localPageContent.faq,
                          items: [...localPageContent.faq.items, newItem]
                        }
                      });
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 text-xs font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add New FAQ Item
                  </button>
                </div>

                <div className="space-y-4">
                  {localPageContent.faq.items.map((item, idx) => (
                    <div key={item.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-400">FAQ Item #{idx + 1}</span>
                        <button
                          onClick={() => {
                            const updatedItems = localPageContent.faq.items.filter(i => i.id !== item.id);
                            setLocalPageContent({
                              ...localPageContent,
                              faq: { ...localPageContent.faq, items: updatedItems }
                            });
                          }}
                          className="p-1 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20"
                          title="Remove FAQ Item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block text-slate-400 mb-1 font-semibold">Question</label>
                          <input
                            type="text"
                            value={item.question}
                            onChange={(e) => {
                              const updatedItems = [...localPageContent.faq.items];
                              updatedItems[idx] = { ...updatedItems[idx], question: e.target.value };
                              setLocalPageContent({
                                ...localPageContent,
                                faq: { ...localPageContent.faq, items: updatedItems }
                              });
                            }}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-400 mb-1 font-semibold">Category</label>
                          <input
                            type="text"
                            value={item.category || 'General'}
                            onChange={(e) => {
                              const updatedItems = [...localPageContent.faq.items];
                              updatedItems[idx] = { ...updatedItems[idx], category: e.target.value };
                              setLocalPageContent({
                                ...localPageContent,
                                faq: { ...localPageContent.faq, items: updatedItems }
                              });
                            }}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1 font-semibold">Answer</label>
                        <textarea
                          rows={2}
                          value={item.answer}
                          onChange={(e) => {
                            const updatedItems = [...localPageContent.faq.items];
                            updatedItems[idx] = { ...updatedItems[idx], answer: e.target.value };
                            setLocalPageContent({
                              ...localPageContent,
                              faq: { ...localPageContent.faq, items: updatedItems }
                            });
                          }}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={savePagesContent}
                className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-400/20 transition-all"
              >
                <Save className="w-4 h-4" /> Save Page Content
              </button>
            </div>

          </div>
        </section>
      )}

      {/* TAB 4: ADMIN CREDENTIALS SECURITY MANAGER */}
      {activeTab === 'security' && (
        <section className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6 shadow-xl">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-400" />
                <span>Admin Panel Credentials</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Admin ID & Password details are stored in the Firestore database. Update credentials below.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Admin ID *</label>
                <div className="relative">
                  <UserCheck className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={localAdminCreds.adminId}
                    onChange={(e) => setLocalAdminCreds({ ...localAdminCreds, adminId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Admin Password / Passcode *</label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={localAdminCreds.password}
                    onChange={(e) => setLocalAdminCreds({ ...localAdminCreds, password: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
              </div>

              {localAdminCreds.lastUpdated && (
                <div className="text-[11px] text-slate-500">
                  Last Updated: {new Date(localAdminCreds.lastUpdated).toLocaleString()}
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={saveAdminCreds}
                className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-400/10 transition-all"
              >
                <Save className="w-4 h-4" /> Save Admin Credentials in Database
              </button>
            </div>
          </div>
        </section>
      )}

      {/* TAB 5: CONSULTATION BOOKINGS MANAGER */}
      {activeTab === 'bookings' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Consultation Appointments & Zoom Sync</h2>

            <select
              value={bookingFilterStatus}
              onChange={(e) => setBookingFilterStatus(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-800">
                  <tr>
                    <th className="p-4">User Details</th>
                    <th className="p-4">Service</th>
                    <th className="p-4">Scheduled Date & Time</th>
                    <th className="p-4">Zoom Link / Passcode</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredBookings.length > 0 ? (
                    filteredBookings.map(b => (
                      <tr key={b.id || Math.random()} className="hover:bg-slate-800/40">
                        <td className="p-4">
                          <div className="font-bold text-white">{b.userName}</div>
                          <div className="text-[11px] text-slate-400">{b.userEmail}</div>
                          {b.userPhone && <div className="text-[10px] text-slate-500">{b.userPhone}</div>}
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded-full bg-slate-950 text-amber-400 font-semibold border border-amber-400/20 uppercase text-[10px]">
                            {b.serviceCategory}
                          </span>
                        </td>
                        <td className="p-4 font-mono">
                          <div className="text-white font-bold">{b.scheduledDate}</div>
                          <div className="text-[11px] text-amber-400">{b.timeSlot}</div>
                        </td>
                        <td className="p-4">
                          {b.deletedZoomAt ? (
                            <span className="text-slate-500 italic text-[11px]">Zoom Purged Post-Meeting</span>
                          ) : (
                            <div className="space-y-1">
                              <a href={b.zoomUrl} target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline font-mono text-[11px] block truncate max-w-[180px]">
                                {b.zoomUrl}
                              </a>
                              <span className="text-[10px] text-slate-400">Passcode: {b.zoomPasscode}</span>
                            </div>
                          )}
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase ${
                            b.status === 'scheduled' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                            b.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                            'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          }`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-y-1">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => b.id && handleUpdateBookingStatus(b.id, 'completed')}
                              className="p-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              title="Mark Completed"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => b.id && handleUpdateBookingStatus(b.id, 'cancelled')}
                              className="p-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30"
                              title="Cancel Session"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => b.id && handlePurgeZoomLink(b.id)}
                              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                              title="Purge Zoom Metadata"
                            >
                              <Video className="w-3.5 h-3.5 text-amber-400" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500 text-xs">
                        No consultation bookings match current filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* TAB 6: COURSE MANAGER */}
      {activeTab === 'courses' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">LMS Course Content CRUD Manager</h2>
            <button
              onClick={() => setEditingCourse({
                id: `course-${Date.now()}`,
                title: 'New Course Title',
                slug: 'new-course',
                category: 'data-science',
                description: 'Course summary description...',
                instructor: {
                  name: 'Shringaara Instructor',
                  role: 'Lead Educator',
                  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
                  bio: 'Expert instructor'
                },
                level: 'Beginner',
                duration: '10 Hours',
                rating: 5.0,
                reviewCount: 1,
                price: 0,
                thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
                featured: true,
                learningOutcomes: ['Outcome 1', 'Outcome 2'],
                prerequisites: ['None'],
                curriculum: [
                  {
                    id: 'm1',
                    title: 'Module 1: Getting Started',
                    description: 'Introduction module',
                    lessons: [
                      { id: 'l1', title: 'Lesson 1.1', duration: '15 min', videoUrl: 'https://www.youtube.com/embed/rfscVS0vtbw', description: 'Overview' }
                    ]
                  }
                ]
              })}
              className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" /> Create New Course
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.map(course => (
              <div key={course.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-950 text-amber-400 font-bold border border-amber-400/20 text-[10px] uppercase">
                      {course.category}
                    </span>
                    <span className="text-xs font-bold text-emerald-400">{course.price === 0 ? 'Free' : `$${course.price}`}</span>
                  </div>

                  <h3 className="font-bold text-base text-white mt-2">{course.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">{course.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-500">{course.curriculum.flatMap(m => m.lessons).length} Lessons</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingCourse(course)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-amber-400" /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(course.id)}
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 7: ENROLLMENTS */}
      {activeTab === 'enrollments' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-lg font-bold text-white">Student Course Enrollments Log</h2>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-800">
                <tr>
                  <th className="p-4">Student</th>
                  <th className="p-4">Course Title</th>
                  <th className="p-4">Progress</th>
                  <th className="p-4">Certificate ID</th>
                  <th className="p-4">Enrolled At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {enrollments.map(e => (
                  <tr key={e.id || Math.random()}>
                    <td className="p-4">
                      <div className="font-bold text-white">{e.userName || 'Student'}</div>
                      <div className="text-[11px] text-slate-400">{e.userEmail}</div>
                    </td>
                    <td className="p-4 font-semibold text-amber-400">{e.courseTitle}</td>
                    <td className="p-4">
                      <span className="font-bold text-white">{e.progressPercent}%</span>
                    </td>
                    <td className="p-4 font-mono text-[11px] text-emerald-400">
                      {e.certificateId || 'In Progress'}
                    </td>
                    <td className="p-4 text-slate-400">{e.enrolledAt ? new Date(e.enrolledAt).toLocaleDateString() : 'Recent'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* COURSE EDIT MODAL */}
      {editingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 text-slate-100 my-8">
            <h3 className="text-lg font-bold text-white">Edit Course Details</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Course Title</label>
                <input
                  type="text"
                  value={editingCourse.title || ''}
                  onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Category</label>
                <select
                  value={editingCourse.category || 'data-science'}
                  onChange={(e) => setEditingCourse({ ...editingCourse, category: e.target.value as ServiceCategory })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                >
                  <option value="data-science">Data Science</option>
                  <option value="coding">Development & Coding</option>
                  <option value="designing">Design & UI/UX</option>
                  <option value="qa">QA Testing</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Summary Description</label>
                <textarea
                  rows={3}
                  value={editingCourse.description || ''}
                  onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white resize-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
              <button
                onClick={() => setEditingCourse(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (editingCourse && editingCourse.id) {
                    handleSaveCourse(editingCourse as Course);
                    setEditingCourse(null);
                  }
                }}
                className="px-5 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs"
              >
                Save Course Changes
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
