import { useEffect } from "react";
import { BREAKPOINTS } from "../data/breakpoints";

export const useSidebarVisibilityOnResize = (setIsSidebarOpen) => {

  useEffect(() => {
    const handleSidebarToggleOnWindowResize = () => {
      // dok je u mobile ekranu - ako je sidebar otvoren ne mjenjat setIsSidebarOpen na resize 
      if (window.innerWidth > BREAKPOINTS.SM) {
        setIsSidebarOpen(true);
      } else if (window.innerWidth < BREAKPOINTS.SM) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleSidebarToggleOnWindowResize);
    handleSidebarToggleOnWindowResize();
    return () => {
      window.removeEventListener("resize", handleSidebarToggleOnWindowResize);
    };
  }, []);
}