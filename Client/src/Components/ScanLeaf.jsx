import React, { useRef, useState } from "react";
import { QrCode } from "lucide-react";
import { useUploadFileMutation } from '../RTK Query/AppApi.jsx'

const PlantLeafScanCamera = ({ onImageCapture }) => {
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const handleOpenCamera = async () => {
    setError(null);
    setOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err) {
      setError("Camera access denied or not available.");
    }
  };

  const handleCapture = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const imgData = canvas.toDataURL("image/png");
        setImage(imgData);
        onImageCapture?.(imgData);
        handleCloseCamera();
      }
    }
  };

  const handleCloseCamera = () => {
    setOpen(false);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target.result === "string") {
          setImage(event.target.result);
          onImageCapture?.(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const [uploadFile] = useUploadFileMutation();

  const SendFileToServer = async () => {
    if (!image) {
        setError("No image to upload.");
        return;
    }

    try {
        // Convert base64 to Blob
        const res = await fetch(image);
        const blob = await res.blob();

        // Create a File object (required for FormData)
        const file = new File([blob], "plant-leaf.png", { type: "image/png" });

        // Prepare FormData
        const formData = new FormData();
        formData.append("file", file); // Adjust key if backend expects different

        // Upload using RTK mutation
        const response = await uploadFile(formData).unwrap();

        console.log("Upload success:", response);
        alert("File uploaded successfully!");

    } catch (error) {
        console.error("Upload failed:", error);
        setError("Failed to upload image.");
    }
  };


  return (
    <div className="flex flex-col items-center gap-4">
      {/* QR Icon Button */}
      <button
        className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 hover:bg-gray-200 shadow-lg"
        onClick={handleOpenCamera}
        aria-label="Open plant scanner"
        type="button"
      >
        <QrCode size={36} />
      </button>
      <span className="text-gray-500 text-sm">Scan plant leaf (Camera)</span>

      {/* Fallback file input */}
      <label className="text-blue-600 underline cursor-pointer">
        or upload image
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      {/* Preview */}
      {image && (
        <div className="mt-4">
          <img
            src={image}
            alt="Scanned plant leaf"
            className="max-w-xs max-h-64 object-contain rounded shadow"
          />
        </div>
      )}

      {/* Camera Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-80" />

          {/* Camera Area */}
          <div className="relative z-10 flex flex-col items-center w-full h-full justify-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-[320px] h-[320px] rounded-lg object-cover relative"
              style={{
                aspectRatio: "1/1",
                background: "#222",
              }}
            />

            {/* Focused scan area overlay */}
            <div
              className="absolute"
              style={{
                width: 320,
                height: 320,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                pointerEvents: "none",
              }}
            >
              {/* Corners */}
              <div className="absolute w-8 h-8 border-t-4 border-l-4 border-green-400 rounded-tl-xl" style={{ left: 0, top: 0 }} />
              <div className="absolute w-8 h-8 border-t-4 border-r-4 border-green-400 rounded-tr-xl" style={{ right: 0, top: 0 }} />
              <div className="absolute w-8 h-8 border-b-4 border-l-4 border-green-400 rounded-bl-xl" style={{ left: 0, bottom: 0 }} />
              <div className="absolute w-8 h-8 border-b-4 border-r-4 border-green-400 rounded-br-xl" style={{ right: 0, bottom: 0 }} />
              {/* Scanning line (animated) */}
              <div
                className="absolute left-2 right-2 h-1 bg-green-300 bg-opacity-60 rounded animate-scanline"
                style={{
                  top: 0,
                  animation: "scanline-move 2s linear infinite",
                }}
              />
            </div>

            {/* Instructions */}
            <div
              className="absolute left-1/2"
              style={{ top: "calc(50% + 180px)", transform: "translateX(-50%)" }}
            >
              <div className="text-white text-md text-center opacity-90 px-3">
                Align the plant leaf inside the frame
              </div>
            </div>

            {/* Capture Button */}
            <button
              className="absolute left-1/2 bottom-16 -translate-x-1/2 bg-white text-green-700 font-bold rounded-full shadow-lg w-14 h-14 flex items-center justify-center text-3xl border-4 border-green-500 active:scale-95 transition"
              onClick={handleCapture}
              style={{ zIndex: 20 }}
              aria-label="Capture"
            >
              📸
            </button>

            {/* Close Button */}
            <button
              className="absolute top-8 right-8 bg-white rounded-full p-2 shadow hover:bg-gray-200 z-20"
              onClick={handleCloseCamera}
              aria-label="Close camera"
            >
              ✖
            </button>

            {/* Error Message */}
            {error && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-red-500 mt-2 bg-white bg-opacity-75 p-2 rounded">
                {error}
              </div>
            )}
          </div>

          {/* Keyframes for scanline animation */}
          <style>
            {`
              @keyframes scanline-move {
                0% { top: 0; }
                100% { top: 300px; }
              }
              .animate-scanline {
                animation: scanline-move 2s linear infinite;
              }
            `}
          </style>
        </div>
      )}

      {image && (
        <button
            className="mt-2 bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700"
            onClick={SendFileToServer}
        >
            ⬆️ Upload to Server
        </button>
        )}

    </div>
  );
};

export default PlantLeafScanCamera;
