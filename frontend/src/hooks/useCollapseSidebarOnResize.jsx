import React, { useEffect } from "react";

export const useCollapseSidebarOnResize = ( setIsSideBarActive ) => {

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 640) {
        setIsSideBarActive(false);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [setIsSideBarActive]);
}