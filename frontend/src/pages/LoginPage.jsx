import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import image from '../assets/register-background.jpg'
import { jwtDecode } from "jwt-decode";
import { login } from "../service/authenticationService.js";
import { LoggedUserContext } from "../context/LoggedUserContext.jsx";

const LoginPage = () => {
  let navigate = useNavigate();
  const { setTokenFromLogin } = useContext(LoggedUserContext);

  const [loginCredentials, setLoginCredentials] = useState({
    username: "",
    password: ""
  });

  const [error, setError] = useState("");

  const pages = {
    "ADMIN": "/admin",
    "TEAM_REPRESENTATIVE": "/team-representative",
    "TOURNAMENT_ORGANIZER": "/tournament-organizer",
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const userData = await login(loginCredentials);
      console.log("userData - ", userData);
      if (userData.data.accessToken) {
        localStorage.setItem('token', userData.data.accessToken);
        localStorage.setItem('refreshToken', userData.data.refreshToken.token);
        setTokenFromLogin(userData.data.accessToken);
        const decodedToken = jwtDecode(userData.data.accessToken);
        const loggedUserRole = decodedToken.role;
        navigate(pages[loggedUserRole]);
      } else {
        setError(userData.message);
      }
    } catch (error) {
        setError(error.message);
    }
  };

  const handleChange = (e) => {
    setLoginCredentials(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  };

  return(
    <section className="min-h-screen flex
    items-center justify-center font-mono
    bg-gradient-to-r from-[#262626] from-60%
    via-gray-400">

      <div className="flex shadow-2xl">
        <div className="flex flex-col bg-[#F7F7F7] items-center jusitfy-center text-center p-20 gap-8 rounded-2xl
        lg:rounded-tr-none lg:rounded-br-none">
          <h1 className="text-5xl font-bold">Login</h1>

          <form onSubmit={handleLogin}>
          
            <div className="flex flex-col text-xl text-left gap-1">
              <span>Username</span>
              <input 
                type="text" 
                className="rounded-md p-1 border-2 outline-none focus:border-black focus:bg-slate-50 text-md"
                name="username"
                value={loginCredentials.username}
                onChange={handleChange}
                required
                />
            </div>

            <div className="flex flex-col text-xl text-left gap-1">
              <span>Password</span>
              <input 
                type="password" 
                className="rounded-md p-1 border-2 outline-none focus:border-black focus:bg-slate-50"
                name="password"
                value={loginCredentials.password}
                onChange={handleChange}
                autoComplete="off"
                required
                />
            </div>

            <div className="text-red-600 mt-3">{error}</div>

            <button className="px-10 py-2 text-2xl rounded-md bg-gradient-to-tr bg-blue-500 mt-4
            text-white hover:px-11 hover:py-2.5">Login</button>

            <div className="py-2">
              <span><a href="/signup" className="cursor-pointer hover:underline hover:text-blue-500">Don't have an account? Sign up</a></span>
            </div>
          </form>

          <div className="py-2">
            <span><a href="/home" className="cursor-pointer hover:underline hover:text-blue-500">Back to homepage</a></span>
          </div>

        </div>
        <img className="w-[450px] object-cover md:rounded-tr-2xl md:rounded-br-2xl lg:block hidden" src={image} alt="" />
      </div>
    </section>
  );
};
export default LoginPage;