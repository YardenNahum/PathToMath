import React, { useState } from 'react';
import LabeledInput from './LabelInput';
import ButtonComponent from '../../Utils/Button';
import kids_icon from '../../../assets/Images/LoginSignup/kids.png';
import parents_icon from '../../../assets/Images/LoginSignup/parents.png';
import email_icon from '../../../assets/Images/LoginSignup/email.png';
import password_icon from '../../../assets/Images/LoginSignup/padlock.png';

/**
 * LoginForm component renders a styled login form with inputs for email and password,
 * as well as a role selector (child or parent). It uses LabeledInput and ButtonComponent.
 *
 * @param {Object} props
 * @param {Object} props.formData - The current state of form data (email, password, role).
 * @param {function} props.setFormData - Function to update the form data state.
 * @param {function} props.onSubmit - Function to handle form submission.
 * @returns {JSX.Element} Rendered login form component.
 */
const LoginForm = ({ formData, setFormData, onSubmit }) => {

  return (
    <div className="bg-blue-100 p-10 rounded-3xl shadow-xl w-full max-w-sm border-4 border-blue-300">
      {/* Title */}
      <h2 className="text-3xl font-bold text-center text-blue-800">Welcome Back! 🎉</h2>
      <div className="h-1 w-12 bg-blue-800 rounded-full mx-auto my-3"></div>

      {/* Email and Password Inputs */}
      <div className="flex flex-col gap-0.4">
        <LabeledInput
          label="Email"
          type="email"
          icon={email_icon}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <LabeledInput
          label="Password"
          type="password"
          icon={password_icon}
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
      </div>

      {/* Role Selector (Child or Parent) */}
      <div className="flex justify-center gap-3 my-4">
        {[
          { label: "Child", value: "Student", icon: kids_icon },
          { label: "Parent", value: "Parent", icon: parents_icon }
        ].map((role) => (
          <label
            key={role.value}
            className={`flex flex-col items-center p-3 rounded-2xl cursor-pointer shadow-md border-2 transition-all duration-300
                ${formData.role === role.value
                ? "border-blue-500 bg-blue-100"
                : "border-transparent hover:border-blue-300"}`}
          >
            {/* Hidden radio input for role selection */}
            <input
              type="radio"
              name="role"
              value={role.value}
              checked={formData.role === role.value}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="hidden"
            />
            <img src={role.icon} alt={role.label} className="w-12 h-12 mb-1" />
            <span className="text-sm font-semibold text-blue-800">{role.label}</span>
          </label>
        ))}
      </div>

      {/* Submit Button */}
      <div className="flex justify-center">
        <ButtonComponent
          label="LOGIN 🚀"
          bgColor="bg-gradient-to-r from-blue-500 to-blue-700"
          textColor="text-white"
          size="lg"
          onClick={onSubmit}
        />
      </div>
    </div>
  );
};

export default LoginForm;
