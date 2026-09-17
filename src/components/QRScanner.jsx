import { useEffect, useState, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X, Image as ImageIcon, Zap, SwitchCamera } from 'lucide-react';
import './QRScanner.css';

const QRScanner = ({ onScanSuccess, onClose, isInline }) => {
  const [errorMsg, setErrorMsg] = useState('');
  const [cameras, setCameras] = useState([]);
  const [currentCameraIndex, setCurrentCameraIndex] = useState(0);
  const [isFlashOn, setIsFlashOn] = useState(false);
  const scannerRef = useRef(null);
  const fileInputRef = useRef(null);
  
  useEffect(() => {
    const startScanner = async () => {
      try {
        scannerRef.current = new Html5Qrcode("qr-reader");
        
        let cameraIdOrConfig = { facingMode: "environment" };
        let availableCameras = [];
        let startingIndex = 0;
        
        try {
          availableCameras = await Html5Qrcode.getCameras();
          if (availableCameras && availableCameras.length > 0) {
            setCameras(availableCameras);
            
            // Try to find a back/rear camera explicitly by label
            for (let i = 0; i < availableCameras.length; i++) {
              const label = availableCameras[i].label.toLowerCase();
              if (label.includes('back') || label.includes('rear') || label.includes('environment')) {
                startingIndex = i;
                break;
              }
            }
            
            setCurrentCameraIndex(startingIndex);
            cameraIdOrConfig = availableCameras[startingIndex].id;
          }
        } catch (camErr) {
          console.warn("Could not enumerate cameras, falling back to environment mode", camErr);
        }

        await scannerRef.current.start(
          cameraIdOrConfig,
          {
            fps: 10,
            qrbox: { width: 280, height: 280 },
            aspectRatio: window.innerHeight / window.innerWidth
          },
          (decodedText) => {
            if (scannerRef.current && scannerRef.current.isScanning) {
              scannerRef.current.stop().then(() => {
                onScanSuccess(decodedText);
              }).catch(err => {
                onScanSuccess(decodedText);
              });
            } else {
              onScanSuccess(decodedText);
            }
          },
          (errorMessage) => {
            // Ignored, happens constantly as camera searches
          }
        );
      } catch (err) {
        console.error("Camera start failed", err);
        setErrorMsg('Failed to access camera. Please check permissions.');
      }
    };
    
    startScanner();

    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(error => {
          console.error("Failed to clear html5QrcodeScanner. ", error);
        });
      }
    };
  }, [onScanSuccess]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      if (scannerRef.current) {
        const decodedText = await scannerRef.current.scanFileV2(file, true);
        onScanSuccess(decodedText.decodedText || decodedText);
      }
    } catch (err) {
      console.error("Error scanning file", err);
      setErrorMsg("Could not find a QR code in that image.");
      setTimeout(() => setErrorMsg(''), 3000);
    }
  };

  const toggleFlash = async () => {
    if (!scannerRef.current || !scannerRef.current.isScanning) return;
    try {
      const newState = !isFlashOn;
      await scannerRef.current.applyVideoConstraints({
        advanced: [{ torch: newState }]
      });
      setIsFlashOn(newState);
    } catch (err) {
      console.warn("Flash not supported", err);
      setErrorMsg("Flash is not supported on this device/camera.");
      setTimeout(() => setErrorMsg(''), 3000);
    }
  };

  const switchCamera = async () => {
    if (cameras.length < 2) {
      setErrorMsg("No other cameras found.");
      setTimeout(() => setErrorMsg(''), 3000);
      return;
    }
    
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        await scannerRef.current.stop();
        const nextIndex = (currentCameraIndex + 1) % cameras.length;
        setCurrentCameraIndex(nextIndex);
        setIsFlashOn(false); // Reset flash state on switch
        
        await scannerRef.current.start(
          cameras[nextIndex].id,
          {
            fps: 10,
            qrbox: { width: 280, height: 280 },
            aspectRatio: window.innerHeight / window.innerWidth
          },
          (decodedText) => {
            if (scannerRef.current && scannerRef.current.isScanning) {
              scannerRef.current.stop().then(() => onScanSuccess(decodedText)).catch(() => onScanSuccess(decodedText));
            } else {
              onScanSuccess(decodedText);
            }
          },
          () => {}
        );
      } catch (err) {
        console.error("Camera switch failed", err);
        setErrorMsg("Failed to switch camera.");
        setTimeout(() => setErrorMsg(''), 3000);
      }
    }
  };

  return (
    <div className={isInline ? "relative w-full h-[360px] bg-black/90 rounded-[32px] overflow-hidden border border-emerald-500/30" : "fixed inset-0 z-[9999] bg-black/95"}>
      
      {isInline && (
        <button onClick={onClose} className="absolute top-4 right-4 z-50 bg-black/60 backdrop-blur-md p-2 rounded-full text-white/80 hover:text-white transition">
           <X size={20} />
        </button>
      )}
      {/* Hidden File Input */}
      <input 
        type="file" 
        accept="image/*" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        className="hidden" 
      />

      {/* Camera Container */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <div id="qr-reader" className="w-full h-full object-cover"></div>
      </div>
      
      {/* Top Bar Overlay */}
      <div className="absolute top-12 left-0 right-0 flex justify-center z-10 pointer-events-auto">
        <div className="bg-black/40 backdrop-blur-md rounded-full px-8 py-3 flex items-center gap-10 border border-white/10 shadow-lg">
          <ImageIcon 
            className="text-white/80 w-6 h-6 hover:text-white transition cursor-pointer" 
            onClick={() => fileInputRef.current?.click()} 
          />
          <Zap 
            className={`w-6 h-6 transition cursor-pointer ${isFlashOn ? 'text-emerald-400' : 'text-white/80 hover:text-white'}`} 
            onClick={toggleFlash} 
          />
          <SwitchCamera 
            className="text-white/80 w-6 h-6 hover:text-white transition cursor-pointer" 
            onClick={switchCamera} 
          />
        </div>
      </div>

      {/* Temporary Test Button for UPI */}
      <div className="absolute top-32 left-0 right-0 flex justify-center z-50 pointer-events-auto">
        <button 
          onClick={() => onScanSuccess("upi://pay?pa=merchant@upi&pn=Coffee%20Shop&am=150")}
          className="bg-emerald-500 text-black px-6 py-2 rounded-full font-bold shadow-[0_0_15px_rgba(16,185,129,0.5)] active:scale-95 transition-all"
        >
          Test UPI Scan
        </button>
      </div>
      
      {/* Error Message Overlay */}
      {errorMsg && (
        <div className="absolute top-1/4 left-0 right-0 flex justify-center z-20">
           <div className="bg-red-500/80 text-white px-6 py-3 rounded-xl backdrop-blur-md mx-4 text-center">
             {errorMsg}
           </div>
        </div>
      )}
      
      {/* Custom Corner Overlays */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
         <div className="relative w-[280px] h-[280px]">
            {/* Corners */}
            <div className="absolute top-0 left-0 w-12 h-12 border-t-[6px] border-l-[6px] border-emerald-500 rounded-tl-2xl"></div>
            <div className="absolute top-0 right-0 w-12 h-12 border-t-[6px] border-r-[6px] border-emerald-500 rounded-tr-2xl"></div>
            <div className="absolute bottom-0 left-0 w-12 h-12 border-b-[6px] border-l-[6px] border-emerald-500 rounded-bl-2xl"></div>
            <div className="absolute bottom-0 right-0 w-12 h-12 border-b-[6px] border-r-[6px] border-emerald-500 rounded-br-2xl"></div>
            
            {/* Animated Scan Line */}
            <div className="absolute top-0 left-0 w-full h-[3px] bg-emerald-500 shadow-[0_0_15px_3px_rgba(16,185,129,0.7)] animate-scan-line"></div>
         </div>
      </div>
      
      {/* Bottom Dock Overlay - Only for full screen */}
      {!isInline && (
        <div className="absolute bottom-12 left-0 right-0 flex justify-center z-10 pointer-events-auto">
           <div className="relative flex flex-col items-center cursor-pointer group w-16" onClick={onClose}>
              <div className="bg-emerald-500 p-5 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.4)] group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] transition-all duration-300">
                 <X className="text-black w-8 h-8" strokeWidth={3} />
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default QRScanner;
