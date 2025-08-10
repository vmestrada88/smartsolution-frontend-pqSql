
import React from 'react';

const Unauthorized = () => {
  return (
    <div className="text-center mt-10">
      <h1 className="text-3xl font-bold text-red-600">Access Denied</h1>
      <p className="mt-4 text-gray-700">You do not have permission to view this page.</p>
    </div>
  );
};

export default Unauthorized;
