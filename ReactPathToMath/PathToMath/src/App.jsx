import React from 'react'
import './App.css'
import { useState } from 'react'
import Header from './components/header/header'
import { GradeProvider } from './components/Main/GradeComponent'
import { LoginStatusProvider } from "./components/Main/LoginStatusComponent"
import Footer from './components/footer/Footer'
import VideoMainPage from './components/pages/VideosPage/VideoMainPage';
import RelevantVideo from './components/pages/VideosPage/RelevantVideo '
function App() {

  return (
    <LoginStatusProvider>
    <GradeProvider>
    <div className="app">
      <Header/>
      <RelevantVideo/>
      <Footer/>
    </div>
    </GradeProvider>
    </LoginStatusProvider>
  )
}
export default App