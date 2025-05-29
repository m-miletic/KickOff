import React, { useState, useContext } from "react";
import { useFetchTeams } from "../../../hooks/team/useTeamHook";
import Pagination from "../../common/navigation/Pagination";
import { RequestContext } from "../../../context/RequestContext";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegEye } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { PreviewTeamModal } from "./modal/PreviewTeamModal";
import { DeleteTeamModal } from "./modal/DeleteTeamModal";
import { TbCaretUpDownFilled } from "react-icons/tb";
import { ActiveModalContext } from "../../../context/ActiveModalContext";

const TeamList = () => {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [filters, setFilters] = useState({
    tournament: '',
    sortDirection: 'DESC',
    pageNumber: 1
  });

  const { isPreviewModalOpen, setIsPreviewModalOpen, isEditModalOpen, setIsEditModalOpen, isDeleteModalOpen, setIsDeleteModalOpen } = useContext(ActiveModalContext);

  const handleSelectFilter = (type, filter) => {
    setFilters((prev) => ({
      ...prev,
      [type]: filter,
    }));
  };

  const handlePreviewTeam = (team) => {
    setSelectedTeam(team);
    setIsPreviewModalOpen(true);
  };

  const handleDeleteTeam = (team) => {
    setSelectedTeam(team);
    setIsDeleteModalOpen(true);
  };

  const { teams = [], setTeams } = useFetchTeams(filters);

  return (
    <div className="text-white text-2xs sm:text-xs lg:text-sm">
      <div className="flex justify-between bg-[#001E28] px-2 py-1.5 rounded-md font-medium w-[340px] sm:w-[380px] lg:w-[530px] xl:w-[560px] 2xl:py-2.5">

        <div className="flex items-center">
          <span>Team</span>
          <TbCaretUpDownFilled onClick={() => handleSelectFilter('sortDirection', filters.sortDirection === 'ASC' ? 'DESC' : 'ASC')} className="w-3 h-3 ml-1 cursor-pointer"/>
        </div>

        <div>
          <span className="mr-1">Action</span>
        </div>

      </div>

      {teams && teams.teamsList.map((team) => {
        return (
          <div key={team.id} className="flex justify-between items-center text-center w-[335px] sm:w-[375px] lg:w-[525px] xl:w-[550px] mt-3 xl:mt-4 ml-1.5">

            <div>
              {team.teamName}
            </div>

            <div className="space-x-1 lg:space-x-2 xl:space-x-2.5 ">

              <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-1 focus:ring-blue-300 text-2xs lg:text-xs xl:text-sm rounded-lg font-medium px-1.5 py-1 ">
                <span className="flex items-center justify-between"> <FaEdit /> <span className="ml-1">Edit</span> </span>
              </button>
              <button onClick={() => handlePreviewTeam(team)} className="px-1.5 py-1 text-white lg:text-xs xl:text-sm  bg-transparent rounded-lg border font-medium border-gray-500 focus:z-10 focus:ring-1 hover:ring-1 hover:ring-gray-500 focus:ring-gray-500">
                <span className="flex items-center justify-between"> <FaRegEye /> <span className="ml-1">Preview</span> </span>
              </button>
              <button onClick={() => handleDeleteTeam(team)} className="px-1.5 py-1 text-red-600 lg:text-xs xl:text-sm  bg-transparent rounded-lg border font-medium border-red-600 focus:z-10 focus:ring-1 hover:ring-1 hover:ring-red-600 focus:ring-red-600">
                <span className="flex items-center justify-between"> <RiDeleteBin6Line /> <span className="ml-1">Delete</span> </span>
              </button>
              
            </div>

          </div>         
        );
      })}

      {isPreviewModalOpen && (
        <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black/30">
          <PreviewTeamModal setIsModalOpen={setIsPreviewModalOpen} selectedTeam={selectedTeam} />
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black/30">
          <DeleteTeamModal setIsModalOpen={setIsDeleteModalOpen} selectedTeam={selectedTeam} setTeams={setTeams} filter={filters} />
        </div>
      )}

      <div className='text-center mt-5'>
        <Pagination totalPages={teams.totalPages} selectedFilters={filters} handleSelectFilter={handleSelectFilter} />
      </div>

    </div>    
  );


}
export default TeamList;