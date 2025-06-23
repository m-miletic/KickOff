import React, { useContext } from "react";
import Navbar from "../components/common/navigation/Navbar";
import RequestList from "../components/ui/request/RequestList";
import { RequestProvider } from "../context/RequestContext";
import { ActiveComponentContext } from "../context/ActiveComponentContext";
import OrganizersTournament from "../components/ui/tournaments/OrganizersTournament";
import { Calendar } from "../components/calendar/Calendar";
import Footer from "../components/common/footer/Footer";

const OrganizerPage = () => {
  const { activeComponent } = useContext(ActiveComponentContext);

  return(
    <div className="min-h-screen flex flex-col">

      <Navbar />

      <main className="flex-grow">

        {(activeComponent === "sentRequests" || activeComponent === "recievedRequests") && 
          <div className="flex justify-center text-white mt-20">
            <RequestProvider>
              <RequestList />
            </RequestProvider>
          </div>
        }

        { (activeComponent === "matchScheduler" || activeComponent === "") && (
          <Calendar />
        )}

        { (activeComponent === "tournamentOverview") && (
          <OrganizersTournament />
        )}

      </main>

      <Footer />

    </div>
  );
}
export default OrganizerPage;