import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import TeamPage from "./pages/TeamPage";
import OrganizerPage from "./pages/OrganizerPage";
import TeamRepresentativePage from "./pages/TeamRepresentativePage";
import AdminPage from "./pages/AdminPage";
import HomePage from "./pages/HomePage";

import { AuthProvider } from "./context/AuthContext";
import { ActiveComponentProvider } from "./context/ActiveComponentContext";
import { ActiveModalProvider } from "./context/ActiveModalContext";
import { LoggedUserProvider } from "./context/LoggedUserContext";
import UserPage from "./pages/UserPage";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <LoggedUserProvider>
            <Routes>
              <Route path="/home" element={ <ActiveComponentProvider> <HomePage /> </ActiveComponentProvider> } />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/user" element={
                  <ActiveModalProvider>
                    <ActiveComponentProvider>
                      <UserPage />
                    </ActiveComponentProvider>
                  </ActiveModalProvider>
                } />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/teams/:id" element={<TeamPage />} />
              <Route path="/organizer" element={
                  <ActiveModalProvider>
                    <ActiveComponentProvider>
                      <OrganizerPage />
                    </ActiveComponentProvider>
                  </ActiveModalProvider>
                } />
              <Route path="/representative" element={ 
                <ActiveModalProvider>
                  <ActiveComponentProvider>
                    <TeamRepresentativePage />
                  </ActiveComponentProvider>
                </ActiveModalProvider> }>
              </Route>
              <Route path="/admin" element={ <ActiveModalProvider> <ActiveComponentProvider> <AdminPage /> </ActiveComponentProvider > </ActiveModalProvider>} />
            </Routes>
          </LoggedUserProvider>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
};

export default App;
