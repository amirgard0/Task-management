import React from 'react';
import { Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';

const ProtectedRoute: React.FC = () => {
    const accessToken = Cookies.get('access_token');
    return accessToken ? <Outlet /> : 
      <div className="flex flex-col items-center justify-center min-h-screen lg:px-0 md:px-5 px-10" id="main">
        <div className="bg-[#5c5e64] px-5 py-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="text-center mb-3 w-full">
            <h1 className="text-3xl font-bold text-gray-100 mb-1">Welcome to Garder</h1>
            <p className="text-gray-200">Please sign in to access your tasks and projects</p>
          </div>
          <div className="space-y-4 w-full px-">
            <Link 
              to="/login" 
              className="flex items-center justify-center w-full py-3 px-4 bg-[#FF570C] text-white rounded-md hover:bg-orange-600 transition-colors duration-200"
            >
              <i className="fa fa-sign-in mr-2"></i>
              Sign In
            </Link>
            <Link 
              to="/register" 
              className="flex items-center justify-center w-full py-3 px-4 border-2 border-[#FF570C] text-[#FF570C] rounded-md hover:bg-orange-50 transition-colors duration-200"
            >
              <i className="fa fa-user-plus mr-2"></i>
              Create Account
            </Link>
          </div>
        </div>
      </div>
    ;
};

export default ProtectedRoute;