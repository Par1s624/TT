import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom';

import Login from './pages/login/index.jsx';
import Signup from './pages/signup/index.jsx';
import Dashboard from './pages/dashboard/index.jsx';
import GamePage from './pages/game/index.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/game/:game_id',
    element: <GamePage />
  }
]);

createRoot(document.getElementById('root')).render(
  <RouterProvider router ={router}/>
)
