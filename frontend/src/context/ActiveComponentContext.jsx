import { createContext, useEffect, useState } from "react";

const ActiveComponentContext = createContext();

const ActiveComponentProvider = ({ children }) => {
  const [activeComponent, setActiveComponent] = useState(() => {
    return localStorage.getItem("activeComponent") || "";
  });

  useEffect(() => {
    localStorage.setItem("activeComponent", activeComponent)
  }, [activeComponent])

  return(
    <ActiveComponentContext.Provider value={{ activeComponent, setActiveComponent }}>
      {children}
    </ActiveComponentContext.Provider>
  );
}

export { ActiveComponentProvider, ActiveComponentContext };