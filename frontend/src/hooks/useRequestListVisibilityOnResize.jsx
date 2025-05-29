import { useEffect } from "react"
import { BREAKPOINTS } from "../data/breakpoints"

export const useRequestLisVisibilityOnResize = (setHide) => {

  useEffect(() => {
    const handleHideRequestListComponent = () => {
      if (window.innerWidth < BREAKPOINTS.XS) {
        setHide(true);
      } else if (window.innerWidth > BREAKPOINTS.XS) {
        setHide(false);
      }
    }
    window.addEventListener("resize", handleHideRequestListComponent);
    handleHideRequestListComponent();
    return () => {
      window.removeEventListener("resize", handleHideRequestListComponent);
    };
  }, [])
}