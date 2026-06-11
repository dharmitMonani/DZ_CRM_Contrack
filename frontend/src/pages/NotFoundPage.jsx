import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center p-4 transition-colors duration-300">
    <div className="text-center">
      <p className="text-7xl font-black text-gray-200 dark:text-slate-800 mb-4 transition-colors">404</p>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-2">Page Not Found</h1>
      <p className="text-gray-500 dark:text-slate-400 mb-6">The page you're looking for doesn't exist.</p>
      <Link to="/dashboard" className="btn-primary">
        Go to Dashboard
      </Link>
    </div>
  </div>
);

export default NotFoundPage;
