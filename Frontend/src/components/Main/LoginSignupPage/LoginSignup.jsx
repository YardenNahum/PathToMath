import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import { useNavigate } from 'react-router-dom';
import {useUser} from '../../Utils/UserContext';

const LoginSignup = ({ action }) => {
  const navigate = useNavigate();
  const { setUser,register , checkIfUserExists,getUserByMailNoSet} = useUser();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    class: "",
    role: ""
  });

  const handleSubmit = () => {
    if (action === "Login") {
      handleLogin();
    } else {
      handleSignup();
    }
  };

  // Handle signup logic
  const handleSignup = () => {
          register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        grade: Number(formData.class)
      })
        .then((user) => {
          setUser(user);
          localStorage.setItem("userEmail", user.email);
          navigate("/");
        })
        .catch((error) => {
          console.error("❌ Registration failed:", error);
          alert("Registration failed. Please try again.");
        });
  }
  // Handle login logic
  const handleLogin = () => {
    const { email, password, role } = formData;
    console.log("Logging in with:", { email, password, role });
    //get user by email
    getUserByMailNoSet(email)
      .then((user) => {
        //if user not found
        if (!user) {
          alert("User not found 😢");
          return;
        }
        // Check if password matches
        if (user.password !== password) {
          alert("Incorrect password ❌");
          return;
        }
        // Save user in context and localStorage
        setUser(user);
        localStorage.setItem("userEmail", user.email);

        // make sure the user type is saved in localStorage
        localStorage.setItem("userType", role);

        if( role === "Parent") {
          navigate("/");
        } else {
          navigate("/");
        }
      })
      .catch((error) => {
        console.error("❌ Error fetching user:", error);
        alert("Error fetching user");
      });
  }
  // Validate form data before submission
  const validateForm = async () => {
    const { email, password, name, class: userClass, role } = formData;
  // Check if all required fields are filled
    if (action === "Signup") {
      if (!email || !password || !name || !userClass) {
        alert("Please fill in all fields 📝")
        return false;
      }
      const userExists = await checkIfUserExists(email);
      if (userExists) {
        alert("User already exists. Please login instead.");
        return false;
      }
    }
    else if (action === "Login") {
      if (!email || !password||!role) {  
        alert("Please fill in all fields 📝");
        return false;
      }
  }
      return true;
}
  // Handle form submission with validation
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const isValid = await validateForm();
    if (isValid) {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-200 to-white-100 px-4">
      {action === "Login" ? (
        <LoginForm formData={formData} setFormData={setFormData} onSubmit={handleFormSubmit} />
      ) : (
        <SignupForm formData={formData} setFormData={setFormData} onSubmit={handleFormSubmit} />
      )}

      <div className="text-center text-sm text-black-100 mt-4">
        {action === "Login" ? (
          <p>
            Don't have an account?
            <span
              className="text-black font-semibold cursor-pointer underline ml-1"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </span>
          </p>
        ) : (
          <p>
            Already have an account?
            <span
              className="text-black font-semibold cursor-pointer underline ml-1"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginSignup;
