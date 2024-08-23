import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ReactGA from "react-ga4";

import { routes } from "./routes";
//util function
import { getEnvVariable } from "@utils/getEnvVariable";
import { useDispatch, useSelector } from "react-redux";
import { logout, setUserData } from "@features/authSlice";

const GA_ID = getEnvVariable("VITE_GOOGLE_ANALYTICS_ID");

const AppRouter = () => {
  ReactGA.initialize(GA_ID);
  const dispatch = useDispatch()
  const authStatus = useSelector((state) => state.auth.status);


  useEffect(() => {
    if(authStatus === "idle"){
      dispatch(setUserData())
    } if(authStatus === "failed"){
      dispatch(logout())
    }
  }, [authStatus]);

  return (
    <Router>
      <Routes>
        {routes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Routes>
    </Router>
  );
};

export default AppRouter;
