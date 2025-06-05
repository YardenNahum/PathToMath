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
     * Displays an alert with a custom message and style.
     * @param {string} message - The alert message to display.
     * @param {boolean} isSuccess - Whether the alert is a success (true) or an error (false).
     * @returns {void}
     */
    const showAlert = (message, isSuccess) => {
        setMessage({ message: message, isSuccess: isSuccess });
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
     * Renders an alert box based on the message and success flag.
     * @param {Object} props
     * @param {string} props.message - The message to display.
     * @param {boolean} props.isSuccess - Whether it's a success alert.
     * @returns {JSX.Element}
     */
    const Alert = ({ message, isSuccess }) => {
        const messageModel = {
            success: "bg-green-500",
            error: "bg-red-500"
        };

        const closeAlert = () => {
            setIsAlert(false);
        };

        useEffect(() => {
            const timeout = setTimeout(() => {
                const alert = document.getElementById("alert");
                if (alert) {
                    alert.style.opacity = "0";
                    alert.style.transition = "opacity 0.6s ease-in-out";
                }
            }, 5000);

            return () => clearTimeout(timeout);
        }, []);

        const alertColor = messageModel[isSuccess ? "success" : "error"];
        return (
            <div id="alert" className={`fixed right-5 top-5 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center justify-between space-x-4 z-10 ${alertColor}`}>
                <p className="font-semibold">{message}</p>
                <button className="text-white font-bold px-2 hover:text-gray-300" onClick={closeAlert}>OK</button>
            </div>
        );
    };

    /**
     * Renders avatar selection options and handles avatar update.
     * @returns {JSX.Element}
     */
    const AvatarOptions = () => {
        const avatars = ["avatar1", "avatar2", "avatar3", "avatar4", "avatar5", "avatar6", "avatar7"];

        const fileWithoutExtenstion = (path) => {
            const fileName = path.split("/").pop(); // e.g., "avatar1.png"
            return fileName.split(".")[0];          // e.g., "avatar1"
        };

        /**
         * Renders a single avatar image option.
         * @param {Object} props
         * @param {string} props.avatarEndSrc - The avatar file name (e.g., "1.png").
         * @returns {JSX.Element}
         */
        const Avatar = ({ avatarEndSrc }) => {
            const currentAvatar = fileWithoutExtenstion(user.avatar);
            const selectedAvatar = fileWithoutExtenstion(avatar);
            const borderColor = selectedAvatar == avatarEndSrc ? "border-blue-500" : currentAvatar == avatarEndSrc ? "border-blue-200" : "border-transparent";

            const avatarSrc = `./src/assets/Images/Avatars/${avatarEndSrc}.png`;

            const handleAvatarClick = () => {
                setAvatar(avatarSrc);
                setShowAvatarSection(false);
            };

            return (
                <img src={avatarSrc} className={`md:w-40 md:h-40 h-30 w-30 rounded-xl cursor-pointer border-5 transition hover:scale-105 ${borderColor}`} onClick={handleAvatarClick} />
            );
        };

        return (
            <div className="fixed top-0 my-4 left-0 w-full h-full bg-black flex items-center justify-center">
                <div className="bg-white p-2 rounded-xl w-3/4 md:w-1/2 h-3/4 z-40 overflow-y-auto">
                    <div className='justify-center'>
                        <h1 className="mb-3 lg:text-6xl sm:text-5xl text-3xl font-extrabold text-center">Choose Avatar:</h1>
                    </div>
                    <div className='flex flex-wrap gap-7 justify-center'>
                        {avatars.map((av) => (
                            <Avatar key={av} avatarEndSrc={av} />
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    /**
     * Renders the main editable profile UI.
     * @returns {JSX.Element}
     */
    const body = () => {
        const AvatarSection = () => {
            return (
                <div id="avatar" className="flex flex-col items-center justify-center md:w-1/3 w-full mr-5 p-6">
                    <img id="AvatarImg" src={avatar} className="bg-white border-5 border-blue-500 w-48 h-48 object-cover rounded-xl p-3 mb-4" />
                    <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                        onClick={() => setShowAvatarSection(true)}>
                        Change Avatar
                    </button>
                </div>
            );
        };

        const GradePicker = () => {
            const gradeOptions = [
                { value: 1, label: "1st Grade" },
                { value: 2, label: "2nd Grade" },
                { value: 3, label: "3rd Grade" },
                { value: 4, label: "4th Grade" },
                { value: 5, label: "5th Grade" },
            ];

            return (
                <div className="flex-row">
                    <select
                        name="grade"
                        className="w-full p-2 rounded shadow bg-white hover:cursor-pointer"
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
         * Renders a text, email, or password input with optional password visibility toggle.
         * @param {Object} props
         * @param {string} props.type - Input type (e.g., "text", "email", "password").
         * @param {string} props.field - Field name (e.g., "name", "email").
         * @returns {JSX.Element}
         */
        const InputBox = ({ labelText, type, field }) => {
            const isPassword = type === "password";

            const handleTogglePasswordVisibility = () => {
                showPassword.current = !showPassword.current;
                document.getElementById(field).type = showPassword.current ? "text" : "password";
            };

            return (
                <div className="w-full w-2/3">
                    <label className="block text-gray-700 font-bold mb-1">{labelText}</label>
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

        return (
            <div className="border-10 border-white md:flex bg-blue-200 rounded-xl py-2 md:py-10 md:h-1/2 xl:w-1/2 justify-center align-middle shadow-md w-full">
                <AvatarSection />
                <div className="flex flex-col justify-center h-full w-full md:w-1/2 lg:w-1/3 md:gap-3 items-center">
                    <form className="gap-6 flex flex-col" onSubmit={(event) => updateProfile(event)}>
                        <InputBox labelText="Name" type="text" field="name" />
                        <InputBox labelText="Email" type="email" field="email" />
                        <InputBox labelText="Password" type="password" field="password" />
                        <GradePicker />
                        <button type="submit"
                            className="bg-green-400 hover:bg-green-500 text-white font-bold py-2 px-4 rounded mt-2 my-5 md:my-0">
                            Update
                        </button>
                    </form>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-cover bg-center flex-grow w-full h-full" style={{ backgroundImage: `url(${background})` }}>
            <div className='font-sans antialiased flex-col align-middle justify-items-center justify-center items-center w-full h-full p-20'>
                {!user ? (
                    <div className="text-center bg-white bg-opacity-90 p-10 rounded-xl shadow-md max-w-md mx-auto">
                        <h2 className="text-2xl font-bold mb-4 text-blue-800">Please log in to edit your profile</h2>
                        <p className="text-gray-700">You must be logged in to view and update your profile.</p>
                    </div>
                ) : (
                    <>
                        {isAlert && <Alert message={message.message} isSuccess={message.isSuccess} />}
                        {showAvatarSection && <AvatarOptions />}
                        <h2 className="text-white text-2xl font-extrabold mb-7 py-7 tracking-widest">Let's Edit Your Profile:</h2>
                        {body()}
                    </>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
