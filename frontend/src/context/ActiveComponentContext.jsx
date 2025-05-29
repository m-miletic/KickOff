import { createContext, useState } from "react";

const ActiveComponentContext = createContext();

const ActiveComponentProvider = ({ children }) => {
  const [activeComponent, setActiveComponent] = useState("Test");

  return(
    <ActiveComponentContext.Provider value={{ activeComponent, setActiveComponent }}>
      {children}
    </ActiveComponentContext.Provider>
  );
}

export { ActiveComponentProvider, ActiveComponentContext };