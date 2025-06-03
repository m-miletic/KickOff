import { useEffect, useState } from "react";
import {fetchUsers} from "../../service/usersService";

const useFetchUsers = (filter) => {
  const [users, setUsers] = useState({
    usersList: [],
    totalPages: 0
  });

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await fetchUsers(filter);
        setUsers(response.data);
      } catch (error) {
        console.log("error: ", error);
      }
    }
    getUsers();
  }, [filter]);

  return {users, setUsers};
};
export default useFetchUsers;