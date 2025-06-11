import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCollapseSidebarOnResize } from "../../../hooks/useCollapseSidebarOnResize";
import { SendRequestModal } from "../../ui/request/modal/SendRequestModal";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import UserProfileDropdown from "./UserProfileDropdown.jsx";
import { ActiveComponentContext } from "../../../context/ActiveComponentContext";
import { LoggedUserContext } from "../../../context/LoggedUserContext"
import { GUEST_NAVBAR_ITEMS, TEAM_REPRESENTATIVE_NAVBAR_ITEMS, TOURNAMENT_ORGANIZER_NAVBAR_ITEMS } from '../../../data/navbarItems.js'

const Navbar = () => {
  const [isSideBarActive, setIsSideBarActive] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 640);

  const { activeComponent, setActiveComponent } = useContext(ActiveComponentContext);
  const { decodedJwt, jwt, loading } = useContext(LoggedUserContext);

  useCollapseSidebarOnResize(setIsSideBarActive);

  const toggleSidebar = () => {
    setIsSideBarActive(!isSideBarActive);
  };

  const handleIsRequestModalOpen = () => {
    setIsRequestModalOpen(!isRequestModalOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 640);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  return(
    <div>
      {isMobileView ? (
        <div>
          {isSideBarActive ? (
            <div className="bg-[#001E28] flex-col w-40 h-screen text-white text-base fixed top-0 left-0 z-50">

              <div className="px-2 pt-5">
                <button onClick={toggleSidebar} className="p-1 hover:bg-[#005571] rounded-md">
                  <IoClose />
                </button>
              </div>

              <div className="p-6">
                AppLogo
              </div>
              
              {decodedJwt === null ? (
                <>
                  <div className={`flex flex-col items-start space-y-2 px-3`}>
                    {GUEST_NAVBAR_ITEMS.map((item, index) => {
                      return (
                        <div key={index} className="cursor-pointer hover:border-b border-white/25 w-full hover:bg-[#005571]  rounded-md p-1">
                          <Link><button onClick={() => setActiveComponent(item)}>{item}</button></Link>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <>
                  {decodedJwt.role === "TEAM_REPRESENTATIVE" && (
                    <>
                      <div className={`flex flex-col items-start space-y-2 ml-3`}>
                        {TEAM_REPRESENTATIVE_NAVBAR_ITEMS.map((item, index) => {
                          return (
                            <div key={index} className="cursor-pointer hover:border-b border-white/25">
                              <Link><button onClick={() => setActiveComponent(item)}>{item}</button></Link>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}

                  {decodedJwt.role === "TOURNAMENT_ORGANIZER" && (
                    <>
                      <div className={`flex flex-col items-start space-y-2 ml-3`}>
                        {TOURNAMENT_ORGANIZER_NAVBAR_ITEMS.map((item, index) => {
                          return (
                            <div key={index} className="cursor-pointer hover:border-b border-white/25">
                              <Link><button onClick={() => setActiveComponent(item)}>{item}</button></Link>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          ) : (
            <div className={`bg-[#001E28] w-screen h-16 flex justify-between items-center text-white text-base px-3`}>
              <div>
                <button onClick={toggleSidebar} ><GiHamburgerMenu /></button>
              </div>
              <div>
                {decodedJwt === null ? (
                  <div>
                    <Link to={"/login"} className="px-2.5 py-1.5 text-xs sm:text-sm lg:px-3 lg:py-2 rounded-xl bg-blue-500"><span>Login</span></Link>
                  </div>
                ) : (
                  <div>
                    <UserProfileDropdown name={decodedJwt?.sub} handleIsRequestModalOpen={handleIsRequestModalOpen} />
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      ) : (
        <div className="flex justify-between items-center bg-[#001E28] text-white h-16 px-4">

          <div>AppLogo</div>

          {decodedJwt === null ? (
            <>
              <div className={`flex justify-center items-center space-x-2`}>
                {GUEST_NAVBAR_ITEMS.map((item, index) => {
                  return (
                    <div key={index} className="cursor-pointer hover:border-b border-white/25">
                      <Link><button onClick={() => setActiveComponent(item)}>{item}</button></Link>
                    </div>
                  );
                })}
              </div>
              <div>
                <Link to={"/login"} className="px-2.5 py-1.5 text-xs sm:text-sm lg:px-3 lg:py-2 rounded-xl bg-blue-500"><span>Login</span></Link>
              </div>
            </>
          ) : (
            <>

              {decodedJwt.role === "TEAM_REPRESENTATIVE" && (
                <>
                  <div className={`flex justify-center items-center space-x-2`}>
                    {TEAM_REPRESENTATIVE_NAVBAR_ITEMS.map((item, index) => {
                      return (
                        <div key={index} className="cursor-pointer hover:border-b border-white/25">
                          <Link><button onClick={() => setActiveComponent(item)}>{item}</button></Link>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {decodedJwt.role === "TOURNAMENT_ORGANIZER" && (
                <>
                  <div className={`flex justify-center items-center space-x-2`}>
                    {TOURNAMENT_ORGANIZER_NAVBAR_ITEMS.map((item, index) => {
                      return (
                        <div key={index} className="cursor-pointer hover:border-b border-white/25">
                          <Link><button onClick={() => setActiveComponent(item)}>{item}</button></Link>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              <div>
                <UserProfileDropdown name={decodedJwt?.sub} handleIsRequestModalOpen={handleIsRequestModalOpen} />
              </div>
           </>
          )}
        </div>
      )}

      <div>
        {decodedJwt !== null && isRequestModalOpen && (
          <SendRequestModal setIsRequestModalOpen={setIsRequestModalOpen} />
        )}
      </div>

    </div>
  );
};
export default Navbar;

