import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, XCircle, ShieldCheck, Crown } from 'lucide-react';
import { useAppStore } from '../../store';

export const PaywallModal = ({ onClose }: { onClose: () => void }) => {
  const { activatePremium, isPremium } = useAppStore();
  const [showActivation, setShowActivation] = useState(false);
  const [activationKey, setActivationKey] = useState('');
  const [error, setError] = useState(false);

  const handleActivate = () => {
    // Secret Key: TOPUDY_PREMIUM_UNLOCK
    if (btoa(activationKey.trim().toUpperCase()) === 'VE9QVURZX1BSRU1JVU1fVU5MT0NL') {
      activatePremium('lifetime');
      onClose();
    } else {
      setError(true);
    }
  };

  if (isPremium) return null;

  return (
    <motion.div 
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <motion.div 
        className="bg-[var(--bg-primary)] rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-[var(--border)] relative"
        initial={{ y: 50, scale: 0.9 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, scale: 0.95 }}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors z-10 bg-[var(--bg-secondary)] rounded-full p-2">
          <X size={20} />
        </button>

        <div className="bg-[var(--accent)] text-white p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
            <Crown size={150} />
          </div>
          <Crown size={48} className="mx-auto mb-4" />
          <h2 className="text-3xl font-serif font-bold">Topudy Premium</h2>
          <p className="mt-2 text-white/80 text-sm max-w-xs mx-auto">
            Your 10-minute trial has expired. Upgrade to continue your uninterrupted study experience.
          </p>
        </div>

        <div className="p-8">
          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center border-b border-[var(--border)] pb-3">
              <span className="text-[var(--text-primary)] font-medium">Access</span>
              <div className="flex gap-8 text-sm">
                <span className="flex items-center gap-1 text-red-500 w-24"><XCircle size={16}/> 10 mins</span>
                <span className="flex items-center gap-1 text-green-500 font-bold w-24"><Check size={16}/> Unlimited</span>
              </div>
            </div>

            <div className="flex justify-between items-center border-b border-[var(--border)] pb-3">
              <div>
                <span className="text-[var(--text-primary)] font-medium block">Syllabus Tools</span>
                <span className="text-[10px] text-[var(--text-secondary)]">Class 9th & 10th Built-in</span>
              </div>
              <div className="flex gap-8 text-sm items-center">
                <span className="flex items-center gap-1 text-red-500 w-24"><XCircle size={16}/> Manual</span>
                <span className="flex flex-col items-start gap-0.5 w-24">
                  <span className="flex items-center gap-1 text-green-500 font-bold"><Check size={16}/> Pre-built</span>
                  <span className="text-[9px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Beta / Soon™</span>
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center border-b border-[var(--border)] pb-3">
              <div>
                <span className="text-[var(--text-primary)] font-medium block">Data Recovery</span>
                <span className="text-[10px] text-[var(--text-secondary)]">Cross-device sync</span>
              </div>
              <div className="flex gap-8 text-sm items-center">
                <span className="flex items-center gap-1 text-red-500 w-24"><XCircle size={16}/> No</span>
                <span className="flex items-center gap-1 text-green-500 font-bold w-24"><Check size={16}/> Yes *</span>
              </div>
            </div>
            
            <p className="text-[10px] text-[var(--text-secondary)] italic text-right mt-1">
              * There are chances for this, currently under beta construction and coming soon.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {!showActivation ? (
              <motion.div 
                key="pricing"
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center mb-6">
                  <span className="text-xs uppercase tracking-widest text-[var(--text-secondary)] font-bold mb-1 block">Lifetime Billing</span>
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-xl text-[var(--text-secondary)] line-through decoration-red-500/50">₹199</span>
                    <span className="text-4xl font-black text-[var(--text-primary)]">₹29 <span className="text-lg text-[var(--text-secondary)] font-medium">only</span></span>
                  </div>
                </div>

                <button 
                  onClick={() => setShowActivation(true)}
                  className="w-full py-4 rounded-2xl bg-[var(--accent)] text-white font-bold tracking-widest uppercase hover:bg-[var(--accent-hover)] transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 mb-4"
                >
                  <ShieldCheck size={20} />
                  Buy Premium Access
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="activation"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              >
                <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl mb-6">
                  <p className="text-sm text-orange-800 font-medium text-center">
                    To process payment and access premium services, please contact the author of the website directly.
                  </p>
                  <p className="text-xs text-orange-600 text-center mt-2 italic">
                    Automated payment apps currently not supported.
                  </p>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Activation Key</label>
                  <input 
                    type="text" 
                    value={activationKey}
                    onChange={(e) => {
                      setActivationKey(e.target.value);
                      setError(false);
                    }}
                    placeholder="Enter offline key..."
                    className={`w-full p-4 rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)] border ${error ? 'border-red-500' : 'border-[var(--border)]'} outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all font-mono`}
                  />
                  {error && <p className="text-xs text-red-500 font-medium">Invalid activation key.</p>}
                  
                  <button 
                    onClick={handleActivate}
                    disabled={!activationKey.trim()}
                    className="w-full py-4 rounded-xl bg-[var(--text-primary)] text-[var(--bg-primary)] font-bold tracking-widest uppercase hover:opacity-90 transition-all disabled:opacity-50 mt-4"
                  >
                    Activate Premium
                  </button>
                  <button 
                    onClick={() => setShowActivation(false)}
                    className="w-full py-2 text-[var(--text-secondary)] text-sm font-medium hover:text-[var(--text-primary)] transition-colors mt-2"
                  >
                    Go Back
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-center text-xs text-[var(--text-secondary)] mt-6">
            If you close this, you will only have access to Study Mode. Don't worry, your data is backed up locally.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};
