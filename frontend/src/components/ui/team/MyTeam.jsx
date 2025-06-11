import React, { useContext, useEffect, useState } from 'react'
import { LoggedUserContext } from '../../../context/LoggedUserContext';
import { fetchTeamByRepresentative } from '../../../service/teamService';
import FileUpload from '../files/FileUpload';

const MyTeam = () => {
  const { decodedJwt, jwt, loading } = useContext(LoggedUserContext);
  const [team, setTeam] = useState("");
  const [error, setError] = useState("");
  const [isEditButtonClicked, setIsEditButtonClicked] = useState(false)

  const handleEdit = () => {
    setIsEditButtonClicked(!isEditButtonClicked)
  };

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const fetchTeamObj = {
          representativeId: decodedJwt.userId,
        };
        const response = await fetchTeamByRepresentative(fetchTeamObj)
        setTeam(response.data.data)
      } catch (error) {
        setError(error.message)
        console.log("thi error: ", error);
      }
    }
    fetchTeam(); 
  }, [decodedJwt, jwt]) // s obzirom da ako se u decoded role promini (jer se samo to moze i prominit ?) interceptop odjavi user-a treba li mi dpendency ? (moze bit prazan?)

  console.log("Team: ", team)


  if (error) {
    return <div>Error loadin team: {error.message}</div>
  }

  return (
    <div className='w-full'>
      <div className='justify-center items-center flex'>
        <div className='bg-[#001E30] text-white p-4 rounded-md w-[40%]'>
          <div className='flex'>
            <div className='w-24 h-16 flex items-center '>
              <img src={team.teamCrest} alt="" className="w-full h-full object-contain " />
            </div>
            <div className=' w-96 h-16 ml-2'>
              <div>Team</div> 
              <div>{team.teamName}</div>
            </div>
            <div className='w-24 h-16 ml-auto flex items-center'>
              <button onClick={handleEdit}>Edit</button>  
            </div> 
          </div>
        </div>
      </div>

      {isEditButtonClicked && (
        <div className='text-white flex justify-center items-center mt-6'>
          <FileUpload teamId={team.id}/>
        </div>
      )}

    </div>
  );
  
  
}
export default MyTeam;