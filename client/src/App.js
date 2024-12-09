import React, { lazy, Suspense, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { logout } from './store/authSlice';
import store from './store';
import { Provider } from 'react-redux';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Loader from './components/Loader/Loader';
import Home from './pages/Home';
import Signup from './pages/Signup/Signup';
import Login from './pages/Login/Login';
import Profile from './pages/Profile/Profile';
import RecipeDetails from './pages/RecipeDetails/RecipeDetails';
import RecipesByCategory from './pages/RecipesByCategory/RecipesByCategory';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

const Recipes = lazy(() => import('./pages/Recipes/Recipes'));

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('access_token');

    if (token) {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 <= Date.now()) {
        dispatch(logout());
      }
    }
  }, [dispatch]);

  return (
    <div className="App">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/recipes/:id" element={<RecipeDetails />} />
          <Route path="/recipes/category/:categoryId" element={<RecipesByCategory />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function WrappedApp() {
  return (
    <Provider store={store}>
      <Router>
      <Suspense fallback={<Loader />}>
        <App />
      </Suspense>
      </Router>
    </Provider>
  );
}
