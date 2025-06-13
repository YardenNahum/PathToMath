import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../Utils/UserContext";
import LoginSignup from './LoginSignup';
import ButtonComponent from "../../Utils/Button";
const LogoutPage = () => {
    const { logoutUser } = useUser();
    const navigate = useNavigate();

    const handleConfirmLogout = () => {
        logoutUser();
        localStorage.removeItem("userType");
        navigate("/login");
    }
    const handleCancelLogout = () => {
        navigate(-1);
    }
    return (
        <div>
            <LoginSignup />

            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray/10 backdrop-blur-sm z-50">
                <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                    <h2 className="text-xl font-bold mb-4">Are you sure you want to log out?</h2>
                    <div className="flex justify-center gap-4">
                        <ButtonComponent
                            label="Yes"
                            bgColor="bg-orange-500"
                            onClick={handleConfirmLogout}
                        />
                        <ButtonComponent
                            label="Cancel"
                            bgColor="bg-gray-300"
                            textColor="text-gray-800"
                            onClick={handleCancelLogout}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
export default LogoutPage;