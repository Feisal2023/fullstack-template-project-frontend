import React, { useEffect, useState } from "react";
import styles from "../auth.module.scss";
import loginImg from "../../../assets/login.png";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import Card from "../../../components/card/Card";
import { useDispatch, useSelector } from "react-redux";
import {
  GoogleAuthProvider,
  isSignInWithEmailLink,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  signInWithPopup,
} from "firebase/auth";
import { toast } from "react-toastify";
import { auth } from "../../../firebase/config";
import { RESET, logInWithGoogle } from "../../../redux/features/auth/authSlice";
import Loader from "../../../components/loader/Loader";

const Login = () => {
  const [email, setEmail] = useState("");
  const [useParams] = useSearchParams();
  const method = useParams.get("method");
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, isLoggedIn, isSuccess, message, isError } = useSelector(
    (state) => state.auth
  );
  useEffect(() => {
    if (isSuccess && isLoggedIn) {
      navigate("/admin/home");
    }
    dispatch(RESET());
  }, [isLoggedIn, isSuccess, dispatch, navigate]);
  const provider = new GoogleAuthProvider();
  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        toast.success("Successfully lognin");
        console.log(user);
        dispatch(logInWithGoogle({ userToken: user.accessToken }));
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.message);
      });
  };
  const handleLogin = (e) => {
    e.preventDefault();
    sendSignInLinkToEmail(auth, email, {
      url: `${process.env.REACT_APP_FRONTEND_URL}/login?method=emailLink`,
      handleCodeInApp: true,
    })
      .then(() => {
        window.localStorage.setItem("emailForSignIn", email);
        toast.success("Sign in link has been sent to your email");
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.message);
      });
  };
  useEffect(() => {
    if (!isLoggedIn && method === "emailLink") {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        let email = localStorage.getItem("emailForSignIn");
        if (!email) {
          toast.error("Please provide your email");
          return;
        }

        signInWithEmailLink(
          auth,
          localStorage.getItem("emailForSignIn"),
          window.location.href
        )
          .then((result) => {
            const user = result.user;
            dispatch(logInWithGoogle({ userToken: user.accessToken }));
            console.log(user);
            localStorage.removeItem("emailForSignIn");
          })
          .catch((error) => {
            console.log(error.message);
            toast.error(error.message);
          });
      }
    }
  }, [method, isLoggedIn, dispatch]);
  return (
    <>
      {isLoading && <Loader />}
      <section className={`container ${styles.auth}`}>
        <div className={styles.img}>
          <img src={loginImg} alt="Login" width="400" />
        </div>
        <Card>
          <div className={styles.form}>
            <h2>Login</h2>
            <button
              className="--btn --btn-danger --btn-block"
              onClick={signInWithGoogle}
            >
              <FaGoogle color="#fff" /> Login With Google
            </button>
            <p className="--my --center-all"> Or get a Login Link </p>
            <form onSubmit={handleLogin}>
              <input
                type="text"
                placeholder="Email"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit" className="--btn --btn-primary --btn-block">
                Send Login Link
              </button>
            </form>
          </div>
        </Card>
      </section>
    </>
  );
};

export default Login;
