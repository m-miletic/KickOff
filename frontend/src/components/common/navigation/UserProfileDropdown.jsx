import React, { useContext, useState } from 'react'
import { RxCaretDown } from "react-icons/rx";
import { RxCaretUp } from "react-icons/rx";
import { CiLogout } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';
import { LoggedUserContext } from '../../../context/LoggedUserContext';
import { logout } from '../../../service/authenticationService';

const UserProfileDropdown = ({ name, handleIsRequestModalOpen }) => {
  const [isUserProfileDropdownOpen, setIsUserProfileDropdownOpen] = useState(false);
  const { setJwt, setDecodedJwt, decodedJwt } = useContext(LoggedUserContext)
  const navigate = useNavigate();
  const firstLetter = name.charAt(0).toUpperCase();

  const handleSendRequestClick = () => {
    handleIsRequestModalOpen();
    setIsUserProfileDropdownOpen(!isUserProfileDropdownOpen);
  };

  const handleIsUserProfileDropdownOpen = () => {
    setIsUserProfileDropdownOpen(!isUserProfileDropdownOpen);
  };

  const handleSelectItem = (item) => {
    handleIsUserProfileDropdownOpen();
  }

  const handleLogout = async () => {
    try {
      let refreshToken = localStorage.getItem('refreshToken')
      await logout(refreshToken)
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      setJwt(null)
      setDecodedJwt(null)
      navigate("/")
    } catch (error) {
      console.error("Error while trying to log out: ", error.message)
    }
  };

  return (
    <div>

      <div onClick={handleIsUserProfileDropdownOpen} className='flex items-center justify-center cursor-pointer'>

        <div>
          { isUserProfileDropdownOpen ? <RxCaretUp className='w-5 h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7'/> : <RxCaretDown className='w-5 h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7' /> }
        </div>

        <div className="rounded-full border w-5 h-5 border-white cursor-pointer bg-white flex items-center justify-center mt-2 p-3 2xl:p-4">
          <button className="text-black mb-[1px]">{firstLetter}</button>
        </div>

      </div>

      {isUserProfileDropdownOpen && (
        <div className="absolute z-[100] top-[76px] xl:top-[84px] 2xl:top-[98px] right-2 text-xs xl:text-sm bg-[#001E28] rounded-lg p-2 space-y-1 px-2 2xl:px-4 2xl:py-4">

          <div className='text-gray-300 cursor-pointer pb-2'>
            Hello {name}
          </div>
          
          <div 
            onClick={handleSendRequestClick}
            className='cursor-pointer hover:bg-[#005571] rounded-md px-2 py-1'
          >
            <button>Send Request</button>
          </div>

          <div
            className='cursor-pointer hover:bg-[#005571] rounded-md px-2 py-1'
            onClick={() => handleSelectItem("myRequests")}
            >
            <button>My Requests</button>
          </div>

          <div className='flex items-center cursor-pointer hover:bg-[#005571] rounded-md px-2 py-1'>
            <div onClick={handleLogout}>Logout</div>
            <div className='text-base ml-1'><CiLogout /></div>
          </div>

        </div>
      )}

    </div>
  );
}
export default UserProfileDropdown;