
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GalleryAsset } from '../../types';

interface LightboxProps {
  assets: GalleryAsset[];
  initialIndex: number;
  onClose: () => void;
}

export const Lightbox: React.FC<LightboxProps> = ({ assets, initialIndex, onClose }) => {
  const [index, setIndex] = useState(initialIndex);
  const [showInfo, setShowInfo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const currentAsset = assets[index];

  const handleNext = useCallback(() => {
    setIndex((prev) => (prev + 1) % assets.length);
  }, [assets.length]);

  const handlePrev = useCallback(() => {
    setIndex((prev) => (prev - 1 + assets.length) % assets.length);
  }, [assets.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, onClose]);

  // Social Sharing
  const shareUrl = currentAsset.type === 'video' ? (currentAsset.videoUrl || currentAsset.url) : currentAsset.url;
  const shareText = `Check out this ${currentAsset.type === 'video' ? 'video' : 'photo'} from BEE-IT HIVE!`;
  const hashtags = "BeeITHive,GandakiUniversity";

  const handleShare = (platform: 'facebook' | 'twitter' | 'instagram') => {
    if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}&hashtags=${hashtags}`, '_blank');
    } else if (platform === 'instagram') {
      // Instagram doesn't support direct link sharing via URL, copying to clipboard
      navigator.clipboard.writeText(shareUrl);
      alert("Link copied! Open Instagram to paste and share.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1000] bg-black/98 backdrop-blur-xl flex flex-col md:flex-row h-screen w-screen overflow-hidden"
    >
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-50 bg-gradient-to-b from-black/80 to-transparent">
        <span className="text-white/80 text-sm font-bold font-mono tracking-widest">
          {index + 1} / {assets.length}
        </span>
        <div className="flex gap-4">
          <button 
            onClick={() => setShowInfo(!showInfo)} 
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${showInfo ? 'bg-hive-gold text-hive-blue' : 'bg-white/10 text-white hover:bg-white/20'}`}
            title="Info"
          >
            <i className="fa-solid fa-circle-info"></i>
          </button>
          <button 
            onClick={onClose} 
            className="w-10 h-10 rounded-full bg-white/10 text-white hover:bg-red-500/20 hover:text-red-500 flex items-center justify-center transition-colors"
            title="Close"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative flex items-center justify-center h-full w-full">
        <button 
          onClick={handlePrev}
          className="absolute left-4 z-40 w-12 h-12 rounded-full bg-white/5 hover:bg-hive-gold hover:text-hive-blue text-white flex items-center justify-center transition-all hidden md:flex"
        >
          <i className="fa-solid fa-chevron-left"></i>
        </button>

        <AnimatePresence mode="wait">
          {currentAsset.type === 'video' ? (
             <motion.div
               key={currentAsset.id}
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.9 }}
               className="w-full max-w-5xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl relative"
             >
                <video 
                  ref={videoRef}
                  controls 
                  autoPlay 
                  className="w-full h-full"
                  src={currentAsset.videoUrl}
                  poster={currentAsset.url}
                >
                   Your browser does not support the video tag.
                </video>
             </motion.div>
          ) : (
            <motion.img
              key={currentAsset.id}
              src={currentAsset.url}
              alt={currentAsset.caption}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = offset.x;
                if (swipe < -100) handleNext();
                else if (swipe > 100) handlePrev();
              }}
              className="max-h-[85vh] max-w-[95vw] object-contain shadow-2xl cursor-grab active:cursor-grabbing rounded-lg"
            />
          )}
        </AnimatePresence>

        <button 
          onClick={handleNext}
          className="absolute right-4 z-40 w-12 h-12 rounded-full bg-white/5 hover:bg-hive-gold hover:text-hive-blue text-white flex items-center justify-center transition-all hidden md:flex"
        >
          <i className="fa-solid fa-chevron-right"></i>
        </button>
      </div>

      {/* Info Sidebar (Toggleable) */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            className="w-full md:w-80 bg-white/5 border-l border-white/10 backdrop-blur-md p-6 overflow-y-auto absolute md:relative right-0 h-full z-40"
          >
            <h3 className="text-xl font-bold text-white mb-2 font-heading">Meta Data</h3>
            <div className="h-1 w-10 bg-hive-gold rounded-full mb-6"></div>
            
            <div className="space-y-6 text-gray-300">
              {currentAsset.caption && (
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1 block">Caption</label>
                  <p className="text-sm italic">"{currentAsset.caption}"</p>
                </div>
              )}
              
              {currentAsset.type === 'image' && currentAsset.exif && (
                <div className="bg-black/20 rounded-xl p-4 space-y-3 border border-white/5">
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500 uppercase"><i className="fa-solid fa-camera mr-2"></i>Camera</span>
                    <span className="text-xs font-mono text-white">{currentAsset.exif.camera}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500 uppercase"><i className="fa-solid fa-bullseye mr-2"></i>Lens</span>
                    <span className="text-xs font-mono text-white">{currentAsset.exif.lens}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5">
                    <div className="text-center">
                      <span className="block text-[10px] text-gray-500 uppercase">ISO</span>
                      <span className="text-xs font-bold text-hive-gold">{currentAsset.exif.iso}</span>
                    </div>
                    <div className="text-center">
                      <span className="block text-[10px] text-gray-500 uppercase">Aperture</span>
                      <span className="text-xs font-bold text-hive-gold">{currentAsset.exif.aperture}</span>
                    </div>
                    <div className="text-center">
                      <span className="block text-[10px] text-gray-500 uppercase">Shutter</span>
                      <span className="text-xs font-bold text-hive-gold">{currentAsset.exif.shutter}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Social Sharing */}
              <div className="pt-6 border-t border-white/10">
                 <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3 block">Share This</label>
                 <div className="flex gap-3">
                    <button onClick={() => handleShare('facebook')} className="w-10 h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:scale-110 transition-transform">
                       <i className="fa-brands fa-facebook-f"></i>
                    </button>
                    <button onClick={() => handleShare('twitter')} className="w-10 h-10 rounded-full bg-[#1DA1F2] text-white flex items-center justify-center hover:scale-110 transition-transform">
                       <i className="fa-brands fa-twitter"></i>
                    </button>
                    <button onClick={() => handleShare('instagram')} className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 text-white flex items-center justify-center hover:scale-110 transition-transform">
                       <i className="fa-brands fa-instagram"></i>
                    </button>
                 </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">Format</label>
                <span className="bg-white/10 px-2 py-1 rounded text-xs text-white uppercase">{currentAsset.format}</span>
                <span className="bg-white/10 px-2 py-1 rounded text-xs text-white ml-2">
                   {(currentAsset.size_bytes / 1024 / (currentAsset.size_bytes > 1000000 ? 1024 : 1)).toFixed(1)} {currentAsset.size_bytes > 1000000 ? 'MB' : 'KB'}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Filmstrip */}
      <div className="h-24 bg-black/40 backdrop-blur-md border-t border-white/10 p-4 flex gap-4 overflow-x-auto no-scrollbar shrink-0">
        {assets.map((asset, i) => (
          <button
            key={asset.id}
            onClick={() => setIndex(i)}
            className={`relative aspect-video h-full rounded-lg overflow-hidden border-2 transition-all ${i === index ? 'border-hive-gold scale-105' : 'border-transparent opacity-50 hover:opacity-100'}`}
          >
            <img src={asset.url} className="w-full h-full object-cover" alt="thumbnail" />
            {asset.type === 'video' && (
               <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <i className="fa-solid fa-play text-white text-xs"></i>
               </div>
            )}
          </button>
        ))}
      </div>
    </motion.div>
  );
};
