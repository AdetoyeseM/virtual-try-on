'use client';

import React, { useRef, useCallback, useState } from 'react';
import Webcam from 'react-webcam';
import { Camera, RefreshCw, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface CameraCaptureProps {
    onCapture: (image: string) => void;
    onCancel: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onCancel }) => {
    const webcamRef = useRef<Webcam>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (imageSrc) {
            setCapturedImage(imageSrc);
        }
    }, [webcamRef]);

    const confirmCapture = () => {
        if (capturedImage) {
            onCapture(capturedImage);
        }
    };

    const retake = () => {
        setCapturedImage(null);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex flex-col"
        >
            <div className="relative flex-1 w-full h-full bg-zinc-900 overflow-hidden">
                {!capturedImage ? (
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        className="w-full h-full object-cover"
                        videoConstraints={{
                            facingMode: "user",
                        }}
                    />
                ) : (
                    <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
                )}

                <div className="absolute top-6 right-6 z-10">
                    <button
                        onClick={onCancel}
                        className="p-3 bg-black/50 backdrop-blur-md text-white rounded-full hover:bg-white/20 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-8 z-10">
                    {!capturedImage ? (
                        <button
                            onClick={capture}
                            className="p-6 bg-white/20 backdrop-blur-md border-[6px] border-white text-white rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all"
                        >
                            <Camera size={36} />
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={retake}
                                className="p-5 bg-black/60 backdrop-blur-md text-white rounded-full shadow-xl hover:bg-black/80 active:scale-95 transition-all border border-white/10"
                            >
                                <RefreshCw size={32} />
                            </button>
                            <button
                                onClick={confirmCapture}
                                className="p-5 bg-indigo-600 text-white rounded-full shadow-xl hover:bg-indigo-500 active:scale-95 transition-all border border-indigo-400/50"
                            >
                                <Check size={32} />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default CameraCapture;
