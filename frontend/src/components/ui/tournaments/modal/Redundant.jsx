/* import React from 'react'
import { IoMdClose } from "react-icons/io";



*** Mislim da je ova komponenta redudantna - 



const PreviewTournamentModal = ({ setIsModalOpen, selectedTournament: tournament }) => {

  console.log("tournament: ", tournament);
  return (
    <div className='fixed inset-0 z-50 flex justify-center items-center'>
      <div className='bg-white text-gray-800 rounded-lg shadow-sm w-[400px]'>
        
        <div className='flex items-center justify-between p-4 border-b border-gray-500 rounded-t text-black'>
          <h3 className='text-lg'>Preview Tournament</h3>
          <button onClick={() => setIsModalOpen(false)} className='hover:bg-gray-200 p-1.5 rounded-lg'>
            <IoMdClose className='w-4 h-4'/>
          </button>
        </div>


        <div className="p-4 text-sm space-y-3 px-10">
          <div className="flex justify-between">
            <div className="font-medium">Tournament Name:</div>
            <div>{tournament.tournamentName}</div>
          </div>
          <div className="flex justify-between">
            <div className="font-medium">Tournament Organizer:</div>
            <div>{tournament.organizer.username}</div>
          </div>
          <div className="flex justify-between">
            <div className="font-medium">Start Date:</div>
            <div>{tournament.startDate}</div>
          </div>
          <div className="flex justify-between">
            <div className="font-medium">End Date:</div>
            <div>{tournament.endDate}</div>
          </div>
          <div className="flex justify-between">
            <div className="font-medium">Description:</div>
            <div>{tournament.details}</div>
          </div>
        </div>



        
      </div>

    </div>
  )
}
export default PreviewTournamentModal;
 */