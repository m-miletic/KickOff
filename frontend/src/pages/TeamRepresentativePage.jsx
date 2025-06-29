import React, { useContext, useEffect } from "react";
import Navbar from "../components/common/navigation/Navbar";
import { ActiveComponentContext } from "../context/ActiveComponentContext";
import { RequestProvider } from "../context/RequestContext";
import RequestList from "../components/ui/request/RequestList";
import UpcomingTournaments from "../components/ui/tournaments/UpcomingTournaments";
import MyTeam from "../components/ui/team/MyTeam";
import Footer from "../components/common/footer/Footer";
import WeatherWidget from "../components/weather/WeatherWidget";

const TeamRepresentativePage = () => {
  const { activeComponent } = useContext(ActiveComponentContext);

  return (
    <div className="min-h-screen flex flex-col"> 

      <Navbar />

      <main className="flex-grow">
        

        {(activeComponent === "myRequests") && 
          <div className="flex justify-center text-white pt-48">
            <RequestProvider>
              <RequestList />
            </RequestProvider>
          </div>
        }

        {activeComponent === "upcomingTournaments" && 
          <div className="flex justify-center">
            <UpcomingTournaments />
          </div>
        }

        { (activeComponent === "teamOverview" || activeComponent === "") &&
          <div className="flex justify-center mt-10">
            <MyTeam />
          </div>
        }

      </main>

      <Footer />

    </div>
  );
};
export default TeamRepresentativePage;
