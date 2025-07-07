import React from "react";
import ButtonComponent from "../../../Utils/Button.jsx";
import successImage from "../../../../assets/Images/Games/success.png";
import failureImage from "../../../../assets/Images/Games/failure.png";

/**
 * Reusable component for end-game screen.
 * 
 * @param {boolean} isSuccess - Whether the user passed or failed
 * @param {string} [customImage] - Optional custom image for success/failure
 * @param {string} buttonText - Text on the button
 * @param {function} handleClick - Button click handler
 * @param {string} bgColor - Tailwind class for button background
 * @returns {JSX.Element}
 */
const EndGameComponent = ({
  isSuccess,
  customImage,
  buttonText,
  handleClick,
  bgColor
}) => {
  const fallbackImage = isSuccess ? successImage : failureImage;
  const imageToUse = customImage || fallbackImage;
  const altText = isSuccess ? "Success" : "Failure";

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <img
        className="h-60 w-auto max-w-full object-contain"
        src={imageToUse}
        alt={altText}
      />
      <div className="mb-5">
        <ButtonComponent
          label={buttonText}
          onClick={handleClick}
          textColor="text-black"
          bgColor={bgColor}
        />
      </div>
    </div>
  );
};

export default EndGameComponent;
