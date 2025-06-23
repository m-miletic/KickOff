import React, { useState, useContext } from "react";
/* import image from '../assets/logo-white.png'; */
import { BREAKPOINTS } from "../../../data/breakpoints";
import { adminSidebarItems } from "../../../data/adminSidebarItems";
import { useSidebarVisibilityOnResize } from "../../../hooks/useSidebarVisibilityOnResize";
import { ActiveComponentContext } from "../../../context/ActiveComponentContext";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoMdClose } from "react-icons/io";

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [error, setError] = useState('');

  const { activeComponent, setActiveComponent } = useContext(ActiveComponentContext);

  useSidebarVisibilityOnResize(setIsSidebarOpen, setError);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const selectSideBarItem = (item) => {
    setActiveComponent(item);
    if (window.innerWidth < BREAKPOINTS.SM) {
      toggleSidebar();
    };
  };

  console.log("active Component: ", activeComponent);

  return (
    <div>
      <button onClick={toggleSidebar} type="button" className={`text-white relative top-5 left-4 ${window.innerWidth > BREAKPOINTS.SM || (window.innerWidth < BREAKPOINTS.SM && isSidebarOpen) ? 'hidden' : ''}`}>
        <RxHamburgerMenu className="h-5 w-5 ml-2 mt-1" />
      </button>

      <aside id="logo-sidebar" className={`h-screen sticky w-52 ${!isSidebarOpen && 'hidden'} md:w-56 xl:w-[270px]`} aria-label="Sidebar">
        <div className="h-full px-3 py-4 overflow-y-auto bg-[#001E28] text-white">
          {/* <img src={image} className="h-14 pl-12 text-center" alt="App Logo"></img> */}
          <ul className="space-y-2 text-2xs md:text-xs xl:text-base">
            <li>
              <button onClick={toggleSidebar} type="button" className={`m-1 ml-3 pt-1 ${(isSidebarOpen && window.innerWidth > BREAKPOINTS.SM) ? 'hidden' : ''}`}>
                <IoMdClose className="h-5 w-5" />
              </button>
            </li>
            <li className="pb-2.5"></li>
            {adminSidebarItems.map((item, index) => (
              <li key={index}>
                <button onClick={() => selectSideBarItem(item.value)} className="flex items-center hover:bg-[#005571] rounded-lg py-2 px-4 xl:py-2.5 w-full">
                  <span>{item.icon}</span>
                  <span className="ms-3">{item.label}</span>
                  {item.value === 'requests' && (
                    <span className="inline-flex items-center justify-center w-2 h-2 p-2 ml-3 text-sm 2xl:w-4 2xl:h-4 2xl:p-3 2xl:text-base font-medium text-blue-800 bg-blue-100 rounded-full">{/* {reqContext.totalPendingRequests} */}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
export default Sidebar;