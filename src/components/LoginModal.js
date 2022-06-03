import Image from "../assets/running_bg.jpg";
import { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { getToken, login } from "../auth";

const LoginModal = ({
  loginClick,
  setLoginClick,
  registerClick,
  setRegisterClick,
  auth,
  setAuthentication,
  username,
  setUsername,
  token,
  setToken,
}) => {
  const { REACT_APP_FITNESS_TRACKER_API_URL } = process.env;
  const [password, setPassword] = useState();
  const [loginSuccessful, setLoginSuccessful] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  function authentication(event) {
    event.preventDefault();
    fetch(`${REACT_APP_FITNESS_TRACKER_API_URL}api/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then(
        (response) => response.json(),
      )

      .then((result) => {
        login(result.token);
        setToken(getToken());
        isLoggedIn(result);
      })
      .then(setModalIsOpen(false))
      .catch(
        setModalIsOpen(true),
        console.error);

  }

  const isLoggedIn = (result) => {
    if (result) {
      setAuthentication(true);
      setLoginSuccessful(true);
      //Need something cleaner than alerts
      alert(result.message);
    } else {
      setModalIsOpen(true)
      alert(result.error.message);
    }
  };

  if (loginSuccessful && auth) {
    return <Redirect to="/myroutines" />;
  }

  window.addEventListener("click", (e) => {
    if (e.target === document.getElementById("login-modal")) {
      setLoginClick(!loginClick);
    }
  });

  const handleClick = () => {
    setLoginClick(!loginClick);
    setRegisterClick(!registerClick);
  };

  const close_btn = () => setLoginClick(!loginClick);

  return (
    <>
      <div className={loginClick ? "modal-open" : "modal"} id="login-modal">
        <div className="modal-content">
          <span onClick={close_btn} className="close-btn">
            &times;
          </span>
          <div className="modal-content-left">
            <img src={Image} alt="Work Out" id="modal-img" />
          </div>
          <div className="modal-content-right">
            <form
              action="/"
              method="GET"
              className="modal-form"
              id="form"
              onSubmit={authentication}
            >
              <h1>Take the First Step!</h1>
              <div className="form-validation">
                <input
                  type="text"
                  className="modal-input"
                  id="username"
                  name="username"
                  placeholder="Create a Username"
                  onChange={(event) => {
                    setUsername(event.target.value);
                  }}
                />
              </div>
              <div className="form-validation">
                <input
                  type="password"
                  className="modal-input"
                  id="password"
                  name="password"
                  placeholder="Create a Password"
                  onChange={(event) => {
                    setPassword(event.target.value);
                  }}
                />
              </div>
              <input
                type="submit"
                onClick={close_btn}
                className="modal-input-btn"
                value="Login"
              />
              <span className="modal-input-login">
                Don't have an account? Sign Up{" "}
                <Link
                  onClick={handleClick}
                  style={{
                    textDecoration: "none",
                    color: "var(--brightorange)",
                    fontSize: "600",
                  }}
                  to="/register"
                >
                  here
                </Link>
              </span>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginModal;
