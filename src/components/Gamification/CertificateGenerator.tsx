import { useRef, useEffect } from 'react';
import { useAppStore } from '../../store';
import { CERTIFICATES } from './certificatesData';

interface Props {
  certId: string;
  onClose: () => void;
}

export const CertificateGenerator: React.FC<Props> = ({ certId, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { userName } = useAppStore();
  
  const cert = CERTIFICATES.find(c => c.id === certId);

  useEffect(() => {
    if (!canvasRef.current || !cert) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Canvas dimensions (A4 Landscape)
    canvas.width = 1123;
    canvas.height = 794;

    // Draw Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Border
    ctx.strokeStyle = '#2b2b2b';
    ctx.lineWidth = 15;
    ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);
    
    ctx.strokeStyle = '#c68a53'; // Gold-ish inner border
    ctx.lineWidth = 4;
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

    // Text Setup
    ctx.textAlign = 'center';
    
    // Header
    ctx.font = 'bold 50px "Playfair Display", serif';
    ctx.fillStyle = '#1a1a1a';
    ctx.fillText('CERTIFICATE OF ACHIEVEMENT', canvas.width / 2, 180);

    ctx.font = 'italic 20px "Playfair Display", serif';
    ctx.fillStyle = '#666666';
    ctx.fillText('This is proudly presented to', canvas.width / 2, 250);

    // Name
    ctx.font = 'bold 60px "Playfair Display", serif';
    ctx.fillStyle = '#c68a53'; // Gold name
    ctx.fillText(userName.toUpperCase() || 'STUDENT', canvas.width / 2, 350);

    // Separator line
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 250, 380);
    ctx.lineTo(canvas.width / 2 + 250, 380);
    ctx.strokeStyle = '#cccccc';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Achievement text
    ctx.font = '24px "Inter", sans-serif';
    ctx.fillStyle = '#333333';
    ctx.fillText('For successfully unlocking the milestone:', canvas.width / 2, 450);

    // Milestone Title
    ctx.font = 'bold 36px "Playfair Display", serif';
    ctx.fillStyle = '#1a1a1a';
    ctx.fillText(cert.title, canvas.width / 2, 520);

    // Description
    ctx.font = 'italic 20px "Inter", sans-serif';
    ctx.fillStyle = '#666666';
    ctx.fillText(cert.description, canvas.width / 2, 570);

    // Date
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    ctx.font = '18px "Inter", sans-serif';
    ctx.fillStyle = '#333333';
    ctx.fillText(`Date: ${today}`, canvas.width / 2, 650);

    // Disclaimer
    ctx.font = '12px "Inter", sans-serif';
    ctx.fillStyle = '#999999';
    ctx.fillText('Specimen only - Not a legally certified document.', canvas.width / 2, 730);

    // Signature Area
    ctx.font = 'italic 18px "Playfair Display", serif';
    ctx.fillStyle = '#1a1a1a';
    ctx.fillText('Topudy App', canvas.width - 200, 680);
    
    ctx.beginPath();
    ctx.moveTo(canvas.width - 300, 650);
    ctx.lineTo(canvas.width - 100, 650);
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 1;
    ctx.stroke();

  }, [certId, cert, userName]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `Certificate_${certId}.png`;
    a.click();
  };

  if (!cert) return null;

  return (
    <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-4">
      <div className="bg-white p-4 rounded-xl shadow-2xl max-w-full overflow-x-auto relative">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-black/50 hover:text-black transition-colors bg-white rounded-full p-1 shadow-md z-10"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
        <canvas 
          ref={canvasRef} 
          className="w-full max-w-[800px] h-auto shadow-sm border border-gray-200 rounded-sm"
          style={{ aspectRatio: '1123 / 794' }}
        />
        <div className="mt-6 flex justify-center">
          <button 
            onClick={handleDownload}
            className="px-8 py-3 bg-[#c68a53] text-white rounded-lg font-bold hover:bg-[#a67241] transition-colors shadow-lg flex items-center gap-2"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            Download Certificate
          </button>
        </div>
      </div>
    </div>
  );
};
