import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Upload, Grid, List, Download, Heart, Share2, Eye, Filter, Moon, Sun } from 'lucide-react';
import { toast } from 'sonner';
import { API_BASE_URL } from '../lib/utils';

const ModernGallery = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [allImages, setAllImages] = useState([]);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isDark, setIsDark] = useState(true);
  const loadMoreRef = useRef(null);

  // Apply dark theme to document
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      if (debouncedSearch !== searchQuery) {
        setDebouncedSearch(searchQuery);
        setPage(1);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, debouncedSearch]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['images', debouncedSearch, page],
    queryFn: async () => {
      const response = await fetch(
        `${API_BASE_URL}/images?search=${encodeURIComponent(debouncedSearch)}&page=${page}&limit=20`
      );
      if (!response.ok) throw new Error('Failed to fetch images');
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    keepPreviousData: false,
  });

  // Update all images when new data comes in
  useEffect(() => {
    if (data?.images) {
      console.log('Received data:', data.images.length, 'images, page:', page);
      if (page === 1) {
        // New search or first load
        console.log('Setting new images for page 1');
        setAllImages(data.images);
      } else {
        // Loading more pages
        setAllImages(prev => {
          const newImages = data.images.filter(img => !prev.some(p => p.id === img.id));
          console.log('Adding', newImages.length, 'new images to existing', prev.length);
          return [...prev, ...newImages];
        });
      }
    }
  }, [data, page]);

  // Reset images when search changes
  useEffect(() => {
    if (page === 1) {
      setAllImages([]);
    }
  }, [debouncedSearch]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && data?.hasMore && !isLoading) {
          setPage(prev => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [data?.hasMore, isLoading]);

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleDownload = async (e, image) => {
    e.stopPropagation();
    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = image.filename || 'image';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const MasonryGrid = ({ images }) => {
    return (
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6 gap-6">
        {images.map((image, index) => (
          <div
            key={image.id}
            className="break-inside-avoid mb-6 group cursor-pointer transform transition-all duration-300 hover:scale-[1.02]"
            style={{
              animationDelay: `${index * 0.1}s`,
              animation: 'fadeInUp 0.6s ease-out forwards'
            }}
            onClick={() => handleImageClick(image)}
          >
            <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-700 overflow-hidden border border-gray-100 dark:border-gray-700/50 group-hover:border-blue-200 dark:group-hover:border-blue-800/50">
              {/* Image Container */}
              <div className="relative overflow-hidden rounded-t-3xl">
                <img
                  src={image.thumbnail}
                  alt={image.title}
                  className="w-full h-auto object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                  loading="lazy"
                  onError={(e) => {
                    console.log('Thumbnail failed, trying full image:', image.url);
                    e.target.src = image.url; // Fallback to full image
                  }}
                  onLoad={() => {
                    console.log('Image loaded:', image.title);
                  }}
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                
                {/* Action Buttons */}
                <div className="absolute bottom-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-[20px] group-hover:translate-y-0">
                  <button
                    onClick={(e) => handleDownload(e, image)}
                    className="p-3 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl shadow-xl hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 hover:scale-110 hover:rotate-3"
                  >
                    <Download className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  </button>
                  <button className="p-3 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl shadow-xl hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 hover:scale-110 hover:rotate-3">
                    <Heart className="w-5 h-5 text-red-500" />
                  </button>
                  <button className="p-3 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl shadow-xl hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 hover:scale-110 hover:rotate-3">
                    <Share2 className="w-5 h-5 text-blue-500" />
                  </button>
                </div>
              </div>

              {/* Card Info */}
              <div className="p-5 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-850">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {image.title}
                </h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300">
                      {image.dimensions}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300">
                      {(image.size / 1024 / 1024).toFixed(1)}MB
                    </span>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-green-400 shadow-lg animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const ImageModal = ({ image, onClose }) => {
    if (!image) return null;

    return (
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn"
        onClick={onClose}
      >
        <div 
          className="relative max-w-6xl max-h-[95vh] bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-2xl animate-scaleIn"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-all duration-200 hover:scale-110 z-10"
          >
            <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {/* Image */}
          <img
            src={image.url}
            alt={image.title}
            className="w-full h-auto max-h-[75vh] object-contain"
          />
          
          {/* Info Panel */}
          <div className="p-6 bg-gradient-to-t from-white dark:from-gray-800 to-transparent">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {image.title}
            </h3>
            <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-4">
                <span className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-sm">
                  {image.dimensions}
                </span>
                <span className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-sm">
                  {(image.size / 1024 / 1024).toFixed(1)}MB
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
                <button 
                  onClick={(e) => handleDownload(e, image)}
                  className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-xl sticky top-0 z-40 border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Grid className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
                {/* Show title and count only on larger screens */}
                <div className="hidden sm:block">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Photo Gallery
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {data?.total || 0} images
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search images..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent w-48 sm:w-64 lg:w-80 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 text-sm sm:text-base"
                />
              </div>
              
              {/* Theme Toggle */}
              <button
                onClick={() => setIsDark(!isDark)}
                className="p-2 sm:p-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200"
              >
                {isDark ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
              
              {/* Upload Button */}
              <button
                onClick={() => {
                  toast.error("Image Database not Added", {
                    description: "Upload functionality is not available yet.",
                    duration: 3000,
                  });
                }}
                className="px-3 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-1 sm:space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
              >
                <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="font-medium hidden sm:inline">Upload</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8">
        {/* Search Results */}
        {debouncedSearch && (
          <div className="mb-8 p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-medium text-gray-900 dark:text-white">
                {data?.total || 0} results
              </span> for "{debouncedSearch}"
            </p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && allImages.length === 0 && (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6 gap-6">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="break-inside-avoid mb-6">
                <div 
                  className="bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" 
                  style={{ height: `${Math.random() * 200 + 200}px` }} 
                />
              </div>
            ))}
          </div>
        )}

        {/* Images Grid */}
        {allImages.length > 0 && (
          <MasonryGrid images={allImages} />
        )}

        {/* Load More Trigger */}
        {data?.hasMore && (
          <div ref={loadMoreRef} className="flex justify-center py-12">
            {isLoading && (
              <div className="flex items-center space-x-3 p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="text-gray-600 dark:text-gray-400 font-medium">Loading more images...</span>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && allImages.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <Grid className="w-12 h-12 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No images found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {debouncedSearch ? 'Try adjusting your search terms' : 'Upload some images to get started'}
            </p>
            {debouncedSearch && (
              <button 
                onClick={() => setSearchQuery('')}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>

      {/* Image Modal */}
      <ImageModal image={selectedImage} onClose={() => setSelectedImage(null)} />

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleIn {
          from { 
            opacity: 0;
            transform: scale(0.9);
          }
          to { 
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ModernGallery;
