import React from "react";
import { use } from "react";
import { IoMdClose } from "react-icons/io";

export const PreviewUserModal = ({ setIsModalOpen, selectedUser: user }) => {
  return(
    <div className='fixed inset-0 z-50 flex justify-center items-center'>
      <div className='bg-white text-gray-800 rounded-lg shadow-sm w-auto'>

        <div className='flex items-center justify-between p-4 border-b border-gray-500 rounded-t text-black'>
          <h3 className='text-lg'>Preview User</h3>
          <button onClick={() => setIsModalOpen(false)} className='hover:bg-gray-200 p-1.5 rounded-lg'>
            <IoMdClose className='w-4 h-4'/>
          </button>
        </div>

        <div className="flex justify-between items-center">
          <div className="p-3">
            <span>Email:</span>
            <span className="ml-2">{user.email}</span>
          </div>
          <div className="p-3">
            <span>Role:</span>
            <span className="ml-2">{user.role}</span>
          </div>
        </div>
        <div className="p-3">

          {user.team && (
            <>
              <span>Representing:</span>
              <span className="ml-2">{user.team.teamName}</span>
            </>
          )}
          
          {user.tournament && (
            <>
              <span>Organizing Tournament:</span>
              <span className="ml-2">{user.tournament.tournamentName}</span>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
export default PreviewUserModal;