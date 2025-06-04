import React, { useContext, useState } from "react";
import UserService from "../service/UserService.js";
import { useNavigate } from "react-router-dom";
import image from '../assets/register-background.jpg'
import { jwtDecode } from "jwt-decode";
import { LoggedUserContext } from "../context/LoggedUserContext.jsx";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  let navigate = useNavigate();

  const { setTokenFromLogin } = useContext(LoggedUserContext);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const userData = await UserService.login(email, password);
      if (userData.accessToken) {
        localStorage.setItem('token', userData.accessToken);
        localStorage.setItem('refreshToken', userData.refreshToken.token);

        setTokenFromLogin(userData.accessToken);

        const decodedToken = jwtDecode(userData.accessToken);
        const loggedUserRole = decodedToken.role;

        if(loggedUserRole === 'ADMIN') {
          navigate('/admin');  
        } else if (loggedUserRole === 'TEAM_REPRESENTATIVE') {
          navigate('/representative');
        } else if (loggedUserRole === 'TOURNAMENT_ORGANIZER') {
          navigate('/organizer');
        } else if (loggedUserRole === 'USER') {
          navigate('/user')
        }
      } else {
        setError(userData.message);
      }
    } catch (error) {
        console.log(error);
        setError(error.message);
        /* setTimeout(() => setError(''), 10000); */
    }
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
              <span>Email</span>
              <input 
                type="email" 
                className="rounded-md p-1 border-2 outline-none focus:border-black focus:bg-slate-50 text-md"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                />
            </div>

            <div className="flex flex-col text-xl text-left gap-1">
              <span>Password</span>
              <input 
                type="password" 
                className="rounded-md p-1 border-2 outline-none focus:border-black focus:bg-slate-50"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="off"
                required
                />
            </div>

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