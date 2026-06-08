import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div className="text-center">
      <p className="text-7xl font-black text-gray-200 mb-4">404</p>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
      <p className="text-gray-500 mb-6">The page you're looking for doesn't exist.</p>
      <Link to="/dashboard" className="btn-primary">
        Go to Dashboard
      </Link>
    </div>
  </div>
);

export default NotFoundPage;
