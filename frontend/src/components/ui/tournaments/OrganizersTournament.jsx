import React, { useContext, useEffect, useState } from "react";
import { fetchOrganizersTournament, updateTournament } from "../../../service/tournamentService";
import { LoggedUserContext } from "../../../context/LoggedUserContext";

const OrganizersTournament = () => {

  const [tournament, setTournament] = useState("");
  const [error, setError] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const {decodedJwt} = useContext(LoggedUserContext);

  const [formData, setFormData] = useState({});

  useEffect(() => {
    if(!decodedJwt) return;

    const fetchTournament = async () => {
      const fetchTourObj = {
        organizerId: decodedJwt.userId
      }
      try {
        const response = await fetchOrganizersTournament(fetchTourObj);
        setTournament(response);
        setFormData(response)
      } catch (error) {
        setError(error.message); // ??
      }
    }

    fetchTournament();
  }, [decodedJwt]);


  const handleClickPreview = () => {
    setIsPreviewOpen(!isPreviewOpen);
    setIsEditOpen(false);
  };

  const handleClickEdit = () => {
    setIsEditOpen(!isEditOpen);
    setIsPreviewOpen(false)
  };

  const handleInputChange = (e) => {
    setFormData((prevValues) => ({
      ...prevValues,
      [e.target.name]: e.target.value
    }));
  };

  const handleUpdateTournament = async (e) => {
    e.preventDefault();
    try {
      console.log("try")
      const response = await updateTournament(tournament.id, formData);
      console.log("res here - ", response)
      if(response.data.success === true) {
        setTournament(response.data.data);
        alert("Tournament updated!")
        setError("")
      } else {
        setError(response.data.message)
      }
    } catch (error) {
      console.log("catch")
      // ode ce ic samo unhendlani errori
      console.log("error - ", error)
    }
  };

  console.log("Tournament: ", tournament)

  return(

    <div className="text-white py-6">
      <div className="flex justify-center w-full">
        <div className="bg-[#001E28] w-[50%] mt-12 min-h-16 rounded-lg flex items-center justify-between">
          <div className="px-10 text-lg">{tournament?.tournamentName}</div>
          <div className="flex mx-8 space-x-4">
            <div className="text-lg"><button onClick={handleClickPreview}>Preview</button></div>
            <div className="text-lg"><button onClick={handleClickEdit}>Edit</button></div>
          </div>
        </div>
      </div>

      {isPreviewOpen && (
        <div className="flex flex-col items-center w-full">

          <div className="bg-[#001E28] w-[50%] mt-3 h-auto rounded-lg py-4">
            <div className="px-10 text-lg">Tournament Details</div>
            <div className="mt-4 px-10">
              {tournament?.details && (
                <div className="py-[2px]">
                  {tournament.details}
                </div>
              )}
            </div>
          </div>


          <div className="bg-[#001E28] w-[50%] mt-3 h-auto rounded-lg py-4">
            <div className="px-10 text-lg">Matches</div>
            <div className="mt-4 px-10">
              {tournament?.matchesList?.length > 0 && (
                tournament.matchesList.map((match, index) => (
                  <div key={index} className="py-[2px] flex justify-between">
                    <div>
                      {match.homeTeam.teamName} <span className="text-xl">VS</span> {match.awayTeam.teamName} 
                    </div>
                    <div>
                      {match.matchDate}
                    </div>

                  </div>
                ))
              )}
            </div>
          </div>
         
          <div className="bg-[#001E28] w-[50%] mt-3 h-auto rounded-lg py-4">
            <div className="px-10 text-lg">Teams</div>
            <div className="mt-4 px-10">
              {tournament?.teams?.length > 0 && (
                tournament.teams.map((team, index) => (
                  <div key={index} className="py-[2px]">
                    {team.teamName}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-[#001E28] w-[50%] mt-3 h-auto rounded-lg py-4">
            <div className="px-10 text-lg">Date</div>
            <div className="mt-4 px-10">
              {tournament && (
                <div className="space-y-2">
                  
                  <div className="flex">
                    <div className="w-20 font-medium">Start Date:</div>
                    <div>{tournament.startDate}</div>
                  </div>

                  <div className="flex">
                    <div className="w-20 font-medium">End Date:</div>
                    <div>{tournament.endDate}</div>
                  </div>

                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {isEditOpen && (
        <div className="flex justify-center items-start p-6 text-white">
          <div className="w-[50%] flex flex-col p-6 space-y-6 bg-[#001E28] rounded-lg shadow-lg">

            <form onSubmit={handleUpdateTournament} className="space-y-6">

              <div>
                <label className="block mb-2 font-semibold text-lg">Tournament Name:</label>
                <input
                  type="text"
                  name="tournamentName"
                  value={formData.tournamentName || ""}
                  onChange={handleInputChange}
                  className="w-full text-black p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold text-lg">Details:</label>
                <input
                  type="text"
                  name="details"
                  value={formData.details || ""}
                  onChange={handleInputChange}
                  className="w-full text-black p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex space-x-6">
                <div className="flex-1">
                  <label className="block mb-2 font-semibold text-lg">Start Date:</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate || ""}
                    onChange={handleInputChange}
                    className="w-full text-black p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex-1">
                  <label className="block mb-2 font-semibold text-lg">End Date:</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate || ""}
                    onChange={handleInputChange}
                    className="w-full text-black p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="text-red-500 text-center">
                {error}
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 transition-colors duration-200 rounded-md py-3 font-semibold text-white"
                >
                  Save
                </button>
              </div>

            </form>
          </div>
        </div>
      )}



    </div>
  );
}
export default OrganizersTournament;