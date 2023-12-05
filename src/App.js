import React, { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Route, Routes } from "react-router-dom";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Home from "./pages/home/Home";
import NotFound from "./pages/404/NotFound";
import Login from "./pages/auth/login/Login";
import Register from "./pages/auth/register/Register";
import Reset from "./pages/auth/reset/Reset";
import Admin from "./pages/admin/Admin";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  SET_LOGIN,
  getLoginStatus,
  getUser,
} from "./redux/features/auth/authSlice";
axios.defaults.withCredentials = true;

const App = () => {
  const dispatch = useDispatch();
  const { user, isLoggedIn } = useSelector((state) => state.auth);
  useEffect(() => {
    async function loginStatus() {
      const status = await dispatch(getLoginStatus());
      await dispatch(SET_LOGIN(status.payload));
    }
    loginStatus();
  }, [dispatch]);
  useEffect(() => {
    if (isLoggedIn && user === null) {
      dispatch(getUser());
    }
  }, [dispatch, isLoggedIn, user]);
  return (
    <>
      <ToastContainer />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset" element={<Reset />} />
        <Route path="/admin/*" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
