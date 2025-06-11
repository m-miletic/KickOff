import React, { useContext } from "react";
import Navbar from "../components/common/navigation/Navbar";
import RequestList from "../components/ui/request/RequestList";
import { RequestProvider } from "../context/RequestContext";
import { ActiveComponentContext } from "../context/ActiveComponentContext";
import FileUpload from "../components/ui/files/FileUpload";
import OrganizersTournament from "../components/ui/tournaments/OrganizersTournament";

const OrganizerPage = () => {
  const { activeComponent } = useContext(ActiveComponentContext);

  console.log("acomp: ", activeComponent)
  
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

      {activeComponent === "My Tournament" && (
        <OrganizersTournament />
      )}

{/*       <div className="flex justify-center items-center text-white">
        <FileUpload />
      </div> */}

    </div>
  );
}
export default OrganizerPage;