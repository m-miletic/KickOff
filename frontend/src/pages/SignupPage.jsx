import React, { useEffect, useRef, useState } from "react";
import image from '../assets/register-background.jpg'
import { register } from "../service/authenticationService";
import { roles } from "../data/rolesForSignup";
import { toast } from "react-toastify";
const MAX_MOBILE_SCREEN_WIDTH = 1028;

const SignupPage = () => {

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    repeatPassword: "",
    role: "",
  });

  const [error, setError] = useState("")
  const [isMobile, setIsMobile] = useState(window.innerWidth <= MAX_MOBILE_SCREEN_WIDTH);
  const prevWidth = useRef(window.innerWidth);// useRef za razliku ode useState-a ne triggera re-render

  useEffect(() => {
    const handleResize = () => {
      const currWidth = window.innerWidth; 
      // zasto je prevWidth objekt koji ima property "current" - zbog useRef-a, vidit kako tocno funkcionira useRef
      if (currWidth <= MAX_MOBILE_SCREEN_WIDTH && prevWidth.current > MAX_MOBILE_SCREEN_WIDTH) {
        setIsMobile(true);
      } else if (currWidth > MAX_MOBILE_SCREEN_WIDTH && prevWidth.current <= MAX_MOBILE_SCREEN_WIDTH) {
        setIsMobile(false);
      }
      prevWidth.current = currWidth;
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [])

  const handleInputChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  }

  const handleRegistration = async (e) => {
    e.preventDefault()
    try {
      const response = await register(formData)
      toast.success(response.message, {
        autoClose: 2500
      })
      setFormData({
        username: "",
        password: "",
        repeatPassword: "",
        role: "",
      })
      setError("")
    } catch (error) {
      setError(error.data)
    }
  }


  console.log("error role: ", error.role)

  return (
    <section className="overflow-hidden flex items-center justify-center bg-gradient-to-r from-[#262626] from-60% via-gray-400 py-6">
      <div className="flex shadow-2xl rounded-2xl">
        <div className="flex flex-col bg-[#F7F7F7] b items-center jusitfy-center text-center p-20 gap-8 rounded-2xl lg:rounded-tr-none lg:rounded-br-none">
          <h1 className="text-5xl font-bold">Register</h1>
          <form onSubmit={handleRegistration}>

            <div className="flex flex-col text-base text-left gap-1">
              <span>Username</span>
              <input 
                type="text" 
                className="rounded-md p-1 border-2 outline-none focus:border-black focus:bg-slate-50 text-md"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                
                />
                {error.username && (
                  <span className="text-red-600 mb-2">{error.username}</span>
                )}
            </div>


            <div className="flex flex-col text-base text-left gap-1">
              <span>Password</span>
              <input 
                type="password" 
                className="rounded-md p-1 border-2 outline-none focus:border-black focus:bg-slate-50"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                autoComplete="off"
                
                />
                {error.password && (
                  <span className="text-red-600 mb-2">{error.password}</span>
                )}
            </div>

            <div className="flex flex-col text-base text-left gap-1">
              <span>Repeat Password</span>
              <input 
                type="password" 
                className="rounded-md p-1 border-2 outline-none focus:border-black focus:bg-slate-50"
                name="repeatPassword"
                value={formData.repeatPassword}
                onChange={handleInputChange}
                autoComplete="off"
                
                />
                {error.repeatPassword && (
                  <span className="text-red-600 mb-2">{error.repeatPassword}</span>
                )}
            </div>

            <div className="flex flex-col text-base text-left gap-1">
              <label>Signup purpose</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="rounded-md p-1 border-2 outline-none focus:border-black focus:bg-slate-50"
                
              >
                <option value="" disabled hidden>Select</option>
                {roles.map((role) => (
                  <option key={role.value} value={role.value}>{role.label}</option>
                ))}
              </select>

              {error.role && (
                  <span className="text-red-600 mb-2">{error.role}</span>
                )}
            </div>


            <button className="px-10 py-2 text-2xl text-white rounded-md bg-gradient-to-tr bg-blue-600 hover:bg-blue-700 mt-4">
              Register
            </button>

          </form>

          <div>
            <span><a className="hover:underline" href="/home">Back to homepage</a></span>
          </div>

          <div>
            <button data-modal-target="default-modal" data-modal-toggle="default-modal" className={`${isMobile ? "" : "hidden"} block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-cent`} type="button">
              Why Register
            </button>
            {/* aria-hidden="true" - izbacen iz className-a donjeg div-a jer san ima error vidit sta tocno radi */}
            <div data-modal-backdrop="static" id="default-modal" tabIndex="-1" className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
              <div className="relative p-4 w-full max-w-2xl max-h-full">
                <div className="relative bg-white rounded-lg shadow-sm">
                  <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200">
                    <h3 className="text-base font-semibold text-gray-900">
                      Who is KickOff for
                    </h3>
                    <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center " data-modal-hide="default-modal">
                      <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                      </svg>
                      <span className="sr-only">Close modal</span>
                    </button>
                  </div>
                  <div className="p-4 md:p-5 space-y-4">
                    <p className="text-base leading-relaxed text-gray-500">
                      Are you part of a competitive team that loves playing soccer and aims to win tournaments?<br></br> Sign up now to manage your team, apply for tournaments, and stay organized.<br></br> Tournament organizers can also register to host events.<br></br><br></br>
                      Looking for match dates, team info, or results? No signup is needed-everything is available on our <a className="underline" href="/home">homepage</a> !
                    </p>
                  </div>
                  <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b">
                    <button data-modal-hide="default-modal" type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {!isMobile && (
          <div className="relative">
            <img className="w-[450px] object-cover md:rounded-tr-2xl md:rounded-br-2xl lg:block hidden opacity-20 h-full" src={image} alt="" />
            <div className="absolute inset-0 flex items-start justify-center">
              <h2 className="text-3xl font-bold text-black mt-32">Why register ?</h2>
              <p className="mt-44 absolute px-10 py-2 text-lg">
                Are you part of a competitive team that loves playing soccer and aims to win tournaments?<br></br> Sign up now to manage your team, apply for tournaments, and stay organized.<br></br> Tournament organizers can also register to host events.<br></br>
              <span className="absolute mt-5">Looking for match dates, team info, or results? No signup is needed-everything is available on our <a className="hover:underline" href="/home">homepage</a> !</span></p>
            </div>
          </div>
        )}       
      </div>
    </section>
  );
}
export default SignupPage;