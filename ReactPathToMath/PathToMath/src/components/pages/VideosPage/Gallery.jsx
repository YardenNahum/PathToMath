import React, { useRef } from "react";

const VideoGallery = ({ videos, onVideoClick }) => {
  const scrollRef = useRef(null);
  const cardWidth = 660; // Approximate width of each video card including margin

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      const scrollAmount = direction === "left" ? -cardWidth : cardWidth;
      scrollRef.current.scrollTo({ left: scrollLeft + scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full mt-6">
      {/* Left Button */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-2 hover:bg-gray-100"
      >
        ◀
      </button>

      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto px-10 py-4 scroll-smooth no-scrollbar"
      >
        {videos.map((video, index) => (
          <div
            key={video.id}
            onClick={() => onVideoClick(video.id)}
            className="min-w-[360px] bg-white rounded-2xl shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300 border-2 border-transparent hover:border-indigo-300 cursor-pointer"
          >
            <iframe
              className="w-full h-40 pointer-events-none"
              src={`https://www.youtube.com/embed/${video.id}`}
              title={`Video ${index + 1}`}
              frameBorder="0"
              allowFullScreen
            ></iframe>
            <div className="p-3 bg-indigo-50">
              <h3 className="text-sm font-medium text-gray-800 truncate">
                {video.title}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Right Button */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-2 hover:bg-gray-100"
      >
        ▶
      </button>
    </div>
  );
};

export default VideoGallery;
