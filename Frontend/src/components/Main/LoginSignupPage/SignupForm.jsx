import React from 'react';
import LabeledInput from './LabelInput';
import SelectInput from './SelectInput';
import ButtonComponent from '../../Utils/Button';

// Importing icons for form inputs
import user_icon from '../../../assets/Images/LoginSignup/user.png';
import email_icon from '../../../assets/Images/LoginSignup/email.png';
import password_icon from '../../../assets/Images/LoginSignup/padlock.png';
import class_icon from '../../../assets/Images/LoginSignup/reading-book.png';

const SignupForm = ({ formData, setFormData, onSubmit }) => {
  return (
      // Card-like container for the signup form
    <div className="bg-blue-100 p-10 rounded-3xl shadow-xl w-full max-w-sm border-4 border-blue-300">
      <h2 className="text-3xl font-bold text-center text-blue-800">Join the Fun! ✨</h2>
      <div className="h-1 w-12 bg-blue-800 rounded-full mx-auto my-3"></div>
       {/* Input fields container */}
      <div className="flex flex-col gap-0.5">
        <LabeledInput
          label="Name"
          type="text"
          icon={user_icon}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
         {/* Email input */}
        <LabeledInput
          label="Email"
          type="email"
          icon={email_icon}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
         {/* Password input */}
        <LabeledInput
          label="Password"
          type="password"
          icon={password_icon}
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
           {/* Grade selection dropdown */}
        <SelectInput
          label="Select Your Grade 🎓"
          icon={class_icon}
          value={formData.class}
          onChange={(e) => setFormData({ ...formData, class: e.target.value })}
          options={[1, 2, 3, 4, 5, 6]}
        />
      </div>
      {/* Join Now button */}
      <div className="mt-6 flex justify-center">
        <ButtonComponent
          label="Join Now 🚀"
          bgColor="bg-gradient-to-r from-blue-500 to-blue-700"
          textColor="text-white"
          size="lg"
          onClick={onSubmit}
        />
      </div>
    </div>
  );
};

export default SignupForm;
