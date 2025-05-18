import React, { useState, useEffect } from "react";
import background from '../../../assets/Images/Background/white_background.png';
import snail_icon from '../../../assets/Images/Loaders/snail_icon.png';
import VideoGallery from './Gallery.jsx'; // make sure the path is correct

const API_KEY = "AIzaSyABk2py4r0NYy5x63rfJ3bxoY3gMJKtMy8";

const RelevantVideo = () => {
  const grade = 2;
  const topic = "Addition";

  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      setError(null);
      setVideos([]);

      try {
        const query = `${topic} grade ${grade} math`;
        const maxResults = 10;
        const url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&q=${encodeURIComponent(query)}&part=snippet&type=video&maxResults=${maxResults}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("YouTube data not available");
        }

        const data = await response.json();
        const videoItems = data.items.map((item) => ({
          id: item.id.videoId,
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails.high.url,
        }));

        setTimeout(() => {
          setVideos(videoItems);
          setLoading(false);
        }, 3000);
      } catch (err) {
        console.error(err);
        setError("Could not fetch from YouTube");
        setLoading(false);
      }
    };

    fetchVideos();
  }, [grade, topic]);

  return (
    <div
      className="min-h-screen w-full bg-gray-100 text-gray-800 px-6 py-10"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      <h2 className="text-4xl font-bold mb-6 text-center text-gray-600">
        Hello Grade {grade}! Let's Learn {topic}
      </h2>

      {loading && (
        <div className="flex flex-col items-center justify-center h-[300px]">
          <img
            src={snail_icon}
            alt="Loading snail"
            className="w-16 h-16 mb-1 animate-bounce"
          />
          <div className="w-80 h-4 bg-gray-300 rounded-full overflow-hidden">
            <div className="h-full bg-sky-400 animate-loading-bar" style={{ width: '100%' }}></div>
          </div>
        </div>
      )}

      {error && <p className="text-lg text-red-500 text-center">{error}</p>}

      {!loading && !error && (
        <VideoGallery videos={videos} onVideoClick={setSelectedVideo} />
      )}

      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="relative w-[90%] max-w-3xl">
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute -top-12 -right-12 border-2 border-red-500 group hover:border-red-500 w-12 h-12 duration-500 overflow-hidden"
              type="button"
            >
              <span className="absolute w-full h-full bg-red-500 rotate-45 group-hover:top-9 duration-500 top-12 left-0"></span>
              <span className="absolute w-full h-full bg-red-500 rotate-45 top-0 group-hover:left-9 duration-500 left-12"></span>
              <span className="absolute w-full h-full bg-red-500 rotate-45 top-0 group-hover:right-9 duration-500 right-12"></span>
              <span className="absolute w-full h-full bg-red-500 rotate-45 group-hover:bottom-9 duration-500 bottom-12 right-0"></span>
            </button>
            <iframe
              className="w-full h-[400px] rounded-xl"
              src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
              title="Selected Video"
              frameBorder="0"
              allow="autoplay; fullscreen"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default RelevantVideo;
