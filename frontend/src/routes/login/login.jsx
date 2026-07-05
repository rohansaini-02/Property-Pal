import "./login.scss";
import { Link } from "react-router-dom";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";

function Login() {
  const [isLoginView, setIsLoginView] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [IsLoading, setIsLoading] = useState(false);
  const { updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");
    const formData = new FormData(e.target);

    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      if (isLoginView) {
        const res = await apiRequest.post("auth/login", {
          username,
          password,
        });
        updateUser(res.data);
        navigate("/");
      } else {
        await apiRequest.post("auth/register", {
          username,
          email,
          password,
        });
        setSuccess("Registration successful! Please login below.");
        setIsLoginView(true);
      }
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <div className="logoHeader">
            <img src="/re-logo-design_731343-252.avif" alt="PropertyPal logo" />
            <span>PropertyPal</span>
          </div>

          {isLoginView ? (
            <>
              <h2>Welcome back</h2>
              <p className="subtitle">
                Let's find the place where your future begins and lifetime memories are made.
              </p>
            </>
          ) : (
            <>
              <h2>Create an Account</h2>
              <p className="subtitle">
                Start your journey. Find, buy, or rent your dream home directly from owners.
              </p>
            </>
          )}

          {success && <span className="successMsg">{success}</span>}

          <input
            name="username"
            required
            minLength={3}
            maxLength={isLoginView ? 100 : 20}
            type="text"
            placeholder={isLoginView ? "Username or Email" : "Username"}
          />

          {!isLoginView && (
            <input
              name="email"
              required
              type="email"
              placeholder="Email"
            />
          )}

          <div className="passwordWrapper">
            <input
              name="password"
              required
              type={showPassword ? "text" : "password"}
              placeholder="Password"
            />
            <button
              type="button"
              className="passwordToggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="eyeIcon"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="eyeIcon"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              )}
            </button>
          </div>

          <button disabled={IsLoading} type="submit">
            {IsLoading ? "Loading..." : isLoginView ? "Login" : "Register"}
          </button>

          {error && <span className="errorMsg">{error}</span>}

          {isLoginView ? (
            <Link
              to=""
              onClick={(e) => {
                e.preventDefault();
                setIsLoginView(false);
                setError("");
                setSuccess("");
              }}
            >
              {"Don't"} you have an account? Sign Up
            </Link>
          ) : (
            <Link
              to=""
              onClick={(e) => {
                e.preventDefault();
                setIsLoginView(true);
                setError("");
                setSuccess("");
              }}
            >
              Do you have an account? Login
            </Link>
          )}
        </form>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default Login;
