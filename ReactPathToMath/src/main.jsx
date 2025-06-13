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
import SubjectsPage from './components/Main/SubjectsPage/SubjectsPage.jsx'
import LevelsPage from './components/Main/LevelsPage/LevelsPage.jsx'
import OptionsGame from './components/Main/Games/OptionsGame/OptionsGame.jsx'
import GameCube from './components/Main/Games/DiceGame/GameCube.jsx'
import RaceGame from './components/Main/Games/RaceGame/RaceGame.jsx'
import VideoPage from './components/Main/VideoPage/VideoPage.jsx'
import Profile from './components/Main/ProfilePage/ProfilePage.jsx'
import RelevantVideo from './components/Main/VideoPage/RelevantVideo.jsx'
import ParentPage from './components/Main/ParentPage/ParentPage.jsx';
import LogoutPage from './components/Main/LoginSignupPage/Logout.jsx';
import WordGame from './components/Main/Games/WordGame/WordProblem.jsx';
import RocketGame from './components/Main/Games/RocketGame/RocketGame.jsx';
import PopQuiz from './components/Main/PopQuizPage/PopQuiz.jsx';
import BalloonsGame  from './components/Main/Games/BalloonsGame/BalloonsGame.jsx'
import RewardsPage from './components/Main/BadgesPage/RewardsPage';
import BattleRocketGame from './components/Main/Games/BattleRocketGame/BattleRocketGame.jsx'
import GameSelection from './components/Main/Games/GamesUtils/GameSelection.jsx'

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
      { path: '/subjects', element: <SubjectsPage />, },
      { path: '/subjects/:subjectGame', element: <LevelsPage />, },
      { path: '/game-selection/:subjectGame/:level', element: <GameSelection /> },
      { path: '/OptionsGame/:subjectGame/:grade/:level', element: <OptionsGame />, },
      { path: '/GameCube/:subjectGame/:grade/:level', element: <GameCube />, },
      { path: '/RaceGame/:subjectGame/:grade/:level', element: <RaceGame />, },
      { path: '/RocketGame/:subjectGame/:grade/:level', element: <RocketGame />, },
      { path: '/BattleRocketGame/:subjectGame/:grade/:level', element: <BattleRocketGame />, },
      { path: '/WordGame/:subjectGame/:grade/:level', element: <WordGame />, },
      { path: '/BalloonsGame/:subjectGame/:grade/:level', element: <BalloonsGame />, },
      { path: '/videos', element: <VideoPage />, },
      { path: '/videos/:subject', element: <RelevantVideo />, },
      { path: '/profile', element: <Profile />, },
      { path: '/ParentPage', element: <ParentPage />, },
      { path: '/badges', element: <RewardsPage />} ,
      { path: '/pop-quiz', element: <PopQuiz />, },
      { path: '/logout', element: <LogoutPage /> }
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
