import React, { useState } from 'react'
import { IoMdClose } from "react-icons/io";
import { PiWarningCircleLight } from "react-icons/pi";
import { deleteUser } from '../../../../service/usersService';

export const DeleteUserModal = ({ setIsModalOpen, selectedUser, setUsers, filter }) => {
  const [errorMessage, setErrorMessage] = useState('');

  const handleDelete = async () => {
    try {
      const response = await deleteUser(filter, selectedUser.id);
      if (response.success) {
        setUsers(response.data);
        setIsModalOpen(false);
      } else {
        setErrorMessage(response.message)
      }
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex justify-center items-center'>
      <div className='w-[400px] bg-white text-gray-800 rounded-lg shadow-sm'>

        <div className='flex items-center justify-between p-4 border-b border-gray-500 rounded-t text-black'>
          <h3 className='text-lg'>Delete Team</h3>
          <button onClick={() => setIsModalOpen(false)} className='hover:bg-gray-200 p-1.5 rounded-lg'>
            <IoMdClose className='w-4 h-4'/>
          </button>
        </div>

        <div className='text-black'>
          <div className='flex justify-center items-center pt-2'>
            <PiWarningCircleLight className='w-6 h-6'/>
          </div>
          <div className='flex justify-center items-center pt-2 pb-6 '>
            <div className='p-3'>
              {errorMessage ? <span>{errorMessage}</span> : <span>Are you sure you want to delete</span>}
            </div>
          </div>

          <div className='flex justify-center items-center space-x-2 pb-3 text-white font-medium '>
            <div><button onClick={() => handleDelete()} className='bg-red-700 rounded-lg px-3 py-1.5 p-1'>Yes, I'm sure</button></div>
            <div><button onClick={() => setIsModalOpen(false)} className='bg-blue-700 rounded-lg px-3 py-1.5 p-1'>No, cancel</button></div>

          </div>
        </div>

      </div>



    </div>
  )
}
