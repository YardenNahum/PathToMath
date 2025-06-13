import React, { useState, useEffect, useRef } from 'react';
import background from '../../../assets/Images/Background/profileBg.jpg';
import { useUser } from '../../Utils/UserContext';

const ProfilePage = () => {
  const { user, update } = useUser();
  const [isAlert, setIsAlert] = useState(false);
  const [message, setMessage] = useState({ message: "", isSuccess: false });
  const [showAvatarSection, setShowAvatarSection] = useState(false);
  const [avatar, setAvatar] = useState(user?.avatar || "./src/assets/Images/Avatars/avatar1.png");
  const showPassword = useRef(false);

  /**
   * Show an alert message.
   * @param {string} message - The alert message to show.
   * @param {boolean} isSuccess - Whether the alert is success (true) or error (false).
   * @returns {void}
   */
  const showAlert = (message, isSuccess) => {
    setMessage({ message, isSuccess });
    setIsAlert(true);
  };

  /**
   * Handles profile update form submission.
   * Updates user data if any changes are detected.
   * @param {Event} event - The form submission event.
   * @returns {void}
   */
  const updateProfile = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    // Extract form data and check for changes
    const updatedUser = {
      ...user,
      name: formData.get("name") || user.name,
      email: formData.get("email") || user.email,
      password: formData.get("password") || user.password,
      grade: parseInt(formData.get("grade")) || user.grade,
      avatar: avatar || user.avatar,
    };
    // Check if any fields have changed
    const isSame =
      updatedUser.name === user.name &&
      updatedUser.email === user.email &&
      updatedUser.password === user.password &&
      updatedUser.grade === user.grade &&
      updatedUser.avatar === user.avatar;
    // Check if any required fields are empty
    const isEmpty =
      !formData.get("name") ||
      !formData.get("email") ||
      !formData.get("password");
    // If no changes or empty fields, show alert and return
    if (isEmpty || isSame) {
      showAlert("No changes made", false);
      return;
    }

    try {
      // Update user data in context
      await update(user.email, updatedUser);
      showAlert("Profile Updated Successfully!", true);
    } catch (err) {
      console.error("Failed to update user:", err);
      showAlert("Failed to update profile", false);
    }
  };

  /**
   * Alert component to show messages.
   * @param {Object} props
   * @param {string} props.message - The alert message.
   * @param {boolean} props.isSuccess - Whether alert is success or error.
   * @returns {JSX.Element} JSX for alert box.
   */
  const Alert = ({ message, isSuccess }) => {
    const messageModel = {
      success: "bg-green-500",
      error: "bg-red-500",
    };

    useEffect(() => {
      const timeout = setTimeout(() => {
        setIsAlert(false);
      }, 5000);
      return () => clearTimeout(timeout);
    }, []);

    const alertColor = messageModel[isSuccess ? "success" : "error"];
    return (
      <div
        id="alert"
        className={`text-white px-4 py-3 rounded-lg shadow-lg flex items-center justify-between space-x-4 ${alertColor}`}
      >
        <p className="font-semibold">{message}</p>
        <button
            className="text-white font-bold px-2 hover:text-gray-300 cursor-pointer"
            onClick={() => setIsAlert(false)}
        >
          OK
        </button>
      </div>
    );
  };

  /**
   * AvatarOptions modal component for choosing avatars.
   * @returns {JSX.Element} JSX for avatar selection modal.
   */
  const AvatarOptions = () => {
    const avatars = [
      "avatar1",
      "avatar2",
      "avatar3",
      "avatar4",
      "avatar5",
      "avatar6",
      "avatar7",
    ];

    /**
     * Extracts filename without extension from path.
     * @param {string} path - Full path of the file.
     * @returns {string} Filename without extension.
     */
    const fileWithoutExtenstion = (path) => {
      const fileName = path.split("/").pop();
      return fileName.split(".")[0];
    };

    /**
     * Single avatar image component.
     * @param {Object} props
     * @param {string} props.avatarEndSrc - Avatar image file name without extension.
     * @returns {JSX.Element} JSX for avatar image.
     */
    const Avatar = ({ avatarEndSrc }) => {
      const currentAvatar = fileWithoutExtenstion(user.avatar);
      const selectedAvatar = fileWithoutExtenstion(avatar);
      const borderColor =
        selectedAvatar === avatarEndSrc
          ? "border-blue-500"
          : currentAvatar === avatarEndSrc
          ? "border-blue-200"
          : "border-transparent";

      const avatarSrc = `../../../assets/Images/Avatars/${avatarEndSrc}.png`;

      const handleAvatarClick = () => {
        setAvatar(avatarSrc);
        setShowAvatarSection(false);
      };

      return (
        <img
          src={avatarSrc}
          className={`md:w-40 md:h-40 h-30 w-30 rounded-xl cursor-pointer border-5 transition hover:scale-105 ${borderColor}`}
          onClick={handleAvatarClick}
          alt={`Avatar ${avatarEndSrc}`}
        />
      );
    };

    return (
      <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 flex items-center justify-center z-40">
        <div className="bg-white p-4 rounded-xl w-3/4 md:w-1/2 h-3/4 overflow-y-auto">
          <h1 className="mb-5 lg:text-6xl sm:text-5xl text-3xl font-semibold text-black text-center">
            Choose An Avatar:
          </h1>
          <div className="flex flex-wrap gap-7 justify-center">
            {avatars.map((av) => (
              <Avatar key={av} avatarEndSrc={av} />
            ))}
          </div>
        </div>
      </div>
    );
  };

  /**
   * Avatar display section with change button.
   * @returns {JSX.Element} JSX for avatar section.
   */
  const AvatarSection = () => {
    return (
      <div className="flex flex-col items-center justify-center md:w-1/3 w-full mr-5 p-6">
        <img
          id="AvatarImg"
          src={avatar}
          className="bg-white border-5 border-blue-500 w-48 h-48 object-cover rounded-xl p-3 mb-4"
          alt="User Avatar"
        />
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded cursor-pointer"
          onClick={() => setShowAvatarSection(true)}
        >
          Change Avatar
        </button>
      </div>
    );
  };

  /**
   * GradePicker select input.
   * @returns {JSX.Element} JSX for grade selection dropdown.
   */
  const GradePicker = () => {
    const gradeOptions = [
      { value: 1, label: "1st Grade" },
      { value: 2, label: "2nd Grade" },
      { value: 3, label: "3rd Grade" },
      { value: 4, label: "4th Grade" },
      { value: 5, label: "5th Grade" },
      { value: 6, label: "6th Grade" },
    ];

    return (
      <div className="text-gray-700 font-bold">
        <label htmlFor="grade" className="block mb-1">
          Grade
        </label>
        <select
          id="grade"
          name="grade"
          className="w-full p-2 font-normal rounded shadow bg-white hover:cursor-pointer"
          defaultValue={user.grade}
        >
          {gradeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  };

  /**
   * InputBox component for labeled inputs with optional password visibility toggle.
   * @param {Object} props
   * @param {string} props.labelText - Label text for input.
   * @param {string} props.type - Input type (text, email, password, etc.).
   * @param {string} props.field - Field name used for input id and name.
   * @returns {JSX.Element} JSX for input box.
   */
  const InputBox = ({ labelText, type, field }) => {
    const isPassword = type === "password";

    const handleTogglePasswordVisibility = () => {
      showPassword.current = !showPassword.current;
      const input = document.getElementById(field);
      if (input) {
        input.type = showPassword.current ? "text" : "password";
      }
    };

    return (
      <div className="w-full">
        <label htmlFor={field} className="block text-gray-700 font-bold mb-1">
          {labelText}
        </label>
        <input
          id={field}
          placeholder={user[field]}
          name={field}
          type={isPassword && showPassword.current ? "text" : type}
          defaultValue={user[field]}
          className="p-2 rounded shadow bg-white w-full"
        />
        {isPassword && (
          <button
            type="button"
            className="mt-1 text-blue-500 hover:text-blue-700 hover:cursor-pointer transition-all duration-300"
            onClick={handleTogglePasswordVisibility}
          >
            {showPassword.current ? "Hide" : "Show"}
          </button>
        )}
      </div>
    );
  };

  /**
   * Profile form including avatar, inputs, grade picker and update button.
   * @returns {JSX.Element} JSX for profile form.
   */
  const ProfileForm = () => (
    <div className="relative border-10 border-white flex flex-col md:flex-row bg-blue-200 rounded-xl py-2 md:py-10 md:h-auto xl:w-1/2 justify-center items-center shadow-md w-full gap-8">
      <AvatarSection />
      <div className="flex flex-col justify-center h-full w-full md:w-1/2 lg:w-1/3 md:gap-3 items-center">
        <form
          className="gap-6 text-black flex flex-col w-full"
          onSubmit={updateProfile}
        >
          <InputBox labelText="Name" type="text" field="name" />
          <InputBox labelText="Email" type="email" field="email" />
          <InputBox labelText="Password" type="password" field="password" />
          <GradePicker />
          <button
            type="submit"
            className="bg-green-400 hover:bg-green-500 text-white font-bold py-2 px-4 rounded mt-2 cursor-pointer"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div
      className="bg-cover playful-font bg-center flex-grow w-full h-full"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="antialiased flex flex-col align-middle justify-center items-center w-full h-full p-20 gap-6">
        {!user ? (
          <div className="text-center bg-white bg-opacity-90 p-10 rounded-xl shadow-md max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-blue-800">
              Please log in to edit your profile
            </h2>
            <p className="text-gray-700">
              You must be logged in to view and update your profile.
            </p>
          </div>
        ) : (
          <>
            {showAvatarSection && <AvatarOptions />}
            <h1 className="text-white text-3xl font-extrabold mb-7 py-7 tracking-widest">
              Let's Edit Your Profile:
            </h1>
            <ProfileForm />
            {isAlert && <Alert message={message.message} isSuccess={message.isSuccess} />}
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;