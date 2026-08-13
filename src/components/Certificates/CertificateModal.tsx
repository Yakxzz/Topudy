import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, CheckCircle, Clock, Flame } from 'lucide-react';
import { useAppStore } from '../../store';
import type { Certificate } from '../../store';

export const CertificateModal = ({ onClose }: { onClose: () => void }) => {
  const { certificates } = useAppStore();
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  const getIcon = (type: string) => {
    switch (type) {
      case 'syllabus': return <CheckCircle size={48} className="text-emerald-500" />;
      case 'hours': return <Clock size={48} className="text-blue-500" />;
      case 'streak': return <Flame size={48} className="text-orange-500" />;
      default: return <Award size={48} className="text-[var(--accent)]" />;
    }
  };

  return (
    <>
      <motion.div 
        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/20 backdrop-blur-sm"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      >
        <motion.div 
          className="bg-[var(--bg-primary)] rounded-3xl p-8 shadow-2xl border border-[var(--border)] w-[90%] max-w-2xl relative max-h-[80vh] flex flex-col"
          initial={{ y: 50, scale: 0.9 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, scale: 0.95 }}
        >
          <button onClick={onClose} className="absolute top-6 right-6 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors z-10">
            <X size={24} />
          </button>

          <div className="flex items-center gap-3 mb-8 shrink-0">
            <Award className="text-yellow-500" size={32} />
            <h2 className="text-3xl font-serif text-[var(--text-primary)]">Your Certificates</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto hide-scrollbar grid grid-cols-1 md:grid-cols-2 gap-4">
            {certificates.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-[var(--text-secondary)]">
                <Award size={64} className="opacity-20 mb-4" />
                <p className="text-lg font-serif">No certificates yet.</p>
                <p className="text-sm">Complete subjects or study consistently to earn them!</p>
              </div>
            ) : (
              certificates.map((cert) => (
                <motion.button
                  key={cert.id}
                  onClick={() => setSelectedCert(cert)}
                  className="glass-panel p-6 rounded-2xl border border-[var(--border)] text-left hover:scale-105 transition-transform flex flex-col gap-4"
                  whileHover={{ y: -5 }}
                >
                  <div className="flex justify-between items-start">
                    {getIcon(cert.type)}
                    <span className="text-xs font-bold text-[var(--text-secondary)] bg-[var(--bg-secondary)] px-3 py-1 rounded-full uppercase tracking-wider">
                      {cert.type}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1 leading-tight">{cert.title}</h3>
                    <p className="text-xs text-[var(--text-secondary)]">Earned: {new Date(cert.dateEarned).toLocaleDateString()}</p>
                  </div>
                </motion.button>
              ))
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Diploma View */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div 
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-md"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-xl shadow-2xl w-[95%] max-w-3xl aspect-[1.414/1] relative overflow-hidden flex flex-col items-center justify-center text-center p-12 border-8 border-[var(--bg-secondary)]"
              initial={{ rotateY: 90, scale: 0.8 }} 
              animate={{ rotateY: 0, scale: 1 }} 
              exit={{ rotateY: -90, scale: 0.8 }}
              transition={{ type: "spring", damping: 20, stiffness: 100 }}
              style={{
                backgroundImage: `radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.02) 100%)`,
              }}
            >
              <button onClick={() => setSelectedCert(null)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-800 transition-colors">
                <X size={24} />
              </button>

              <div className="absolute top-0 left-0 w-full h-4 bg-[var(--accent)] opacity-20"></div>
              <div className="absolute bottom-0 left-0 w-full h-4 bg-[var(--accent)] opacity-20"></div>

              <div className="mb-8">
                {getIcon(selectedCert.type)}
              </div>
              
              <h4 className="text-gray-500 uppercase tracking-[0.3em] text-sm font-bold mb-4">Certificate of Achievement</h4>
              
              <h1 className="text-4xl md:text-5xl font-serif text-gray-800 mb-6 mx-8 leading-tight">
                {selectedCert.title}
              </h1>
              
              <p className="text-lg text-gray-600 max-w-md italic mb-12">
                This certifies that you have achieved a significant milestone: {selectedCert.description.toLowerCase()}
              </p>
              
              <div className="flex justify-between w-full max-w-lg mt-auto pt-8 border-t border-gray-200">
                <div className="text-left">
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Date Earned</p>
                  <p className="font-serif text-gray-800">{new Date(selectedCert.dateEarned).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Issued By</p>
                  <p className="font-serif text-[var(--accent)] font-bold">Topudy App</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
