import React from 'react'
import { IoMdClose } from "react-icons/io";
import { GiSoccerBall } from "react-icons/gi";

export const PreviewTeamModal = ({ setIsModalOpen, selectedTeam: team }) => {

  console.log("team: ", team);

  return (
    <div className='fixed inset-0 z-50 flex justify-center items-center'>
      <div className='bg-white text-gray-800 rounded-lg shadow-sm w-[400px]'>
        
        <div className='flex items-center justify-between p-4 border-b border-gray-500 rounded-t text-black'>
          <h3 className='text-lg'>Preview Team</h3>
          <button onClick={() => setIsModalOpen(false)} className='hover:bg-gray-200 p-1.5 rounded-lg'>
            <IoMdClose className='w-4 h-4'/>
          </button>
        </div>

        <div className='text-black text-sm'>

          <div className='flex justify-between items-center px-4 pt-4'>
            <div>
              Team Name
            </div>
            <div className='flex justify-center items-center space-x-4 mr-4'>
              <div>Wins:<span className='font-medium'> {team.wins}</span></div>
              <div>Draws:<span className='font-medium'> {team.draws}</span></div>
              <div>Losses:<span className='font-medium'> {team.losses}</span></div>
            </div>
          </div>

          <div className='px-4'>
            <span className='font-medium'>{team.teamName}</span>
          </div>

          <div className='flex justify-between items-center p-4 '>
            <div className='-mt-8'>
              <div>Coach</div>
              <div><span className='font-medium'>Tralalero Tralala</span></div>
            </div>
            <div>
              <img src={team.teamCrest} alt="" className='w-36 h-32 rounded-2xl' />
            </div>
          </div>

        </div>
      </div>

    </div>

/*     <div className="fixed inset-0 z-50 flex justify-center items-center">
      <div className="relative p-4 w-[400px] sm:w-[450px] md:w-[450px] lg:w-[500px] xl:w-[550px] 2xlw-[600px]">

        <div className="relative bg-white rounded-lg shadow-sm">

          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200">
            <h3 className="text-base md:text-lg 2xl:text-xl font-semibold text-gray-900 ">
                Request Details
            </h3>
            <button onClick={() => setIsModalOpen(false)}  type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center  " data-modal-hide="default-modal">
              <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>

          <div className="p-4 md:p-5 space-y-4">
            <p className="text-sm md:text-base 2xl:text-lg leading-relaxed text-gray-500">
                aaaaaaaaaaaaaaaaa
            </p>
          </div>




        </div>
      </div>
    </div> */
  )
}
export default PreviewTeamModal;
