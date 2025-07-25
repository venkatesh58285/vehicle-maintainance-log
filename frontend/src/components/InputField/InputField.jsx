import React from 'react';

const InputField = ({ label, name, type = 'text', register, error }) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block mb-1 text-sky-300 font-medium">
        {label}
      </label>
      <input
        id={name}
        type={type}
        {...register(name)}
        className={`w-full px-3 py-2 rounded border bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-300 transition-colors duration-200 ${error ? 'border-red-500' : 'border-gray-700'}`}
      />
      {error && (
        <p className="text-red-500 text-xs mt-1">{error.message}</p>
      )}
    </div>
  );
};

export default InputField; 