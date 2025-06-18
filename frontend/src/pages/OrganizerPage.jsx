import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/common/navigation/Navbar";
import RequestList from "../components/ui/request/RequestList";
import { RequestProvider } from "../context/RequestContext";
import { ActiveComponentContext } from "../context/ActiveComponentContext";
import FileUpload from "../components/ui/files/FileUpload";
import OrganizersTournament from "../components/ui/tournaments/OrganizersTournament";
import { Calendar } from "../components/calendar/Calendar";
import { LoggedUserContext } from "../context/LoggedUserContext";
import { fetchOrganizersTournament } from "../service/tournamentService";
import EditMatchForm from "../components/ui/match/form/EditMatchModal";

const OrganizerPage = () => {
  const [tournament, setTournament] = useState("");
  const { activeComponent } = useContext(ActiveComponentContext);
  const {decodedJwt} = useContext(LoggedUserContext);

  console.log("acomp: ", activeComponent)


  useEffect(() => {
    if(!decodedJwt) return;

    const fetchTournament = async () => {
      const fetchTourObj = {
        organizerId: decodedJwt.userId
      }
      try {
        const response = await fetchOrganizersTournament(fetchTourObj);
        setTournament(response);
      } catch (error) {
        console.log("Error - ", error)
      }
    }

    fetchTournament();
  }, [decodedJwt]);
  
  return(
    <div>
      <Navbar />
      {(activeComponent === "sentRequests" || activeComponent === "recievedRequests") && 
        <div className="flex justify-center text-white mt-20">
          <RequestProvider>
            <RequestList />
          </RequestProvider>
        </div>
      }

      { (activeComponent === "Match Scheduler" || activeComponent === "") && (
        <Calendar />
      )}

      { (activeComponent === "Tournament Dashboard") && (
        <OrganizersTournament tournament={tournament} setTournament={setTournament} />
      )}

      { (activeComponent === "Edit Matches") && (
        <EditMatchForm tournament={tournament} />
      )}

      

{/*       <div className="flex justify-center items-center text-white">
        <FileUpload />
      </div> */}

    </div>
  );
}
export default OrganizerPage;