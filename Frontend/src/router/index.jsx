import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import ReactGA from 'react-ga4';
import { routes } from './routes';
import { login, logout } from '@features/authSlice';

const AppRouter = ()  => {
  ReactGA.initialize('G-6PDH48B4F8');
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  console.log('ius', isAuthenticated)

  const getUser = async () => {
    try {
      // Uncomment for production
      // const url = "https://www.kaabil.me/api/auth/login/sucess";

      // Uncomment for local development
      const url = "http://localhost:3000/api/auth/login/sucess";
      const { data } = await axios.get(url, { withCredentials: true });
      dispatch(login(data.user)); // Update the Redux store with user data
    } catch (err) {
      console.error("Error fetching user data:", err);
      dispatch(logout()); // Log out the user on error
    }
  };

  useEffect(() => {
    getUser();
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        {routes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={route.element}
          />
        ))}
      </Routes>
    </Router>
  );
}

export default AppRouter;
