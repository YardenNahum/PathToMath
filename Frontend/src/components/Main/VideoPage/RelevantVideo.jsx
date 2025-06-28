import React, { useState, useEffect, useRef, useMemo } from "react";
import background from '../../../assets/Images/Background/HomeBg.png';
import snail_icon from '../../../assets/Images/Loaders/snail_icon.png';
import VideoGallery from './Gallery.jsx';
import { Volume2, VolumeX, Maximize2, Minimize2, X, BookOpen, Star } from "lucide-react";
import { useGrade } from '../../Utils/GradeComponent.jsx';
import { useParams } from 'react-router-dom';
import ShadowedTitle from "../../Utils/ShadowedTitle.jsx";
import SubjectCircle from "../../Main/HomePage/SubjectCircle.jsx";
import { subjectsData } from "../../Utils/SubjectData.jsx";
import { getOrdinalSuffix } from "../../Utils/OrdinalGrade.jsx";
import apiService from "../../../services/ApiService.jsx";

const RelevantVideo = () => {
  const { subject } = useParams();
  const { grade } = useGrade();

  const [progress, setProgress] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedVideoTitle, setSelectedVideoTitle] = useState("");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const fullscreenRef = useRef(null);

  // Colors for badges
  const colors = ["bg-pink-500", "bg-purple-500", "bg-indigo-500", "bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-red-500"];

  // Progress bar effect
  useEffect(() => {
    let intervalId;

    if (loading) {
      setProgress(0); // reset at start

      intervalId = setInterval(() => {
        setProgress((prev) => {
          // Increase by 5 every 150ms but max 90%, leaving last 10% for finalizing
          if (prev < 90) {
            return prev + 5;
          } else {
            return prev;
          }
        });
      }, 150);
    } else {
      // When loading ends, progress jumps to 100%
      setProgress(100);
      // Clear interval in case it’s still running
      if (intervalId) clearInterval(intervalId);
    }

    // Cleanup interval on unmount or when loading changes
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [loading]);

  // Fetch YouTube videos based on subject and grade
  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      setError(null);
      setVideos([]);

      try {
        const subjectQueryMap = {
          addition: ["addition", "adding", "math facts", "sums"],
          subtraction: ["subtraction", "taking away", "minus", "difference"],
          multiplication: ["multiplication", "times tables", "products"],
          division: ["division", "quotients", "divide", "splitting"],
          percentage: ["percentages", "ratios", "fractions", "proportions"],
        };

        const gradeLabel = `${getOrdinalSuffix(grade)} grade`;
        const keywords = subjectQueryMap[subject?.toLowerCase()] || [subject];
        const keywordPhrase = keywords.join(" OR ");
        const query = `${gradeLabel} ${subject} math for kids | ${keywordPhrase}`;

        // 🔁 Replace with service call
        const data = await apiService.fetchYouTubeVideos(query);

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
        console.error("Fetch error:", err);
        setError(`Could not fetch from YouTube: ${err.message}`);
        setLoading(false);
      }
    };

    fetchVideos();
  }, [grade, subject]);

  // Sync fullscreen state
  useEffect(() => {
    const onFullscreenChange = () => {
      const fullscreenElement = document.fullscreenElement;
      setIsFullscreen(fullscreenElement === fullscreenRef.current);
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
    };
  }, []);

  const handleVideoSelect = (id, title) => {
    setSelectedVideo(id);
    setSelectedVideoTitle(title);
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
    const el = fullscreenRef.current;

    if (!document.fullscreenElement && el) {
      el.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  // Educational tips shown while video plays
  const mathTips = [
    "Adding zero to any number gives you the same number!",
    "You can add numbers in any order and get the same answer!",
    "When you add 1, you get the number that comes next when counting!",
    "Adding 10 to a number makes the tens place go up by 1!",
    "You can break numbers apart to make adding easier!",
    "Multiplying by zero always results in zero!",
    "Dividing a number by itself equals one!",
    "Percentages are just parts out of 100!",
    "Subtracting a number twice brings you back to the original number!",
    "Fractions represent parts of a whole!",
    "Multiplication is repeated addition!",
    "The commutative property means order doesn't matter for addition or multiplication!",
  ];

  // Randomly chosen math tip for overlay popup
  const randomTip = mathTips[Math.floor(Math.random() * mathTips.length)];

  // Related subject keywords displayed as badges
  const baseKeywords = useMemo(() => {
    switch (subject?.toLowerCase()) {
      case "addition":
        return ["Addition", "Sum", "Plus", "Adding", "Increase", "Combine"];
      case "subtraction":
        return ["Subtraction", "Minus", "Difference", "Decrease", "Take Away"];
      case "multiplication":
        return ["Multiplication", "Times", "Product", "Multiply", "Factors", "Repeated Addition"];
      case "division":
        return ["Division", "Divide", "Quotient", "Fraction", "Share", "Split"];
      case "percentage":
        return ["Percentage", "Percent", "Ratio", "Fraction", "Part", "Proportion"];
      default:
        return [subject ? subject.charAt(0).toUpperCase() + subject.slice(1) : "Math", "Math"];
    }
  }, [subject]);

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
            text={`Top ${subject} Videos for ${getOrdinalSuffix(grade)} Grade`}
            shadowColor={subjectsData[subject]?.color}
          />
        </div>
      </div>

      {loading && (
        <div className="flex playful-font flex-col items-center justify-center h-[300px]">
          <img
            src={snail_icon}
            alt="Loading snail"
            className="w-16 h-16 animate-bounce"
          /> Loading videos...
          <div className="mt-4 text-gray-600">Please wait while we fetch the best videos for you!</div>
          {/* Progress bar */}
          <div className="w-80 h-4 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-400 transition-all duration-150"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {error && <p className="text-lg text-red-500 font-extrabold text-center">{error}</p>}

      {!loading && !error && (
        <VideoGallery videos={videos} onVideoClick={handleVideoSelect} />
      )}

      {selectedVideo && (
        <div className="fixed top-20 inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-indigo-900/90 to-purple-900/90 backdrop-blur-sm">
          <div
            ref={fullscreenRef}
            className={`relative overflow-hidden transform transition-all duration-300
              ${isFullscreen ? 'w-screen h-screen rounded-none' : 'w-[90%] max-w-4xl rounded-3xl'}`}
          >
            {/* Fun decorative elements */}
            {!isFullscreen && (
              <>
                <div className="absolute -top-8 -left-8 w-16 h-16 bg-yellow-300 rounded-full opacity-30 animate-pulse"></div>
                <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-pink-400 rounded-full opacity-30"></div>
                <div className="absolute top-1/3 -right-6 w-12 h-12 bg-indigo-400 rounded-full opacity-30"></div>
                <div className="absolute bottom-1/3 -left-6 w-14 h-14 bg-green-400 rounded-full opacity-30"></div>
              </>
            )}

            {/* Card with video */}
            <div
              className={`bg-white shadow-2xl overflow-hidden
                ${isFullscreen ? 'h-full border-0 rounded-none' : 'rounded-3xl border-8 border-indigo-100'}`}
            >
              {/* Video title bar */}
              <div
                className={`bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white flex items-center justify-between
                  ${isFullscreen ? 'absolute top-0 left-0 right-0 z-10 rounded-none' : ''}`}
                style={isFullscreen ? { backdropFilter: 'blur(10px)', backgroundColor: 'rgba(67, 56, 202, 0.7)' } : {}}
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mr-3">
                    <Star className="text-yellow-500 fill-yellow-500" size={20} />
                  </div>
                  <h3 className="font-bold text-lg break-words max-w-xl leading-snug md:text-xl">
                    {selectedVideoTitle || "Math Video"}
                  </h3>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={toggleMute}
                    className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors cursor-pointer"
                  >
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>
                  <button
                    onClick={toggleFullscreen}
                    className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors cursor-pointer"
                  >
                    {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                  </button>
                  <button
                    onClick={handleCloseVideo}
                    className="p-2 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Video player */}
              <div className={`relative ${isFullscreen ? 'h-full pt-16' : ''}`}>
                <iframe
                  className={`w-full ${isFullscreen ? 'h-full' : 'h-[400px]'}`}
                  src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1&mute=${isMuted ? 1 : 0}`}
                  title="Math Video"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                />
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

              {/* Relevant keywords badges */}
              {!isFullscreen && (
                <div className="bg-gray-50 p-4">
                  <div className="flex flex-wrap gap-2 justify-center">
                    {baseKeywords.map((keyword, i) => (
                      <div
                        key={keyword}
                        className={`${colors[i % colors.length]} text-white px-3 py-1 rounded-full text-sm font-medium`}
                      >
                        {keyword}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RelevantVideo;
