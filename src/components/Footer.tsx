import React from 'react';
import { Sparkles, Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NewsletterSignup } from './NewsletterSignup';

interface FooterProps {
  navigate: (route: string) => void;
  openBookingModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate, openBookingModal }) => {
  const { siteSettings } = useApp();

  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-300 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Newsletter Signup Banner */}
        <div className="max-w-3xl mx-auto">
          <NewsletterSignup />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              {siteSettings.logoUrl ? (
                <img 
                  src={siteSettings.logoUrl} 
                  alt={siteSettings.siteName || "Logo"} 
                  className="h-9 w-auto max-w-[240px] object-contain rounded-lg"
                />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-amber-400 flex items-center justify-center text-slate-950 font-bold shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
              )}
              <span className="font-semibold text-xl tracking-tight text-white">
                {siteSettings.siteName || 'Shringaara Academy'}
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              {siteSettings.footerText || 'Technical training and professional service without the translation tax. Built with care, precise execution, and zero unnecessary jargon.'}
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-amber-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Consultation Booking Open
              </span>
              <span>•</span>
              <span>{siteSettings.contactEmail || 'contact@shringaaraacademy.com'}</span>
            </div>
          </div>

          {/* Service Links */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">
              Core Services
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => navigate('service-ds')} className="hover:text-amber-400 transition-colors">
                  Data Analytics & Data Science
                </button>
              </li>
              <li>
                <button onClick={() => navigate('service-coding')} className="hover:text-amber-400 transition-colors">
                  Development & Coding
                </button>
              </li>
              <li>
                <button onClick={() => navigate('service-design')} className="hover:text-amber-400 transition-colors">
                  Design & UI/UX Systems
                </button>
              </li>
              <li>
                <button onClick={() => navigate('service-qa')} className="hover:text-amber-400 transition-colors">
                  Quality Assurance & QA
                </button>
              </li>
            </ul>
          </div>

          {/* Academy & LMS */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">
              Academy & Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => navigate('courses')} className="hover:text-amber-400 transition-colors">
                  Courses Catalog
                </button>
              </li>
              <li>
                <button onClick={() => navigate('dashboard')} className="hover:text-amber-400 transition-colors">
                  Student LMS Portal
                </button>
              </li>
              <li>
                <button onClick={() => navigate('work')} className="hover:text-amber-400 transition-colors">
                  Work Portfolio
                </button>
              </li>
              <li>
                <button onClick={() => navigate('process')} className="hover:text-amber-400 transition-colors">
                  Our 4-Step Process
                </button>
              </li>
              <li>
                <button onClick={() => navigate('faq')} className="hover:text-amber-400 transition-colors">
                  FAQ & Help Center
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Contact & Policies */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">
              Contact & Support
            </h4>
            <div className="space-y-3 text-sm text-slate-400 mb-4">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{siteSettings.contactEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{siteSettings.contactPhone}</span>
              </div>
              {siteSettings.address && (
                <div className="flex items-start gap-2 text-xs text-slate-400">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{siteSettings.address}</span>
                </div>
              )}
            </div>
            <button
              onClick={openBookingModal}
              className="w-full text-center px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-amber-400 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Book Consultation</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Bottom Bar with Copyright & Informational Legal Links */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} {siteSettings.siteName || 'Shringaara Academy'}. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <button onClick={() => navigate('about')} className="hover:text-slate-300 transition-colors">
              About Us
            </button>
            <button onClick={() => navigate('contact')} className="hover:text-slate-300 transition-colors">
              Contact
            </button>
            <button onClick={() => navigate('privacy')} className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </button>
            <button onClick={() => navigate('terms')} className="hover:text-slate-300 transition-colors">
              Terms of Service
            </button>
            <button onClick={() => navigate('refund')} className="hover:text-slate-300 transition-colors">
              Refund Policy
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};

