import React from 'react';
import './App.css';
import Header from './components/header/header';
import { GradeProvider } from './components/Utils/GradeComponent';
import { LoginStatusProvider } from './components/Utils/LoginStatusComponent';
import Footer from './components/footer/footer';
import { Outlet } from 'react-router-dom'
import { UserProvider } from './components/Utils/UserContext';

/**
 * App component renders the main application layout.
 * 
 * @returns {React.ReactNode} The rendered App component
 */
function App() {
  return (
    // Global context for login status
    <LoginStatusProvider>
      {/* Global context for user data (e.g., name, grade, progress) */}
      <UserProvider>
        {/* Global context for selected grade level across the app */}
        <GradeProvider>
          <div className="flex min-h-screen flex-col relative">
            {/* Header - remains fixed at the top of the page */}
            <header className="sticky top-0 z-100 w-full bg-white">
              <Header />
            </header>

            {/* Main content rendered based on the current route */}
            <Outlet className="flex-grow w-full" />

            {/* Footer - displayed at the bottom of the page */}
            <footer className="w-full bg-white ">
              <Footer />
            </footer>

          </div>
        </GradeProvider>
      </UserProvider>
    </LoginStatusProvider>
  );
}

export default App;