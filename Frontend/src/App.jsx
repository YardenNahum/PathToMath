import React from 'react';
import './App.css';
import Header from './components/header/header';
import { GradeProvider } from './components/Utils/GradeComponent';
import { LoginStatusProvider } from './components/Utils/LoginStatusComponent';
import Footer from './components/footer/footer';
import { Outlet } from 'react-router-dom'
import { UserProvider } from './components/Utils/UserContext';

function App() {
  return (
    <LoginStatusProvider>
      <UserProvider>
        <GradeProvider>
          <div className="flex min-h-screen flex-col relative">
            {/* Header - Fixed position at top */}
            <header className="sticky top-0 z-100 w-full bg-white">
              <Header />
            </header>

            <Outlet className="flex-grow w-full" />

            {/* Footer */}
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