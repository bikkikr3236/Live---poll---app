import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import IntervuePollButton from '../components/IntervuePollButton';

export default function MainPage() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);

  const handleContinue = () => {
    if (selectedRole === 'teacher') navigate('/teacher');
    else if (selectedRole === 'student') navigate('/student');
  };

  const roles = [
    {
      label: "I'm a Teacher",
      value: 'teacher',
      description: 'Manage and conduct live polls for your class.',
    },
    {
      label: "I'm a Student",
      value: 'student',
      description: 'Submit answers and view live poll results in real-time.',
    },
  ];

  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4'>
      <div className='text-center mb-8'>
        <div className='text-center flex justify-center'>
          <IntervuePollButton />
        </div>
        <h1 className='text-3xl font-semibold mb-2'>
          Welcome to the <strong>Live Polling System</strong>
        </h1>
        <p className='text-gray-600'>
          Please select the role that best describes you to begin.
        </p>
      </div>

      <div className='flex flex-col sm:flex-row gap-6 mb-6'>
        {roles.map((role) => (
          <button
            key={role.value}
            onClick={() => setSelectedRole(role.value)}
            className={`w-64 text-left p-5 rounded-xl border-2 bg-white shadow-sm transition-all duration-200 ${
              selectedRole === role.value
                ? 'border-primary'
                : 'hover:border-blue-300'
            }`}
          >
            <h2 className='text-lg font-semibold mb-1'>{role.label}</h2>
            <p className='text-gray-500 text-sm'>{role.description}</p>
          </button>
        ))}
      </div>

      <button
        disabled={!selectedRole}
        onClick={handleContinue}
        className={`px-6 py-3 rounded-full shadow transition
    ${
      selectedRole
        ? 'bg-primary text-white hover:bg-gray-900'
        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
    }`}
      >
        Continue
      </button>
    </div>
  );
}
