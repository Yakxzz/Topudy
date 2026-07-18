import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, Lock } from 'lucide-react';
import { useAppStore } from '../../store';
import { CERTIFICATES, CertificateDef } from './certificatesData';
import { CertificateGenerator } from './CertificateGenerator';

export const CertificatesGallery = ({ onClose }: { onClose: () => void }) => {
  const { unlockedCertificates } = useAppStore();
  const [selectedCert, setSelectedCert] = useState<string | null>(null);

  const categories = ['hours', 'streak', 'tasks', 'syllabus', 'special'] as const;
  
  const getCategoryTitle = (cat: string) => {
    switch(cat) {
      case 'hours': return 'Study Hours';
      case 'streak': return 'Consistency Streaks';
      case 'tasks': return 'Task Execution';
      case 'syllabus': return 'Syllabus Mastery';
      case 'special': return 'Special Achievements';
      default: return 'Other';
    }
  };

  return (
    <>
      <motion.div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      >
        <motion.div 
          className="bg-[var(--bg-primary)] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[var(--border)] w-full max-w-4xl h-[90vh] flex flex-col relative"
          initial={{ y: 50, scale: 0.9 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, scale: 0.95 }}
        >
          <button onClick={onClose} className="absolute top-6 right-6 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors z-10 bg-[var(--bg-primary)] rounded-full p-1 shadow-sm">
            <X size={24} />
          </button>

          <div className="flex flex-col items-center mb-8 shrink-0 pt-4">
            <div className="w-16 h-16 rounded-full glass-panel flex items-center justify-center mb-4 text-[#c68a53] shadow-inner">
              <Award size={32} />
            </div>
            <h2 className="text-3xl font-serif text-[var(--text-primary)]">Certificates Gallery</h2>
            <p className="text-sm font-bold text-[var(--accent)] mt-2 bg-[var(--bg-secondary)] px-4 py-1 rounded-full border border-[var(--accent)]">
              Unlocked: {unlockedCertificates.length} / {CERTIFICATES.length}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto hide-scrollbar -mx-4 px-4 pb-12">
            <div className="space-y-12">
              {categories.map(cat => {
                const catCerts = CERTIFICATES.filter(c => c.type === cat);
                if (catCerts.length === 0) return null;
                
                const unlockedInCat = catCerts.filter(c => unlockedCertificates.includes(c.id)).length;

                return (
                  <div key={cat}>
                    <div className="flex justify-between items-end mb-4 border-b border-[var(--border)] pb-2">
                      <h3 className="text-xl font-serif text-[var(--text-primary)]">{getCategoryTitle(cat)}</h3>
                      <span className="text-xs text-[var(--text-secondary)] font-bold">{unlockedInCat} / {catCerts.length}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {catCerts.map((cert: CertificateDef) => {
                        const isUnlocked = unlockedCertificates.includes(cert.id);
                        return (
                          <div 
                            key={cert.id}
                            onClick={() => isUnlocked && setSelectedCert(cert.id)}
                            className={`relative aspect-[1.4] rounded-xl border flex flex-col items-center justify-center p-3 text-center transition-all duration-300
                              ${isUnlocked 
                                ? 'bg-white border-[#c68a53]/50 shadow-md cursor-pointer hover:scale-105 hover:shadow-lg' 
                                : 'bg-[var(--bg-secondary)] border-[var(--border)] opacity-60 grayscale cursor-not-allowed'
                              }
                            `}
                          >
                            <Award size={24} className={isUnlocked ? 'text-[#c68a53] mb-2' : 'text-gray-400 mb-2'} />
                            <span className="text-[10px] font-bold text-[var(--text-primary)] leading-tight">{cert.title}</span>
                            
                            {!isUnlocked && (
                              <div className="absolute inset-0 bg-black/5 backdrop-blur-[1px] rounded-xl flex flex-col items-center justify-center">
                                <Lock size={16} className="text-gray-500 mb-1" />
                                <span className="text-[8px] text-gray-500 font-medium px-2">{cert.description}</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {selectedCert && (
          <CertificateGenerator certId={selectedCert} onClose={() => setSelectedCert(null)} />
        )}
      </AnimatePresence>
    </>
  );
};
