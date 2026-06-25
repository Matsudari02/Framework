import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import AnimeDetails from './pages/AnimeDetails';
import Search from './pages/Search';
import Auth from './pages/Auth';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile'; // novo
import ProtectedRoute from './components/ProtectedRoute';

const router = createBrowserRouter(
  [
    { path: '/', element: <Layout><Home /></Layout> },
    { path: '/anime/:id', element: <Layout><AnimeDetails /></Layout> },
    { path: '/search', element: <Layout><Search /></Layout> },
    { path: '/auth', element: <Layout><Auth /></Layout> },
    {
      path: '/favorites',
      element: (
        <ProtectedRoute>
          <Layout><Favorites /></Layout>
        </ProtectedRoute>
      ),
    },
    {
      path: '/profile',
      element: (
        <ProtectedRoute>
          <Layout><Profile /></Layout>
        </ProtectedRoute>
      ),
    }
  ],
  {
    future: {
      v7_startTransition: true,
    },
  }
);

export default router;