import React, { useState } from "react";
import useFetchUsers from "../../../hooks/users/useFetchUsers";
import { ROLES } from "../../../data/roles";
import DropdownContent from "../../common/dropdown/DropdownContent";
import { DropdownButton } from "../../common/dropdown/DropdownButton";
import Pagination from "../../common/navigation/Pagination";
import UserCard from "./card/UserCard";

const UserList = () => {

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [filter, setFilter] = useState({
    role: "ALL", // samo za inicijalni prikaz
    sortDirection: 'DESC',
    sortField: 'username',
    pageNumber: 1
  });

  const { users, setUsers, error } = useFetchUsers(filter);

  console.log("Users: ", users)

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSelectFilter = (type, value) => {
    setFilter((prevValues) => ({
      ...prevValues,
      [type]: value
    }));
    setIsDropdownOpen(false);
  };

/*   const handleSortDirection = (field) => {
    setFilter((prevValues) => ({
      ...prevValues,
      sortField: field,
      sortDirection: prevValues.sortDirection === 'ASC' ? 'DESC' : 'ASC'
    }));
  };
 */
  return (

    <div className="px-20 py-6">

      <DropdownButton
        title={filter.role}
        isDropdownOpen={isDropdownOpen}
        toggleDropdown={toggleDropdown}
      />

      {isDropdownOpen && (
        <DropdownContent
          values={ROLES}
          filterType={'role'}
          onSelect={handleSelectFilter}
        />
      )}

      <div className="text-black mt-2">

        <div className="max-w-[750px] mx-auto">
          <div className="grid grid-cols-2 gap-4">
            {users?.usersList?.length > 0 &&
              users.usersList.map((user) => (
                <UserCard key={user.id} user={user} setUsers={setUsers} />
              ))}
          </div>

          <div className="text-center mt-6">
            <Pagination
              totalPages={users.totalPages}
              selectedFilters={filter}
              handleSelectFilter={handleSelectFilter}
              navButtonStyle="text-black w-5 h-5 px-4"
              totalPagesStyle="text-black"
            />
          </div>
        </div>

      </div>

    </div>
  );
}
export default UserList;