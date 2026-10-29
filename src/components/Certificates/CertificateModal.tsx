import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, CheckCircle, Clock, Flame, Printer, Sparkles, BookOpen } from 'lucide-react';
import { useAppStore } from '../../store';
import type { Certificate } from '../../store';
import { sounds } from '../../utils/soundEffects';

export const CertificateModal = ({ onClose }: { onClose: () => void }) => {
  const { certificates, studentName, setStudentName } = useAppStore();
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(studentName);

  const getIcon = (type: string) => {
    switch (type) {
      case 'syllabus': return <CheckCircle size={32} className="text-emerald-500" />;
      case 'hours': return <Clock size={32} className="text-blue-500" />;
      case 'streak': return <Flame size={32} className="text-orange-500" />;
      case 'board': return <BookOpen size={32} className="text-amber-500" />;
      default: return <Award size={32} className="text-[var(--accent)]" />;
    }
  };

  const handlePrint = () => {
    sounds.playClick();
    window.print();
  };

  const saveName = () => {
    if (tempName.trim()) {
      setStudentName(tempName.trim());
      setIsEditingName(false);
    }
  };

  return (
    <>
      <motion.div 
        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
      >
        <motion.div 
          className="bg-[var(--bg-primary)] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[var(--border)] w-full max-w-2xl relative max-h-[85vh] flex flex-col"
          initial={{ y: 30, scale: 0.95 }} 
          animate={{ y: 0, scale: 1 }} 
          exit={{ y: 20, scale: 0.95 }}
        >
          <button 
            onClick={onClose} 
            className="absolute top-6 right-6 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors z-10 p-1"
          >
            <X size={22} />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 shrink-0 pr-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <Award size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-serif text-[var(--text-primary)]">Board Honors & Certificates</h2>
                <p className="text-xs text-[var(--text-secondary)]">Recognizing your dedication to 10th CBSE Excellence</p>
              </div>
            </div>

            {/* Editable Student Name */}
            <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] bg-[var(--bg-secondary)] px-3 py-1.5 rounded-full self-start sm:self-auto">
              {isEditingName ? (
                <div className="flex items-center gap-1">
                  <input 
                    type="text" 
                    value={tempName} 
                    onChange={e => setTempName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && saveName()}
                    className="p-1 px-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)] text-xs text-[var(--text-primary)] outline-none"
                    autoFocus
                  />
                  <button onClick={saveName} className="text-[var(--accent)] font-bold text-xs">Save</button>
                </div>
              ) : (
                <button onClick={() => setIsEditingName(true)} className="hover:text-[var(--text-primary)] flex items-center gap-1">
                  <span>Student: <strong className="text-[var(--text-primary)]">{studentName}</strong></span>
                  <span className="text-[10px] text-[var(--accent)] ml-1">Edit</span>
                </button>
              )}
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto hide-scrollbar grid grid-cols-1 sm:grid-cols-2 gap-4 pb-2">
            {certificates.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-16 text-[var(--text-secondary)] text-center">
                <div className="w-16 h-16 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center mb-4">
                  <Award size={32} className="opacity-40 text-yellow-500" />
                </div>
                <h3 className="text-lg font-serif text-[var(--text-primary)] mb-1">Begin Your Board Journey</h3>
                <p className="text-xs max-w-sm">
                  Complete NCERT chapters in the Syllabus, maintain a daily study streak, or attempt a 3-hour Mock Paper to unlock prestigious board diplomas!
                </p>
              </div>
            ) : (
              certificates.map((cert) => (
                <motion.button
                  key={cert.id}
                  onClick={() => {
                    sounds.playFanfare();
                    setSelectedCert(cert);
                  }}
                  className="glass-panel p-5 rounded-2xl border border-[var(--border)] text-left hover:scale-[1.02] transition-all flex flex-col justify-between gap-3 shadow-sm hover:border-[var(--accent)] group"
                  whileHover={{ y: -2 }}
                >
                  <div className="flex justify-between items-start">
                    <div className="p-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
                      {getIcon(cert.type)}
                    </div>
                    <span className="text-[10px] font-bold text-[var(--text-secondary)] bg-[var(--bg-secondary)] px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {cert.type}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-[var(--text-primary)] mb-1 leading-snug group-hover:text-[var(--accent)] transition-colors">
                      {cert.title}
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] line-clamp-2">
                      {cert.description}
                    </p>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-[var(--border)]/50 text-[11px] text-[var(--text-secondary)]">
                    <span>Earned: {new Date(cert.dateEarned).toLocaleDateString()}</span>
                    <span className="text-[var(--accent)] font-semibold flex items-center gap-1">
                      <Sparkles size={11} /> View Diploma
                    </span>
                  </div>
                </motion.button>
              ))
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Fullscreen Printable Diploma View */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div 
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 overflow-y-auto"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="printable-certificate bg-[#fffdfa] text-[#2c2724] rounded-2xl shadow-2xl w-full max-w-3xl relative overflow-hidden flex flex-col items-center justify-between text-center p-8 sm:p-12 border-8 border-[#ebd5b3] my-auto"
              initial={{ rotateY: 90, scale: 0.85 }} 
              animate={{ rotateY: 0, scale: 1 }} 
              exit={{ rotateY: -90, scale: 0.85 }}
              transition={{ type: "spring", damping: 20, stiffness: 100 }}
              style={{
                backgroundImage: `radial-gradient(circle at center, transparent 0%, rgba(180, 150, 100, 0.04) 100%)`,
              }}
            >
              {/* Top controls (hidden in print) */}
              <div className="absolute top-4 right-4 flex items-center gap-2 print:hidden">
                <button 
                  onClick={handlePrint}
                  className="px-3 py-1.5 rounded-xl bg-[var(--accent)] text-white text-xs font-semibold flex items-center gap-1.5 shadow-md hover:bg-[var(--accent-hover)] transition-colors"
                >
                  <Printer size={14} /> Print / Save PDF
                </button>
                <button 
                  onClick={() => setSelectedCert(null)} 
                  className="p-1.5 rounded-xl text-gray-400 hover:text-gray-800 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Gold borders */}
              <div className="absolute inset-2 border-2 border-[#d4af37]/40 pointer-events-none rounded-lg" />
              <div className="absolute inset-3 border border-[#d4af37]/20 pointer-events-none rounded-lg" />

              {/* Seal Icon */}
              <div className="w-16 h-16 rounded-full bg-[#f8f1e5] border-2 border-[#d4af37] flex items-center justify-center mb-4 shadow-md text-amber-600">
                <Award size={36} />
              </div>

              <h4 className="font-diploma text-[#8c6d33] uppercase tracking-[0.25em] text-xs sm:text-sm font-bold mb-2">
                Certificate of Academic Excellence
              </h4>

              <p className="text-xs uppercase tracking-widest text-[#7a6d5d] mb-4">
                Central Board of Secondary Education • Class 10 Preparation
              </p>

              <div className="w-24 h-0.5 bg-[#d4af37]/60 mx-auto mb-6" />

              <p className="text-xs sm:text-sm italic text-[#5a524a] mb-2">This is proudly conferred upon</p>

              <h2 className="font-serif text-3xl sm:text-4xl text-[#1a1714] font-bold mb-4 tracking-tight">
                {studentName}
              </h2>

              <p className="text-xs sm:text-sm text-[#4a4239] max-w-lg mb-6 leading-relaxed">
                For demonstrating exceptional discipline, scholarly diligence, and mastering the milestone:
              </p>

              <div className="p-4 px-6 rounded-2xl bg-[#fdf8f0] border border-[#e5d5be] max-w-md w-full mb-8 shadow-inner">
                <h3 className="font-serif text-xl sm:text-2xl text-[#8c4a16] font-bold mb-1">
                  {selectedCert.title}
                </h3>
                <p className="text-xs text-[#6e5d4e]">
                  {selectedCert.description}
                </p>
              </div>

              {/* Signatures & Seal Footer */}
              <div className="flex justify-between items-end w-full max-w-md pt-6 border-t border-[#e2d5c3] text-left">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[#8a7f72] mb-0.5">Date Issued</p>
                  <p className="font-mono-timer text-xs font-bold text-[#2a241e]">
                    {new Date(selectedCert.dateEarned).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 rounded-full border-2 border-[#d4af37] flex items-center justify-center mx-auto text-[9px] font-bold text-[#8c6d33] uppercase tracking-widest leading-none">
                    SEAL
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-wider text-[#8a7f72] mb-0.5">Verification</p>
                  <p className="font-serif text-xs font-bold text-[#44624a]">Topudy • Yaksh Verma</p>
                  <p className="text-[9px] text-[#8a7f72]">Official 10th CBSE Certification</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
