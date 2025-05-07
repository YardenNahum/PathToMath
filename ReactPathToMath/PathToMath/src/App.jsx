import React from 'react'
import './App.css'
import { useState } from 'react'
import Header from './components/header/header'
import { GradeProvider } from './components/Main/GradeComponent'
import { LoginStatusProvider } from "./components/Main/LoginStatusComponent"
import Footer from './components/footer/Footer'
function App() {

  return (
    <LoginStatusProvider>
    <GradeProvider>
    <div className="app">
      <Header/>
      <Footer/>
    </div>
    </GradeProvider>
    </LoginStatusProvider>
  )
}
export default App