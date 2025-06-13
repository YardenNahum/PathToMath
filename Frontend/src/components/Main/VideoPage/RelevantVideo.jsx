import React, { useState, useEffect } from "react";
import background from '../../../assets/Images/Background/HomeBg.png'
import snail_icon from '../../../assets/Images/Loaders/snail_icon.png';
import VideoGallery from './Gallery.jsx'; // make sure the path is correct
import { Volume2, VolumeX, Maximize2, Minimize2, X, Star, BookOpen, ThumbsUp } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useGrade } from '../../Utils/GradeComponent.jsx';
import { useParams } from 'react-router-dom';
import ShadowedTitle from "../../Utils/ShadowedTitle.jsx";
import SubjectCircle from "../../Main/HomePage/SubjectCircle.jsx";
import { subjectsData } from "../../Utils/SubjectData.jsx";
const API_KEY = "AIzaSyABk2py4r0NYy5x63rfJ3bxoY3gMJKtMy8";

const RelevantVideo = () => {
  const { subject } = useParams();
  const { grade } = useGrade();

  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedVideoTitle, setSelectedVideoTitle] = useState("");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showTip, setShowTip] = useState(false);

  // Colors for the fun math theme
  const colors = ["bg-pink-500", "bg-purple-500", "bg-indigo-500", "bg-blue-500", "bg-green-500"];
  

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      setError(null);
      setVideos([]);

      try {
        const query = `${subject} grade ${grade} math`;
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
  }, [grade, subject]);

  const handleVideoSelect = (id, title) => {
    setSelectedVideo(id);
    setSelectedVideoTitle(title);
    // Show a math tip when video starts
    setTimeout(() => setShowTip(true), 1000);
    setTimeout(() => setShowTip(false), 8000);
  }

  const handleCloseVideo = () => {
    setSelectedVideo(null);
    setSelectedVideoTitle("");
    setShowTip(false);
  }

  const toggleMute = () => {
    setIsMuted(!isMuted);
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  }

  // Random math facts for Grade 2 addition
  const mathTips = [
    "Adding zero to any number gives you the same number!",
    "You can add numbers in any order and get the same answer!",
    "When you add 1, you get the number that comes next when counting!",
    "Adding 10 to a number makes the tens place go up by 1!",
    "You can break numbers apart to make adding easier!"
  ];

  const randomTip = mathTips[Math.floor(Math.random() * mathTips.length)];

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
            <div className="flex items-center gap-4 mb-8 justify-center">
                <div className="flex items-center gap-6">
                    <SubjectCircle
                        imageSrc={subjectsData[subject]?.icon}
                        title={subject}
                        variant="circle"
                        circleColor={subjectsData[subject]?.color || "#D3D3D3"}
                        size={150}
                        clickable={false}
                    />
                    <ShadowedTitle
                        text={`Lets Learn ${subject}`}
                        shadowColor={subjectsData[subject]?.color}
                    />
                </div>
            </div>


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
        <VideoGallery videos={videos} onVideoClick={handleVideoSelect} />
      )}

      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-indigo-900/90 to-purple-900/90 backdrop-blur-sm">
          <div className={`relative ${isFullscreen ? 'w-full h-full' : 'w-[90%] max-w-4xl'} rounded-3xl overflow-hidden transform transition-all duration-300`}>
            {/* Fun decorative elements */}
            <div className="absolute -top-8 -left-8 w-16 h-16 bg-yellow-300 rounded-full opacity-30 animate-pulse"></div>
            <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-pink-400 rounded-full opacity-30"></div>
            <div className="absolute top-1/3 -right-6 w-12 h-12 bg-indigo-400 rounded-full opacity-30"></div>
            <div className="absolute bottom-1/3 -left-6 w-14 h-14 bg-green-400 rounded-full opacity-30"></div>

            {/* Card with video */}
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-8 border-indigo-100">
              {/* Video title bar */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex items-center justify-between text-white">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mr-3">
                    <Star className="text-yellow-500 fill-yellow-500" size={20} />
                  </div>
                  <h3 className="font-bold text-lg md:text-xl truncate max-w-md">
                    {selectedVideoTitle || "Math Video"}
                  </h3>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={toggleMute}
                    className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                  >
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>
                  <button
                    onClick={toggleFullscreen}
                    className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                  >
                    {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                  </button>
                  <button
                    onClick={handleCloseVideo}
                    className="p-2 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Video player */}
              <div className="relative">
                <iframe
                  className={`w-full ${isFullscreen ? 'h-screen' : 'h-[400px]'}`}
                  src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1&mute=${isMuted ? 1 : 0}`}
                  title="Math Video"
                  frameBorder="0"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                ></iframe>

                {/* Math Tip popup */}
                {showTip && (
                  <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:bottom-4 md:max-w-xs bg-white rounded-xl p-4 shadow-lg border-l-8 border-green-500 animate-fade-in-up">
                    <div className="flex items-start">
                      <div className="mr-3 mt-1">
                        <BookOpen className="text-green-500" size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-green-700 mb-1">Math Tip!</h4>
                        <p className="text-sm text-gray-700">{randomTip}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowTip(false)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>

              {/* Fun controls bar */}
              <div className="bg-gray-50 p-4">
                <div className="flex flex-wrap gap-2 justify-center">
                  {['Addition', 'Subtraction', 'Counting', 'Place Value', 'Shapes'].map((skill, i) => (
                    <div key={skill} className={`${colors[i % colors.length]} text-white px-3 py-1 rounded-full text-sm font-medium`}>
                      {skill}
                    </div>
                  ))}
                </div>

                <div className="mt-3 flex justify-between items-center">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} className="text-yellow-400 fill-yellow-400" size={16} />
                    ))}
                    <span className="text-xs text-gray-500 ml-1">Great for learning!</span>
                  </div>

                  <button className="flex items-center gap-1 text-indigo-600 font-medium text-sm">
                    <ThumbsUp size={16} />
                    <span>Great Video!</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RelevantVideo;

