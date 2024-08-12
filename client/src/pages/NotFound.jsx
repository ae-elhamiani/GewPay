import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowRight } from 'lucide-react';

const NotFound = () => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 px-4 py-12 sm:px-6 lg:px-8">
    <div className="max-w-md w-full space-y-8 text-center">
      <div>
        <h2 className="mt-6 text-6xl font-extrabold text-gray-900 animate-bounce">
          404
        </h2>
        <h2 className="mt-6 text-3xl font-bold text-gray-900">
          Page Not Found
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Oops! The page you're looking for doesn't exist.
        </p>
      </div>

      <div className="mt-8">
        <svg
          className="mx-auto h-40 w-auto text-purple-500 animate-pulse"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      <div className="mt-8 space-y-4">
        <Link
          to="/"
          className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-150 ease-in-out"
        >
          <Home className="mr-2 h-5 w-5" />
          Go back home
        </Link>
        <Link
          to="/contact"
          className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-lg shadow-sm text-purple-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-150 ease-in-out"
        >
          Contact support
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </div>

      <p className="mt-2 text-sm text-gray-500">
        If you believe this is a mistake, please{' '}
        <a href="mailto:support@gwepay.com" className="font-medium text-purple-600 hover:text-purple-500">
          contact our support team
        </a>
        .
      </p>
    </div>
  </div>
);

export default NotFound;