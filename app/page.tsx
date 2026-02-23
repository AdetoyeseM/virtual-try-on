'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, RefreshCw, Wand2, ArrowLeft, Download, Share2 } from 'lucide-react';
import CameraCapture from '@/components/CameraCapture';
import ClothingCarousel, { ClothingItem } from '@/components/ClothingCarousel';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const CLOTHING_ITEMS: ClothingItem[] = [
  { id: '1', name: 'Denim Jacket', category: 'jackets', image: '/clothing/denim_jacket.png' },
  { id: '2', name: 'Floral Summer Dress', category: 'dresses', image: '/clothing/floral_dress.png' },
  { id: '3', name: 'Leather Biker Jacket', category: 'jackets', image: '/clothing/leather_jacket.png' },
  { id: '4', name: 'Wool Sweater', category: 'tops', image: '/clothing/wool_sweater.png' },
  { id: '5', name: 'Business Blazer', category: 'jackets', image: '/clothing/business_blazer.png' },
  { id: '6', name: 'Graphic T-Shirt', category: 'tops', image: '/clothing/graphic_tshirt.png' },
];

export default function TryOnPage() {
  const [userImage, setUserImage] = useState<string | null>(null);
  const [selectedClothing, setSelectedClothing] = useState<ClothingItem | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserImage(reader.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = (image: string) => {
    setUserImage(image);
    setIsCameraOpen(false);
    setError(null);
  };

  const dataURLtoFile = (dataurl: string, filename: string) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const handleTryOn = async () => {
    if (!userImage || !selectedClothing) return;

    setIsLoading(true);
    setError(null);
    setResultImage(null);

    try {
      const formData = new FormData();

      // Convert user image string (dataURL) to File
      const userFile = dataURLtoFile(userImage, 'user.jpg');
      formData.append('userImage', userFile);

      // Fetch the clothing image from the public path and convert to File
      const clothingResponse = await fetch(selectedClothing.image);
      const clothingBlob = await clothingResponse.blob();
      const clothingFile = new File([clothingBlob], 'clothing.png', { type: 'image/png' });
      formData.append('clothingImage', clothingFile);

      const response = await fetch('/api/tryon', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate try-on result');
      }

      if (result.image) {
        setResultImage(result.image);
      } else {
        throw new Error('API did not return an image result');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetAll = () => {
    setUserImage(null);
    setSelectedClothing(null);
    setResultImage(null);
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-indigo-500/30">
      {/* Background blur effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[50%] bg-purple-500/10 rounded-full blur-[100px]" />
        <div className="absolute -bottom-[10%] left-[20%] w-[50%] h-[30%] bg-blue-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-50 flex items-center justify-center px-6 py-6 mx-auto max-w-7xl">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.4)]">
            <Wand2 size={18} className="text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
            Aura Studio
          </h1>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pb-24">
        <AnimatePresence mode="wait">
          {!userImage ? (
            /* Launch Screen: Select Source */
            <motion.div
              key="launch"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mt-12 md:mt-24 max-w-4xl mx-auto text-center"
            >
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="px-4"
              >
                <span className="inline-block py-1 px-3 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-semibold uppercase tracking-wider mb-4 border border-indigo-500/20">
                  AI Fashion Studio
                </span>
                <h2 className="text-4xl font-extrabold mb-6 tracking-tight">
                  Virtual Style, <br />
                  <span className="text-zinc-500 text-3xl">Real Results.</span>
                </h2>
                <p className="text-zinc-400 text-sm mb-8 max-w-md mx-auto leading-relaxed">
                  Upload a portrait and choose a garment to see your new look instantly.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 gap-4 px-4">
                <motion.div
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsCameraOpen(true)}
                  className="glass-card p-6 rounded-[2rem] cursor-pointer group active:bg-white/5"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-indigo-600/10 rounded-2xl flex items-center justify-center shrink-0">
                      <Camera size={28} className="text-indigo-400" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl font-bold">Take Photo</h3>
                      <p className="text-zinc-500 text-xs">Capture a new selfie</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileTap={{ scale: 0.98 }}
                  onClick={() => fileInputRef.current?.click()}
                  className="glass-card p-6 rounded-[2rem] cursor-pointer group active:bg-white/5"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-purple-600/10 rounded-2xl flex items-center justify-center shrink-0">
                      <Upload size={28} className="text-purple-400" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl font-bold">Upload File</h3>
                      <p className="text-zinc-500 text-xs">Select from gallery</p>
                    </div>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                    accept="image/*"
                  />
                </motion.div>
              </div>
            </motion.div>
          ) : (
            /* Main Studio: Image Ready & Carousel */
            <motion.div
              key="studio"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-4 grid grid-cols-1 gap-6 items-start"
            >
              {/* Left Column: Image Preview */}
              <div className="space-y-4">
                <motion.div
                  layoutId="image-container"
                  className="relative group rounded-[2rem] overflow-hidden glass-card p-2"
                >
                  <div className="relative aspect-[3/4] rounded-[1.5rem] overflow-hidden bg-zinc-900 border border-white/5">
                    {resultImage && !isLoading ? (
                      <motion.img
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        src={resultImage}
                        alt="Result"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img src={userImage} alt="User" className="w-full h-full object-cover" />
                    )}

                    {isLoading && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-20">
                        <div className="relative w-24 h-24">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="w-full h-full border-4 border-indigo-500 border-t-transparent rounded-full"
                          />
                          <Wand2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white animate-pulse" size={32} />
                        </div>
                        <p className="mt-8 text-xl font-medium text-white/90">Tailoring your fit...</p>
                        <p className="mt-2 text-zinc-400 text-sm">Our AI is processing the details</p>
                      </div>
                    )}
                  </div>

                  {/* Quick Actions */}
                  {!isLoading && (
                    <div className="absolute top-8 right-8 flex flex-col gap-3">
                      <button
                        onClick={resetAll}
                        className="p-3 glass rounded-full text-white hover:bg-white hover:text-black transition-all shadow-xl"
                        title="Start Over"
                      >
                        <RefreshCw size={20} />
                      </button>
                      {resultImage && (
                        <>
                          <button className="p-3 glass rounded-full text-white hover:bg-white hover:text-black transition-all shadow-xl">
                            <Download size={20} />
                          </button>
                          <button className="p-3 glass rounded-full text-white hover:bg-white hover:text-black transition-all shadow-xl">
                            <Share2 size={20} />
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </motion.div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={resetAll}
                    className="p-4 glass rounded-2xl text-zinc-400 hover:text-white transition-all"
                  >
                    <ArrowLeft size={24} />
                  </button>
                  <div className="flex-grow glass-card px-6 py-4 rounded-2xl flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-sm">Portrait Ready</h4>
                      <p className="text-zinc-500 text-xs">Identity preserved via AI</p>
                    </div>
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="w-6 h-6 rounded-full border-2 border-zinc-900 bg-zinc-800" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Collection & Try-On */}
              <div className="space-y-6 pb-20">
                <div className="glass-card rounded-[2rem] overflow-hidden pb-6">
                  <ClothingCarousel
                    items={CLOTHING_ITEMS}
                    selectedId={selectedClothing?.id || null}
                    onSelect={setSelectedClothing}
                  />

                  <div className="px-6">
                    {error && (
                      <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs mb-4">
                        {error}
                      </div>
                    )}

                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={handleTryOn}
                      disabled={!selectedClothing || isLoading}
                      className={cn(
                        "w-full py-4 rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-3",
                        selectedClothing && !isLoading
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                          : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                      )}
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="animate-spin" size={20} />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Wand2 size={20} />
                          Try It On Now
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {isCameraOpen && (
          <CameraCapture
            onCapture={handleCameraCapture}
            onCancel={() => setIsCameraOpen(false)}
          />
        )}
      </AnimatePresence>

      <footer className="py-12 border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-zinc-500 text-sm">© 2026 Aura Virtual Try-On. Enhanced by Aura AI.</p>
          <div className="flex gap-8 text-zinc-500 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
