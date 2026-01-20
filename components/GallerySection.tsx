
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { CINEMATICS } from '../constants';
import { useData } from '../context/DataContext';
import { ParallaxScroll } from './ui/ParallaxScroll';
import { GlowingEffect } from './ui/GlowingEffect';
import { Lightbox } from './ui/Lightbox';
import { GalleryAsset } from '../types';
import { LazyImage } from './ui/LazyImage';
import { Badge } from './ui/Badge';

const GallerySection: React.FC<{ onBreadcrumbUpdate?: (detail: string | null) => void }> = ({ onBreadcrumbUpdate }) => {
  const { albums } = useData();
  const [activeTab, setActiveTab] = useState<'photos' | 'cinematics'>('photos');
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [selectedEventId, setSelectedEventId] = useState<string>('All');
  const [lightboxItems, setLightboxItems] = useState<GalleryAsset[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    if (onBreadcrumbUpdate) {
      if (activeTab === 'cinematics') {
        onBreadcrumbUpdate('Cinematics');
      } else if (selectedEventId !== 'All') {
        const album = albums.find(a => a.album_id === selectedEventId);
        onBreadcrumbUpdate(album ? album.title : 'Photos');
      } else {
        onBreadcrumbUpdate('Photos');
      }
    }
  }, [activeTab, selectedEventId, albums, onBreadcrumbUpdate]);

  // Derived Data for Filters
  const years = useMemo(() => {
    const uniqueYears = Array.from(new Set(albums.map(a => new Date(a.date).getFullYear().toString())));
    return ['All', ...uniqueYears.sort().reverse()];
  }, [albums]);

  const filteredAlbums = useMemo(() => {
    let result = albums;
    if (selectedYear !== 'All') {
      result = result.filter(a => new Date(a.date).getFullYear().toString() === selectedYear);
    }
    return result;
  }, [albums, selectedYear]);

  const eventsList = useMemo(() => {
    return ['All', ...filteredAlbums.map(a => ({ id: a.album_id, title: a.title }))];
  }, [filteredAlbums]);

  const displayedAssets = useMemo(() => {
    if (selectedEventId === 'All') return [];
    const album = albums.find(a => a.album_id === selectedEventId);
    return album ? album.assets.map(a => ({ ...a, type: a.type || 'image' } as GalleryAsset)) : [];
  }, [albums, selectedEventId]);

  // Cinematic mapped to GalleryAsset for Lightbox
  const mappedCinematics = useMemo(() => {
     return CINEMATICS.map((c, i) => ({
        id: c.id,
        url: c.thumbnail,
        videoUrl: c.videoUrl,
        type: 'video' as const,
        format: 'mp4' as const,
        size_bytes: 0, // Placeholder
        caption: c.title
     }));
  }, []);

  const openPhotoLightbox = (index: number) => {
     setLightboxItems(displayedAssets);
     setLightboxIndex(index);
  };

  const openCinematicLightbox = (index: number) => {
     setLightboxItems(mappedCinematics);
     setLightboxIndex(index);
  };

  return (
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
           <h1 className="text-5xl font-bold text-hive-blue dark:text-white font-heading mb-2">Media Gallery</h1>
           <p className="text-gray-500 dark:text-gray-400">Capturing the moments that define our hive.</p>
        </div>
        
        <div className="flex flex-wrap gap-4 items-center">
           {/* Tab Switcher */}
           <div className="bg-gray-100 dark:bg-white/5 p-1 rounded-xl flex">
              <button onClick={() => { setActiveTab('photos'); setSelectedEventId('All'); }} className={`px-6 py-2 rounded-lg text-xs font-bold uppercase transition-all ${activeTab === 'photos' ? 'bg-white shadow-sm dark:bg-hive-blue text-hive-blue dark:text-white' : 'text-gray-500 hover:text-hive-blue'}`}>Photos</button>
              <button onClick={() => setActiveTab('cinematics')} className={`px-6 py-2 rounded-lg text-xs font-bold uppercase transition-all ${activeTab === 'cinematics' ? 'bg-white shadow-sm dark:bg-hive-blue text-hive-blue dark:text-white' : 'text-gray-500 hover:text-hive-blue'}`}>Cinematics</button>
           </div>
        </div>
      </div>

      <LayoutGroup>
        {activeTab === 'photos' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
             {/* Filters */}
             <div className="flex flex-wrap gap-4 mb-8 justify-between items-center">
                <div className="flex gap-4">
                  <select 
                    value={selectedYear} 
                    onChange={(e) => { setSelectedYear(e.target.value); setSelectedEventId('All'); }}
                    className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2 text-sm font-bold text-hive-blue dark:text-white focus:ring-2 focus:ring-hive-gold outline-none cursor-pointer"
                  >
                     {years.map(y => <option key={y} value={y}>{y === 'All' ? 'All Years' : y}</option>)}
                  </select>

                  {selectedEventId !== 'All' && (
                    <select 
                      value={selectedEventId} 
                      onChange={(e) => setSelectedEventId(e.target.value)}
                      className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2 text-sm font-bold text-hive-blue dark:text-white focus:ring-2 focus:ring-hive-gold outline-none max-w-[200px] truncate cursor-pointer"
                    >
                       {eventsList.map((evt: any) => (
                          typeof evt === 'string' 
                          ? <option key={evt} value={evt}>All Albums</option> 
                          : <option key={evt.id} value={evt.id}>{evt.title}</option>
                       ))}
                    </select>
                  )}
                </div>
                
                {selectedEventId !== 'All' && (
                  <button 
                    onClick={() => setSelectedEventId('All')}
                    className="text-sm font-bold text-gray-500 hover:text-hive-gold transition-colors flex items-center gap-2"
                  >
                    <i className="fa-solid fa-arrow-left"></i> Back to Albums
                  </button>
                )}
             </div>

             {selectedEventId === 'All' ? (
                // Album Grid View
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                   {filteredAlbums.map((album) => (
                      <motion.div
                        key={album.album_id}
                        layoutId={`album-${album.album_id}`}
                        onClick={() => setSelectedEventId(album.album_id)}
                        className="group cursor-pointer bg-white dark:bg-white/5 rounded-[2rem] overflow-hidden border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-xl transition-all"
                        whileHover={{ y: -5 }}
                      >
                         <div className="aspect-[4/3] relative overflow-hidden">
                            <LazyImage 
                               src={album.assets[0]?.url || 'https://picsum.photos/800/600'} 
                               alt={album.title}
                               className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                            <div className="absolute bottom-4 left-4 right-4 text-white">
                               <div className="flex justify-between items-end">
                                  <Badge className="bg-hive-gold text-hive-blue font-bold uppercase tracking-widest text-[10px]">
                                     {new Date(album.date).getFullYear()}
                                  </Badge>
                                  <span className="text-[10px] font-bold bg-black/50 px-2 py-1 rounded backdrop-blur-md">
                                     <i className="fa-solid fa-images mr-1"></i> {album.assets.length}
                                  </span>
                               </div>
                            </div>
                         </div>
                         <div className="p-6">
                            <h3 className="text-xl font-bold text-hive-blue dark:text-white mb-2 line-clamp-1 group-hover:text-hive-gold transition-colors">{album.title}</h3>
                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                               <i className="fa-solid fa-location-dot mr-2 text-hive-gold"></i>
                               {album.location}
                            </div>
                         </div>
                      </motion.div>
                   ))}
                </div>
             ) : (
                // Photo Grid View
                <>
                   {displayedAssets.length > 0 ? (
                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {displayedAssets.map((asset, idx) => (
                           <motion.div 
                             key={asset.id}
                             layoutId={`asset-${asset.id}`}
                             onClick={() => openPhotoLightbox(idx)}
                             className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group bg-gray-100 dark:bg-white/5"
                             whileHover={{ scale: 1.02 }}
                           >
                              <LazyImage 
                                 src={asset.url} 
                                 alt={asset.caption || "Gallery Image"} 
                                 threshold={300}
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                 <i className="fa-solid fa-expand text-white text-2xl drop-shadow-lg"></i>
                              </div>
                           </motion.div>
                        ))}
                     </div>
                   ) : (
                      <div className="text-center py-20 bg-gray-50 dark:bg-white/5 rounded-3xl border-dashed border-2 border-gray-200 dark:border-white/10">
                         <p className="text-gray-400 font-bold uppercase tracking-widest">No photos found in this album.</p>
                      </div>
                   )}
                </>
             )}
          </motion.div>
        )}

        {activeTab === 'cinematics' && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {CINEMATICS.map((cine, index) => (
                 <div key={cine.id} className="bg-white dark:bg-[#0b1129] rounded-[2rem] overflow-hidden border border-gray-100 dark:border-white/10 shadow-lg group">
                    <div className="relative aspect-video bg-black overflow-hidden">
                       <LazyImage 
                          src={cine.thumbnail} 
                          alt={cine.title} 
                          className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" 
                          threshold={300}
                       />
                       <div className="absolute inset-0 flex items-center justify-center">
                          <button 
                             onClick={() => openCinematicLightbox(index)}
                             className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/40 group-hover:scale-110 transition-transform shadow-2xl z-10"
                          >
                             <i className="fa-solid fa-play ml-1 text-2xl"></i>
                          </button>
                       </div>
                       <span className="absolute bottom-4 right-4 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded backdrop-blur-sm z-10">
                          {cine.duration}
                       </span>
                    </div>
                    <div className="p-6">
                       <h3 className="text-xl font-bold text-hive-blue dark:text-white mb-2">{cine.title}</h3>
                       <div className="space-y-2 mt-4">
                          {cine.chapters.map((chap, i) => (
                             <div key={i} className="flex justify-between text-xs text-gray-500 dark:text-gray-400 border-b border-dashed border-gray-200 dark:border-white/10 pb-1 last:border-0">
                                <span>{chap.label}</span>
                                <span className="font-mono">{Math.floor(chap.time / 60)}:{String(chap.time % 60).padStart(2, '0')}</span>
                             </div>
                          ))}
                       </div>
                    </div>
                 </div>
              ))}
           </motion.div>
        )}
      </LayoutGroup>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
           <Lightbox 
             assets={lightboxItems} 
             initialIndex={lightboxIndex} 
             onClose={() => setLightboxIndex(null)} 
           />
        )}
      </AnimatePresence>
    </div>
  );
};

export default GallerySection;
