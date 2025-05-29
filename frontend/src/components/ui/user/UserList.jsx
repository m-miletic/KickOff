import React, { useState } from "react";
import useFetchUsers from "../../../hooks/users/useFetchUsers";
import { ROLES } from "../../../data/roles";
import { TbCaretUpDownFilled } from "react-icons/tb";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegEye } from "react-icons/fa";
import DropdownContent from "../../common/dropdown/DropdownContent";
import { DropdownButton } from "../../common/dropdown/DropdownButton";
import { DeleteUserModal } from "./modal/DeleteUserModal";
import Pagination from "../../common/navigation/Pagination";
import PreviewUserModal from "./modal/PreviewUserModal";


const UserList = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filter, setFilter] = useState({
    role: "USER",
    sortDirection: 'DESC',
    sortField: 'email',
    pageNumber: 1
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const { users, setUsers } = useFetchUsers(filter);

  const handleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSelectFilter = (type, value) => {
    setFilter((prevValues) => ({
      ...prevValues,
      [type]: value
    }));
    setIsDropdownOpen(false);
  };

  const handleSortDirection = (field) => {
    setFilter((prevValues) => ({
      ...prevValues,
      sortField: field,
      sortDirection: prevValues.sortDirection === 'ASC' ? 'DESC' : 'ASC'
    }));
  };


  const handlePreviewUSer = (user) => {
    setSelectedUser(user);
    setIsPreviewModalOpen(true);
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  return(
    <div>

      <DropdownButton
        toggleDropdown={() => handleDropdown()}
        text={filter.role}
        isOpen={isDropdownOpen}
      />

      {isDropdownOpen && (
        <DropdownContent
          value={ROLES}
          onSelect={handleSelectFilter}
        />
      )}

      <div className="text-white mt-2">

        <div className="flex justify-between bg-[#001E28] px-2 py-1.5 rounded-md text-xs xl:text-sm 2xl:text-base font-medium w-[340px] sm:w-[380px] lg:w-[530px] xl:w-[560px] 2xl:py-2.5">

          <div className="flex items-center">
            <span>Email</span>
            <TbCaretUpDownFilled
              onClick={() => handleSortDirection("email")}
              className="w-2.5 h-2.5 ml-1 cursor-pointer"/>
          </div>

          <div className="flex items-center mr-16">
            <span>Role</span>
            <TbCaretUpDownFilled
              onClick={() => handleSortDirection("role")}
              className="w-2.5 h-2.5 cursor-pointer ml-1"/>
          </div>

          <div>
            Action
          </div>

        </div>

        <div className="mt-2">
          {users && users.usersList.map((user) => {
            return(
              <div key={user.id} className="flex justify-between text-2xs xl:text-xs 2xl:text-sm px-1.5 py-1">
                <div>{user.email}</div>
                <div className="w-20 sm:w-auto text-center overflow-x-scroll sm:overflow-x-hidden">{user.role}</div>
                <div className="flex items-center space-x-1">
                  <div>
                    <button onClick={() => handlePreviewUSer(user)} className="flex items-center space-x-1 bg-transparent border border-gray-500 p-1 rounded-lg">
                      <span>Preview</span>
                      <span><FaRegEye /></span>
                    </button>
                  </div>
                  <div>
                    <button onClick={() => handleDeleteUser(user)} className="flex items-center space-x-1 bg-transparent border border-red-600 text-red-600 p-1 rounded-lg">
                      <span>Delete</span>
                      <span><RiDeleteBin6Line /></span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {isPreviewModalOpen && (
        <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black/30">
          <PreviewUserModal setIsModalOpen={setIsPreviewModalOpen} selectedUser={selectedUser} />
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black/30">
          <DeleteUserModal setIsModalOpen={setIsDeleteModalOpen} selectedUser={selectedUser} setUsers={setUsers} filter={filter} />
        </div>
      )}


   {/*  paginacija mi ne radi za sve komponente */}

      <div className='text-center mt-5'>
        <Pagination totalPages={users.totalPages} selectedFilters={filter} handleSelectFilter={handleSelectFilter} />
      </div>



    </div>
  );
}
export default UserList;