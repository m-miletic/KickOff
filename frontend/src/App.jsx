import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import TeamPage from "./pages/TeamPage";
import OrganizerPage from "./pages/OrganizerPage";
import TeamRepresentativePage from "./pages/TeamRepresentativePage";
import AdminPage from "./pages/AdminPage";
import HomePage from "./pages/HomePage";
import { ActiveComponentProvider } from "./context/ActiveComponentContext";
import { LoggedUserProvider } from "./context/LoggedUserContext";
import { Calendar } from "./components/calendar/Calendar";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import OrganizersTournament from "./components/ui/tournaments/OrganizersTournament";
import UpcomingTournaments from "./components/ui/tournaments/UpcomingTournaments";
import MyTeam from "./components/ui/team/MyTeam";
import UserList from "./components/ui/user/UserList";
import TeamList from "./components/ui/team/TeamList";

const App = () => {
  return (
    <>
      <ToastContainer />
      <BrowserRouter>
{/*         <AuthProvider> */}
          <LoggedUserProvider>

            <Routes>
              <Route path="/" element={ <HomePage />}></Route>

              <Route path="/login" element={<LoginPage />}></Route>

              <Route path="/signup" element={<SignupPage />}></Route>

              <Route path="/admin" element={<AdminPage />}>
                <Route path="users" element={<UserList />}></Route>
                <Route path="teams" element={<TeamList />}></Route>
              </Route>

              <Route path="/tournament-organizer" element={<OrganizerPage />}>
                <Route path="match-scheduler" element={<Calendar />}></Route>
                <Route path="tournament-overview" element={<OrganizersTournament />}></Route>
              </Route>

              <Route path="/team-representative" element={<TeamRepresentativePage />}>
                <Route path="upcoming-tournaments" element={<UpcomingTournaments />}></Route>
                <Route path="team-overview" element={<MyTeam />}></Route>
              </Route>
              
              <Route path="/teams/:id" element=
              {
                <ActiveComponentProvider>
                  <TeamPage />
                </ActiveComponentProvider>

              } />

            </Routes>
          </LoggedUserProvider>
{/*         </AuthProvider> */}
      </BrowserRouter>
    </>
  );
};

export default App;
