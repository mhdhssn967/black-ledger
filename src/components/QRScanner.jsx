import { useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { X } from 'lucide-react';

const QRScanner = ({ onScanSuccess, onClose }) => {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 },
      false
    );

    const handleScan = (decodedText) => {
      onScanSuccess(decodedText);
      scanner.clear();
    };

    const handleError = (error) => {
      // Ignored, happens constantly as camera searches
    };

    scanner.render(handleScan, handleError);

    return () => {
      try {
        scanner.clear();
      } catch (error) {
        console.error("Failed to clear html5QrcodeScanner. ", error);
      }
    };
  }, [onScanSuccess]);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/95 backdrop-blur-md">
      <div className="relative w-full max-w-md p-4">
        <button 
          onClick={onClose}
          className="absolute -top-12 right-4 bg-zinc-800 text-white p-2 rounded-full z-50 hover:bg-zinc-700 transition"
        >
          <X size={24} />
        </button>
        <div className="bg-white p-4 rounded-3xl overflow-hidden shadow-2xl">
          <div id="qr-reader" className="w-full rounded-2xl overflow-hidden text-black"></div>
        </div>
        <p className="text-white/80 text-center mt-8 text-lg">Scan any UPI QR Code to pay</p>
      </div>
    </div>
  );
};

export default QRScanner;
