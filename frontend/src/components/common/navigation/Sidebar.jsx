import React, { useState, useContext } from "react";
/* import image from '../assets/logo-white.png'; */
import { BREAKPOINTS } from "../../../data/breakpoints";
import { ITEMS } from "../../../data/adminSidebarItems";
import { useSidebarVisibilityOnResize } from "../../../hooks/useSidebarVisibilityOnResize";
import { ActiveComponentContext } from "../../../context/ActiveComponentContext";

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [error, setError] = useState('');

  const { activeComponent, setActiveComponent } = useContext(ActiveComponentContext);

  console.log("Sidebar: ", activeComponent);

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


  console.log("active cimponent: ", activeComponent)

  return (
    <div>
      <button onClick={toggleSidebar} type="button" className={`text-white relative top-5 left-4 ${window.innerWidth > BREAKPOINTS.SM || (window.innerWidth < BREAKPOINTS.SM && isSidebarOpen) ? 'hidden' : ''}`}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`size-6 `}>
          <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>

      <aside id="logo-sidebar" className={`h-screen sticky w-52 ${!isSidebarOpen && 'hidden'} md:w-56 xl:w-64`} aria-label="Sidebar">
        <div className="h-full px-3 py-4 overflow-y-auto bg-[#001E28] text-white">
          {/* <img src={image} className="h-14 pl-12 text-center" alt="App Logo"></img> */}
          <ul className="space-y-2 text-2xs md:text-xs xl:text-base">
            <li>
              <button onClick={toggleSidebar} type="button" className={`m-1 ml-3 pt-1 ${(isSidebarOpen && window.innerWidth > BREAKPOINTS.SM) ? 'hidden' : ''}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </li>
            <li className="pb-2.5"></li>
            {ITEMS.map((item, index) => (
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