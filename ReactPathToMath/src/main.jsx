import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

/**
 * Pages
 */
import HomePage from './components/Main/HomePage/HomePage.jsx'
import LoginSignup from './components/Main/LoginSignupPage/LoginSignup.jsx'
import Subjects from './components/Main/SubjectsPage/SubjectsPage.jsx'
import Levels from './components/Main/LevelsPage/LevelsPage.jsx'
import Game from './components/Main/Games/CubeGame.jsx'
import VideoPage from './components/Main/VideoPage/VideoPage.jsx'
import Profile from './components/Main/ProfilePage/ProfilePage.jsx'
import RelevantVideo from './components/Main/VideoPage/RelevantVideo.jsx'

/**
 * Router for the app
 */
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <HomePage />, },
      { path: '/login', element: <LoginSignup action="Login" />, },
      { path: '/signup', element: <LoginSignup action="Signup" />, },
      { path: '/subjects', element: <Subjects />, },
      { path: '/levels', element: <Levels />, },
      { path: '/games', element: <Game gameSubject="Addition" gameLevel="1" />, },
      { path: '/videos', element: <VideoPage />, },
      { path: '/videos/:subject', element: <RelevantVideo />, },
      { path: '/profile', element: <Profile />, },
    ],
  },
])

/**
 * Render the app
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
