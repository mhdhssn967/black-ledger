import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

const QRScanner = ({ onScanSuccess }) => {
  const scannerRef = useRef(null);
  const containerRef = useRef(null);
  const scannedRef = useRef(false);

  useEffect(() => {
    console.log("[QRScanner] Mounting component");

    // Clear any previous injected UI
    if (containerRef.current) {
      containerRef.current.innerHTML = "";
      console.log("[QRScanner] Cleared previous QR container");
    }

    const scanner = new Html5Qrcode("qr-reader");
    scannerRef.current = scanner;

    console.log("[QRScanner] Starting camera...");

    scanner
      .start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: 240,
          disableFlip: true,
        },
        (decodedText) => {
          console.log("[QRScanner] Frame received");

          if (scannedRef.current) {
            console.log("[QRScanner] Already scanned, ignoring frame");
            return;
          }

          console.log("[QRScanner] QR DECODED:", decodedText); // 🔴 Important

          scannedRef.current = true;

          scanner
            .stop()
            .then(() => {
              console.log("[QRScanner] Scanner stopped after successful scan");
            })
            .finally(() => {
              onScanSuccess(decodedText);
            });
        }
      )
      .then(() => {
        console.log("[QRScanner] Camera started successfully");
      })
      .catch((err) => {
        console.error("[QRScanner] Camera start error:", err);
      });

    return () => {
      console.log("[QRScanner] Unmounting component, stopping scanner if needed");
      scannedRef.current = true;
      if (scannerRef.current?.isScanning) {
        scannerRef.current
          .stop()
          .then(() => console.log("[QRScanner] Scanner stopped on unmount"))
          .catch((err) => console.error("[QRScanner] Stop error on unmount:", err));
      }
    };
  }, [onScanSuccess]);

  return (
    <div className="flex justify-center">
      <div
        ref={containerRef}
        id="qr-reader"
        className="w-[260px] h-[260px] rounded-2xl overflow-hidden bg-black"
      />
    </div>
  );
};

export default QRScanner;
