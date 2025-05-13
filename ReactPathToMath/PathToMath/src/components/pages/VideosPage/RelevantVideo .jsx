import React, { useState, useEffect } from "react";
import background from '../../../assets/Images/Background/back.png';
// import { useGrade } from '../../Main/GradeComponent';
// import { selectedTopic } from '../../pages/VideosPage/VideoMainPage';


const API_KEY = "AIzaSyABk2py4r0NYy5x63rfJ3bxoY3gMJKtMy8";

const RelevantVideo  = () => {
    const grade = 2;
    const topic = "Addition";
    //const grade = useGrade();
    //const topic = selectedTopic;

    console.log("Grade:", grade);
    console.log("Topic:", topic);
    
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVideos = async () => {
        setLoading(true);
        setError(null);

        try {
              const query  = `${topic} grade ${grade} math`;

              console.log("query:", query);

              const maxResults = 3;
              const url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&q=${encodeURIComponent(query)}&part=snippet&type=video&maxResults=${maxResults}`;
              const response = await fetch(url);

            if (!response.ok) {
              throw new Error('youtube data not available' );
            }

            const data = await response.json();
            const videoUrls = data.items.map(item => `https://www.youtube.com/embed/${item.id.videoId}`);
            setVideos(videoUrls);

        } catch (err) {
            console.error(err);
            setError("Could not fetch from YouTube");
            setVideos([]);
        } finally {
            setLoading(false);
        }
      };
        fetchVideos();
    },[grade, topic]);
    

    return (
        <div
        className="relative min-h-[100vh] w-full flex flex-col items-center justify-start pt-12 pb-24 px-4 overflow-hidden"
        style={{
            backgroundImage: `url(${background})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
        }}
        >


        <h2>{`Videos for Grade ${grade} - ${topic}`}</h2>
          {loading && <p>Loading videos...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
          <div className="video-grid">
            {videos.map((videoUrl, index) => (
              <iframe
                key={index}
                width="400"
                height="225"
                src={videoUrl}
                title={`Video ${index + 1}`}
                frameBorder="0"
                allowFullScreen
              ></iframe>
            ))}
          </div>
        </div>
    );
};

export default RelevantVideo ;
