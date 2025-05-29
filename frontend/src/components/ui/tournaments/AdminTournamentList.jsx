import React, { useContext, useState } from 'react'
import { useFetchTournaments } from '../../../hooks/tournaments/useFetchTournaments';
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegEye } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import PreviewTournamentModal from './modal/PreviewTournamentModal';
import DeleteTournamentModal from './modal/DeleteTournamentModal';
import { ActiveModalContext } from '../../../context/ActiveModalContext';

const AdminTournamentList = () => {
  const [filters, setFilters] = useState({
    pageNumber: 1
  });
  const [selectedTournament, setSelectedTournament] = useState();
  const { isPreviewModalOpen, setIsPreviewModalOpen, isEditModalOpen, setIsEditModalOpen, isDeleteModalOpen, setIsDeleteModalOpen } = useContext(ActiveModalContext);

  const { tournaments = [], setTournaments, error, loading } = useFetchTournaments(filters);

  const handlePreviewTournament = (tournament) => {
    setSelectedTournament(tournament);
    setIsPreviewModalOpen(true);
  };

  const handleDeleteTournament = (tournament) => {
    setSelectedTournament(tournament);
    setIsDeleteModalOpen(true);
  };

  return (  
    <div className='w-[325px] text-2xs text-white'>
        
        <div className='bg-[#04111a] p-3 rounded-md flex justify-between items-center'>
          <div>Tournament</div>
          <div>Action</div>
        </div>

        <div className='p-2'>
          {tournaments.map((tournament, index) => {
            return(
              <div key={index} className='flex justify-between items-center'>

                <div className='py-2'>
                  {tournament.tournamentName}
                </div>

                <div className='flex justify-center items-center space-x-1'>

                  <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-1 focus:ring-blue-300 text-xs lg:text-xs xl:text-sm rounded-lg font-medium px-1.5 py-1">
                    <span className="flex items-center justify-between"> <FaEdit /> <span className="ml-1">Edit</span> </span>
                  </button>

                  <button onClick={() => handlePreviewTournament(tournament)} className="px-1.5 py-1 text-white lg:text-xs xl:text-sm  bg-transparent rounded-lg border font-medium border-gray-500 focus:z-10 focus:ring-1 hover:ring-1 hover:ring-gray-500 focus:ring-gray-500">
                    <span className="flex items-center justify-between"> <FaRegEye /> <span className="ml-1">Preview</span> </span>
                  </button>

                  <button onClick={() => handleDeleteTournament(tournament)} className="px-1.5 py-1 text-red-600 lg:text-xs xl:text-sm  bg-transparent rounded-lg border font-medium border-red-600 focus:z-10 focus:ring-1 hover:ring-1 hover:ring-red-600 focus:ring-red-600">
                    <span className="flex items-center justify-between"> <RiDeleteBin6Line /> <span className="ml-1">Delete</span> </span>
                  </button>

                </div>
                
              </div>
            );
          })}
        </div>

        {isPreviewModalOpen && (
          <PreviewTournamentModal setIsModalOpen={setIsPreviewModalOpen} selectedTournament={selectedTournament} />
        )}

        {isDeleteModalOpen && (
          <DeleteTournamentModal setIsModalOpen={setIsDeleteModalOpen} selectedTournament={selectedTournament} setTournaments={setTournaments} />
        )}

      </div>
  );
}
export default AdminTournamentList;
