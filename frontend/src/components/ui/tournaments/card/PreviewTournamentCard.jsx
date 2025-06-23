import React, { useContext, useState } from 'react'
import { createEnrollTeamRequest } from '../../../../service/requestService';
import { LoggedUserContext } from '../../../../context/LoggedUserContext';
import { toast } from 'react-toastify';

const PreviewTournamentCard = ({ tournament }) => {
  const { decodedJwt } = useContext(LoggedUserContext);
  const [error, setError] = useState();
  const [requestObject, setRequestObject] = useState({
    teamRepresentativeId: decodedJwt?.userId,
    tournamentId: tournament.id,
  });
  const [showTournamentDetails, setShowTournamentDetils] = useState(false)

  const handleEnrollButtonClick = async () => {
    setError(null); // clear previous error
    try {
      const response = await createEnrollTeamRequest(requestObject);
      if (response.success) {
        toast.success("Request Sent!", { autoClose: 2500 });
        setShowTournamentDetils(false);
      } else if (response.success === false) { // redudantno ???
        setError(response.message || "Request failed.");
      }
    } catch (error) {
      const message = error?.data?.message || "Something went wrong while sending the request.";
      setError(message);

      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  const handleSeeMoreClick = (tournamentId) => {
    setShowTournamentDetils((prevTournamentId) => prevTournamentId === tournamentId ? "" : tournamentId)
  }

  return (
    <div>
      <div className="bg-[#001E30] w-[350px] min-h-[120px] px-2 py-4 rounded-md text-white shadow-md flex flex-col items-center h-auto self-start">

        <div className="text-center text-lg font-semibold pt-1">
          {tournament.tournamentName}
        </div>

        {showTournamentDetails !== tournament.id && (
          <div onClick={() => handleSeeMoreClick(tournament.id)} className="text-sm text-blue-300 hover:underline cursor-pointer mt-10">See More</div>
        )}

        {showTournamentDetails === tournament.id && (
          <div className='w-full mt-8 px-4 space-y-2'>

            <div className='flex justify-start items-center'>
              <div className='w-24 font-semibold'>Start Date: </div> <div>{tournament.startDate}</div>
            </div>

            <div className='flex justify-start items-center'>
              <div className='w-24 font-semibold'>End Date: </div> <div>{tournament.endDate}</div>
            </div>

            <div className=''>
              <div className='w-auto font-semibold'>Tournament Details: </div> <div className='mt-2'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit, molestias. Repellat ea dolores ullam veritatis dicta saepe amet vitae, optio possimus, atque accusamus cumque aspernatur distinctio quasi animi illo nemo.</div>
            </div>
            
            <div>
              <div className='w-auto font-semibold'>Teams Enrolled:</div>
              <div>
              {tournament?.teams?.length > 0 ? (
                tournament.teams.map((team) => (
                  <div>{team.teamName}</div>
                ))
              ) : (
                <span>No teams enrolled</span>
              )}
              </div>
            </div>

            <div className='text-start flex justify-start items-center'>
              <div><button onClick={handleEnrollButtonClick} className='bg-blue-600 hover:bg-blue-700 rounded-md px-2 py-1 mt-2'>Enroll</button></div>
              <div className='text-red-600 text-base ml-6'>{error}</div>
            </div>
            

            <div onClick={() => handleSeeMoreClick(tournament.id)} className="text-sm text-blue-300 hover:underline cursor-pointer pt-4 text-center">See Less</div>
          </div>

        )}

      </div>

    </div>
  );
};
  
export default PreviewTournamentCard;
