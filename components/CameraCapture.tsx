'use client';

import React, { useRef, useCallback, useState } from 'react';
import Webcam from 'react-webcam';
import { Camera, RefreshCw, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        >
            <div className="relative w-full max-w-2xl overflow-hidden glass-card rounded-3xl">
                <div className="p-6 flex flex-col items-center">
                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-zinc-900 shadow-2xl">
                        {!capturedImage ? (
                            <Webcam
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                className="w-full h-full object-cover"
                                videoConstraints={{
                                    facingMode: "user",
                                    aspectRatio: 1.7777777778
                                }}
                            />
                        ) : (
                            <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
                        )}

                        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-6">
                            {!capturedImage ? (
                                <button
                                    onClick={capture}
                                    className="p-5 bg-white text-black rounded-full shadow-xl hover:scale-110 active:scale-95 transition-all"
                                >
                                    <Camera size={32} />
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={retake}
                                        className="p-4 bg-zinc-800 text-white rounded-full shadow-xl hover:bg-zinc-700 active:scale-95 transition-all"
                                    >
                                        <RefreshCw size={24} />
                                    </button>
                                    <button
                                        onClick={confirmCapture}
                                        className="p-4 bg-indigo-600 text-white rounded-full shadow-xl hover:bg-indigo-500 active:scale-95 transition-all"
                                    >
                                        <Check size={24} />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={onCancel}
                        className="mt-8 p-3 text-zinc-400 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default CameraCapture;
