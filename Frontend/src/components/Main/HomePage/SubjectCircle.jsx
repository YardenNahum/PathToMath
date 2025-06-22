import React from 'react';
/**
 *  SubjectCircle component
 *  Renders a circular subject icon with an image, title, and description.
 * * @param {Object} props - The properties for the component.
 * @param {string} props.imageSrc - The URL of the image to display in the circle.
 * @param {string} props.title - The title to display below the circle.
 * @param {string} props.description - The description to display on the back side of the circle.
 * @param {string} [props.variant="flip"] - The variant of the circle ("
 *  circle" for static circle, "flip" for flipping card).
 * @param {string} [props.circleColor="#D3D3D3"] - The background color of the circle.
 * @param {number} [props.size=240] - The size of the circle in pixels.
 * @param {boolean} [props.clickable=true] - Whether the circle is clickable.
 * @returns {JSX.Element} - The rendered SubjectCircle component.
 */
function SubjectCircle({
  imageSrc,
  title,
  description,
  variant = "flip",
  circleColor = "#D3D3D3",
  size = 240,
  clickable = true
}) {
  const cursorClass = clickable ? "cursor-pointer" : "cursor-default";
  // Subjects in subjectspage and videospage
  if (variant === "circle") {
    const circleSize = `${size}px`;

    return (
      <div className={`flex flex-col items-center ${cursorClass} playful-font`}>
        <div
          className="rounded-full flex items-center justify-center shadow-md border-4 border-white"
          style={{
            width: circleSize,
            height: circleSize,
            backgroundColor: circleColor,
            boxShadow: '0 0 10px 4px white',
          }}
        >
          <img
            src={imageSrc}
            alt={title}
            className="w-[80%] h-[80%] object-contain"
          />
        </div>
      </div>
    );
  }

  // Homepage flipping subject cards
  return (
    <div className="relative w-56 h-64 perspective group cursor-pointer playful-font">
      <div className="w-full h-56 relative transition-transform duration-700 transform-style-preserve-3d group-hover:rotate-y-180 will-change-transform">

        {/* Front Side */}
        <div className="absolute w-full h-full backface-hidden flex items-center justify-center">
          <div className="w-44 h-44 rounded-full overflow-hidden shadow-md border-4 border-white bg-white">
            <img
              src={imageSrc}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Back Side */}
        <div className="absolute w-full h-full rotate-y-180 backface-hidden flex items-center justify-center">
          <div className="w-44 h-44 rounded-full bg-orange-300 shadow-md border-4 border-white flex items-center justify-center p-4 text-center">
            <p className="text-base text-gray-800">{description}</p>
          </div>
        </div>
      </div>

      {/* Title (below flip area) */}
      <div className="text-center text-xl font-bold text-gray-900 mt-3">
        {title}
      </div>
    </div>
  );
}

export default SubjectCircle;
