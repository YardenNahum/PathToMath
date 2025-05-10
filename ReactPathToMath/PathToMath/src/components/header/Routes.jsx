import HomePage from '../pages/HomePage';
import MathSubjectsPage from '../pages/MathSubjectsPage';
import ProfilePage from '../pages/ProfilePage';
import LoginPage from '../pages/LoginPage';
import LogoutPage from '../pages/LogoutPage';
import VideosPage from '../pages/VideosPage/VideoMainPage';
import AdditionPage from '../pages/subjects/AdditionPage';
import SubtractionPage from '../pages/subjects/SubtractionPage';
import MultiplyPage from '../pages/subjects/MultiplyPage';
import DivisionPage from '../pages/subjects/DivisionPage';
import PercentagePage from '../pages/subjects/PercentagePage';


const routes = [
    {
        path: '/',
        element: <HomePage />,
        label: 'Home',
        colorClass: "bg-blue-700 hover:bg-blue-600",
        submenuColor: "hover:bg-blue-500",
    },
    {
        path: '/math-subjects',
        element: <MathSubjectsPage />,
        label: 'Math Problems',
        colorClass: "bg-orange-500 hover:bg-orange-600",
        submenuColor: "hover:bg-orange-400",
        submenu: [
            { path: '/math-subjects/addition', element: <AdditionPage />, label: 'Addition' },
            { path: '/math-subjects/subtraction', element: <SubtractionPage />, label: 'Subtraction' },
            { path: '/math-subjects/multiply', element: <MultiplyPage />, label: 'Multiply' },
            { path: '/math-subjects/division', element: <DivisionPage />, label: 'Division' },
            { path: '/math-subjects/percentage', element: <PercentagePage />, label: 'Percentage' }
        ]
    },
    {
        path: '/videos',
        element: <VideosPage />,
        label: 'Tutorial Videos',
        colorClass: "bg-red-500 hover:bg-red-600",
        submenuColor: "hover:bg-red-400",
        submenu: [
            { path: '/videos/addition', element: <AdditionPage />, label: 'Addition Videos' },
            { path: '/videos/subtraction', element: <SubtractionPage />, label: 'Subtraction Videos' },
            { path: '/videos/multiply', element: <MultiplyPage />, label: 'Multiply Videos' },
            { path: '/videos/division', element: <DivisionPage />, label: 'Division Videos' },
            { path: '/videos/percentage', element: <PercentagePage />, label: 'Percentage Videos' }
        ]
    },
    {
        path: '/profile',
        element: <ProfilePage />,
        label: 'Profile',
        colorClass: "bg-green-500 hover:bg-green-600",
        submenuColor: "hover:bg-green-400",
    },
    {
        path: '/login',
        element: <LoginPage />,
        colorClass: 'bg-purple-500 hover:bg-purple-600',
        label: 'Login',
    },
    {
        path: '/logout',
        element: <LogoutPage />,
        colorClass: 'bg-purple-500 hover:bg-purple-600',
        label: 'Logout',
    }
];

export default Routes;
