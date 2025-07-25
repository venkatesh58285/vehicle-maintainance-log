import React, { useState, useEffect } from 'react';

const Toast = ({ message, type, onDone }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        if (onDone) {
          onDone();
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, onDone]);

  if (!visible) return null;

  const typeBorder = {
    success: 'border-l-green-600',
    error: 'border-l-red-500',
    info: 'border-l-sky-300',
  };

  return (
    <div
      className={`fixed top-5 right-5 px-4 py-3 rounded min-w-[250px] text-center text-gray-100 z-[1000] bg-gray-800 border-l-8 ${typeBorder[type] || 'border-l-sky-300'}`}
    >
      {message}
    </div>
  );
};

export default Toast; 