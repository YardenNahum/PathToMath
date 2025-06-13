
import React, { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";

const VideoGallery = ({ videos, onVideoClick }) => {
  const scrollRef = useRef(null);
  const [hoveredVideo, setHoveredVideo] = useState(null);
  
  const scroll = (direction) => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const scrollAmount = direction === "left" ? -container.clientWidth / 2 : container.clientWidth / 2;
      container.scrollTo({ left: container.scrollLeft + scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full mt-10 mb-10">
      <div className="relative">
        {/* Section Title */}
        <div className="mb-6 flex items-center">
          <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center">
            <Play fill="white" className="text-white ml-1" size={24} />
          </div>
          <h3 className="text-2xl font-bold ml-3 text-indigo-700">Fun Math Videos</h3>
        </div>
        
        {/* Navigation Controls */}
        <div className="absolute right-0 top-2 flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="p-3 rounded-full bg-indigo-100 hover:bg-indigo-200 text-indigo-700 transition-all duration-300 transform hover:scale-110"
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-3 rounded-full bg-indigo-100 hover:bg-indigo-200 text-indigo-700 transition-all duration-300 transform hover:scale-110"
            aria-label="Scroll right"
          >
            <ChevronRight size={20} />
          </button>
        </div>
        
        {/* Video Grid */}
        <div 
          ref={scrollRef}
          className="grid grid-flow-col auto-cols-max gap-6 overflow-x-auto pt-4 pb-8 px-2 scroll-smooth no-scrollbar snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {videos.map((video, index) => (
            <div
              key={video.id}
              className="snap-start w-72 relative group"
              onMouseEnter={() => setHoveredVideo(video.id)}
              onMouseLeave={() => setHoveredVideo(null)}
            >
              <div 
                onClick={() => onVideoClick(video.id)}
                className={`
                  bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-500
                  shadow-lg hover:shadow-2xl transform hover:-translate-y-2
                  ${index % 3 === 0 ? 'border-l-8 border-pink-400' : 
                    index % 3 === 1 ? 'border-l-8 border-purple-400' : 
                    'border-l-8 border-indigo-400'}
                `}
              >
                {/* Thumbnail */}
                <div className="relative">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-40 object-cover"
                  />
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-16 h-16 rounded-full bg-white bg-opacity-80 flex items-center justify-center">
                      <Play fill="currentColor" className="text-indigo-600 ml-1" size={32} />
                    </div>
                  </div>
                  
                  {/* Video Number */}
                  <div className="absolute top-3 right-3 bg-white bg-opacity-90 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold text-indigo-700">
                    {index + 1}
                  </div>
                </div>
                
                {/* Video Info */}
                <div className={`p-4 ${index % 3 === 0 ? 'bg-pink-50' : index % 3 === 1 ? 'bg-purple-50' : 'bg-indigo-50'}`}>
                  <h3 className="font-bold text-gray-800 mb-1 line-clamp-2 h-12">
                    {video.title}
                  </h3>
                  
                  <div className="flex items-center mt-2">
                    <div className={`w-3 h-3 rounded-full mr-2 ${hoveredVideo === video.id ? 'animate-pulse' : ''} ${
                      index % 3 === 0 ? 'bg-pink-500' : 
                      index % 3 === 1 ? 'bg-purple-500' : 
                      'bg-indigo-500'
                    }`}></div>
                    <span className="text-xs text-gray-600">Click to watch</span>
                  </div>
                </div>
              </div>
              
              {/* Fun decorative elements based on position */}
              {index % 4 === 0 && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full z-10 transform rotate-12"></div>
              )}
              {index % 4 === 1 && (
                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-400 rounded-lg z-10 transform rotate-45"></div>
              )}
              {index % 4 === 2 && (
                <div className="absolute -top-2 -left-2 w-7 h-7 bg-blue-400 rounded-lg z-10 transform -rotate-12"></div>
              )}
              {index % 4 === 3 && (
                <div className="absolute -bottom-2 -left-2 w-5 h-5 bg-red-400 rounded-full z-10"></div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Fun decorative background elements */}
      <div className="absolute -z-10 top-1/4 left-10 w-20 h-20 bg-yellow-200 rounded-full opacity-20"></div>
      <div className="absolute -z-10 bottom-1/4 right-10 w-32 h-32 bg-purple-200 rounded-full opacity-20"></div>
      <div className="absolute -z-10 bottom-1/3 left-1/4 w-16 h-16 bg-pink-200 rounded-full opacity-20"></div>
    </div>
  );
};

export default VideoGallery;