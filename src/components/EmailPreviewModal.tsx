import React, { useState } from 'react';
import { X, Mail, CheckCircle2, ShieldCheck, RefreshCw, Terminal, ExternalLink, Code, Eye, Send } from 'lucide-react';
import { EmailNotification } from '../types';

interface EmailPreviewModalProps {
  notification: EmailNotification | null;
  onClose: () => void;
  onResend?: (notif: EmailNotification) => void;
}

export const EmailPreviewModal: React.FC<EmailPreviewModalProps> = ({
  notification,
  onClose,
  onResend
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'logs' | 'source'>('preview');
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  if (!notification) return null;

  const handleResendClick = () => {
    if (onResend) {
      setIsResending(true);
      setTimeout(() => {
        onResend(notification);
        setIsResending(false);
        setResendSuccess(true);
        setTimeout(() => setResendSuccess(false), 3000);
      }, 600);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Firebase Email Notification</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase">
                  {notification.status}
                </span>
              </div>
              <p className="text-xs text-slate-400">Recipient: <span className="text-slate-200">{notification.to}</span></p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-Header Tabs */}
        <div className="px-6 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'preview'
                  ? 'bg-amber-400/10 border border-amber-400/30 text-amber-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" /> HTML Preview
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'logs'
                  ? 'bg-amber-400/10 border border-amber-400/30 text-amber-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" /> Cloud Function Logs
            </button>
            <button
              onClick={() => setActiveTab('source')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'source'
                  ? 'bg-amber-400/10 border border-amber-400/30 text-amber-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Code className="w-3.5 h-3.5" /> HTML Code
            </button>
          </div>

          {onResend && (
            <button
              onClick={handleResendClick}
              disabled={isResending}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-white hover:bg-slate-700 transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin text-amber-400' : ''}`} />
              <span>{resendSuccess ? 'Email Dispatched!' : 'Resend Email'}</span>
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          
          {activeTab === 'preview' && (
            <div className="space-y-3">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Subject:</span>
                  <span className="text-white font-semibold">{notification.subject}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Sent Date:</span>
                  <span className="text-slate-300">{new Date(notification.sentAt).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Transaction ID:</span>
                  <span className="text-amber-400 font-mono font-bold">{notification.transactionId}</span>
                </div>
              </div>

              {/* Rendered HTML inside an iframe / styled box */}
              <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950">
                <iframe
                  title="Confirmation Email Preview"
                  srcDoc={notification.htmlBody}
                  className="w-full h-[380px] bg-slate-950 border-0"
                />
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Firebase Cloud Function Event Stream: <code>onDocumentCreated('email_notifications')</code></span>
                <span className="text-emerald-400 font-mono font-bold">STATUS: OK (200)</span>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-xs space-y-3">
                {notification.deliveryLogs && notification.deliveryLogs.length > 0 ? (
                  notification.deliveryLogs.map((log, idx) => (
                    <div key={idx} className="flex items-start gap-3 pb-3 border-b border-slate-800/60 last:border-0 last:pb-0">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0 animate-ping"></div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-amber-400 font-bold">[{log.stage}]</span>
                          <span className="text-slate-500 text-[10px]">{new Date(log.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <p className="text-slate-300 text-xs">{log.message}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-slate-500 py-4 text-center">No verbose cloud logs found. Status: DELIVERED.</div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'source' && (
            <div className="space-y-2">
              <label className="text-xs text-slate-400 block font-mono">Raw HTML Payload:</label>
              <pre className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-[11px] font-mono text-amber-200 overflow-x-auto max-h-[360px]">
                {notification.htmlBody}
              </pre>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Verified Firebase Cloud Dispatch Service</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-700 transition-colors"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};
