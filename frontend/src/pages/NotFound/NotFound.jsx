import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/Button/Button';

const NotFound = () => {
  return (
    <div className="h-screen w-full text-center px-4 md:px-8 py-6 flex flex-col justify-center items-center">
      <div className="max-w-screen-2xl mx-auto w-full flex flex-col justify-center items-center">
        <h1 className="text-5xl mb-5 font-bold">404 - Not Found</h1>
        <p className="text-lg mb-8">The page you are looking for does not exist.</p>
        <Link to="/dashboard">
          <Button>Go to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound; 