import React, { useRef, useState } from 'react';
import { X, Award, Download, Printer, CheckCircle2, Sparkles, ShieldCheck, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  courseTitle: string;
  completionDate: string;
  certificateId: string;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  studentName,
  courseTitle,
  completionDate,
  certificateId
}) => {
  const certRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    if (!certRef.current) return;
    setIsGenerating(true);

    try {
      const element = certRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#020617',
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      const cleanName = (studentName || 'Student').replace(/[^a-zA-Z0-9]/g, '_');
      pdf.save(`Certificate_${cleanName}_${certificateId}.pdf`);
    } catch (err) {
      console.error('Failed to generate PDF certificate:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8 text-slate-100">
        
        {/* Modal Action Header */}
        <div className="flex flex-wrap items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800 gap-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <Award className="w-5 h-5" />
            <span>Official Completion Certificate</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              disabled={isGenerating}
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md hover:from-amber-400 hover:to-amber-300 transition-all disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" /> Print
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable & Canvas Certificate View */}
        <div 
          ref={certRef}
          className="p-8 sm:p-12 print:p-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-8 border-slate-800/80 m-4 rounded-xl text-center relative overflow-hidden shadow-inner"
        >
          {/* Subtle Watermark BG */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <Sparkles className="w-96 h-96 text-amber-400" />
          </div>

          <div className="relative z-10 space-y-6">
            
            {/* Header Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs uppercase tracking-widest font-bold">
              <ShieldCheck className="w-4 h-4" /> Verified Credentials
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-serif">
                Shringaara Academy
              </h2>
              <p className="text-xs uppercase tracking-widest text-slate-400 font-medium">
                Certificate of Technical Mastery
              </p>
            </div>

            <div className="py-2 text-sm text-slate-300 italic">
              This is to officially certify that
            </div>

            {/* Student Name */}
            <div className="text-2xl sm:text-4xl font-bold text-amber-400 underline decoration-amber-400/40 decoration-2 underline-offset-8">
              {studentName}
            </div>

            <div className="py-2 text-sm text-slate-300">
              has successfully completed all lectures, assignments, and capstone requirements for
            </div>

            {/* Course Title */}
            <div className="text-lg sm:text-2xl font-extrabold text-white max-w-xl mx-auto leading-snug">
              {courseTitle}
            </div>

            {/* Seal & Signatures */}
            <div className="pt-8 grid grid-cols-2 gap-8 max-w-lg mx-auto text-xs text-slate-400 border-t border-slate-800/80">
              <div>
                <div className="font-serif italic text-base text-amber-300 font-bold mb-1">
                  Dr. Ananya Sharma
                </div>
                <div className="border-t border-slate-700 pt-1 font-medium text-[11px] text-slate-400">
                  Head of Academic Curriculum
                </div>
              </div>

              <div>
                <div className="font-serif italic text-base text-sky-300 font-bold mb-1">
                  Rohan Mehta
                </div>
                <div className="border-t border-slate-700 pt-1 font-medium text-[11px] text-slate-400">
                  Principal Technical Architect
                </div>
              </div>
            </div>

            {/* Verification Footer */}
            <div className="pt-4 text-[10px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-slate-800/40">
              <span>Issued Date: {completionDate}</span>
              <span className="font-mono text-slate-400">Verification ID: {certificateId}</span>
              <span>shringaaraacademy.com</span>
            </div>

          </div>

        </div>

        {/* Modal Footer Action Bar */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <CheckCircle2 className="w-4 h-4" /> 100% Course Completion Verified
          </span>

          <button
            onClick={handleDownloadPdf}
            disabled={isGenerating}
            className="text-amber-400 font-bold hover:underline flex items-center gap-1"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Official PDF</span>
          </button>
        </div>

      </div>
    </div>
  );
};
