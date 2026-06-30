import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import PageWrapper from '@components/layout/PageWrapper';
import Spinner from '@components/ui/Spinner';

import Home from '@pages/Home';
import MyFridge from '@pages/MyFridge';
import RecipeDetail from '@pages/RecipeDetail';
import SavedRecipes from '@pages/SavedRecipes';
import ShoppingList from '@pages/ShoppingList';
import Login from '@pages/Login';
import Register from '@pages/Register';
import NotFound from '@pages/NotFound';

function FullScreenLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream-50">
      <Spinner size={40} />
    </div>
  );
}

// Wraps routes that require authentication.
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <FullScreenLoader />;
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return children;
}

// Redirects logged-in users away from auth pages.
function PublicOnlyRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <FullScreenLoader />;
  if (isAuthenticated) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      {/* Auth pages (no app shell) */}
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicOnlyRoute>
            <Register />
          </PublicOnlyRoute>
        }
      />

      {/* App pages (wrapped in navbar shell) */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <PageWrapper>
              <Home />
            </PageWrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/fridge"
        element={
          <ProtectedRoute>
            <PageWrapper>
              <MyFridge />
            </PageWrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/recipe/:id"
        element={
          <ProtectedRoute>
            <PageWrapper>
              <RecipeDetail />
            </PageWrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/saved"
        element={
          <ProtectedRoute>
            <PageWrapper>
              <SavedRecipes />
            </PageWrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/shopping-list"
        element={
          <ProtectedRoute>
            <PageWrapper>
              <ShoppingList />
            </PageWrapper>
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route
        path="*"
        element={
          <PageWrapper>
            <NotFound />
          </PageWrapper>
        }
      />
    </Routes>
  );
}
