import React, { useContext, useState } from 'react'
import { RxCaretDown } from "react-icons/rx";
import { RxCaretUp } from "react-icons/rx";
import { CiLogout } from "react-icons/ci";
import { ActiveComponentContext } from '../../context/ActiveComponentContext';
import { useNavigate } from 'react-router-dom';
import UserService from '../../service/UserService';

const UserProfileDropdown = ({ name, handleIsRequestModalOpen }) => {
  const [isUserProfileDropdownOpen, setIsUserProfileDropdownOpen] = useState(false);
  const { setActiveComponent } = useContext(ActiveComponentContext);
  const nav = useNavigate();

  const handleSendRequestClick = () => {
    handleIsRequestModalOpen();
    setIsUserProfileDropdownOpen(!isUserProfileDropdownOpen);
  };

  const handleIsUserProfileDropdownOpen = () => {
    setIsUserProfileDropdownOpen(!isUserProfileDropdownOpen);
  };

  const handleSelectItem = (item) => {
    setActiveComponent(item);
    handleIsUserProfileDropdownOpen();
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    UserService.logout(localStorage.getItem('refreshToken'));
    localStorage.removeItem('refreshToken');
    nav("/login");
  };

  return (
    <div>

      <div onClick={handleIsUserProfileDropdownOpen} className='flex items-center justify-center cursor-pointer'>

        <div>
          { isUserProfileDropdownOpen ? <RxCaretUp /> : <RxCaretDown /> }
        </div>

        <div className="rounded-full border w-5 h-5 border-white cursor-pointer bg-white flex items-center justify-center mt-2">
          <button className="text-black">U</button>
        </div>

      </div>

      {isUserProfileDropdownOpen && (
        <div className="absolute top-[70px] right-0 text-xs bg-[#001E28] rounded-lg p-2 space-y-1">

          <div className='text-gray-300 cursor-pointer pb-2'>
            Hello name
          </div>
          
          <div 
            onClick={handleSendRequestClick}
            className='cursor-pointer hover:bg-[#005571] rounded-md px-2 py-1'
          >
            <button>Send Request</button>
          </div>

          <div
            className='cursor-pointer hover:bg-[#005571] rounded-md px-2 py-1'
            onClick={() => handleSelectItem("recievedRequests")}
            >
            <button>Recieved Requests</button>
          </div>

          <div
            className='cursor-pointer hover:bg-[#005571] rounded-md px-2 py-1'
            onClick={() => handleSelectItem("sentRequests")}
            >
            <button>Sent Requests</button>
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
