/**
 * Entry point for the React application.
 * 
 * - Imports necessary dependencies including React, ReactDOM, main App component, 
 * global CSS, and Toaster for notifications.
 * - Renders the App component inside a React.StrictMode wrapper for highlighting 
 * potential problems.
 * - Toaster is included to display toast notifications at the bottom-center of 
 * the screen.
 * 
 * This file is useful for understanding how the application is bootstrapped and 
 * how global providers (like Toaster) are integrated.
 */
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { Toaster } from 'react-hot-toast';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <>
      <App />
      <Toaster position="top-center"
        // reverseOrder={false}
         />

    </>
  </React.StrictMode>
)
