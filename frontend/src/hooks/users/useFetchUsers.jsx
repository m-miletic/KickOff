import { useEffect, useState } from "react";
import {fetchUsers} from "../../service/usersService";

const useFetchUsers = (filter) => {
  const [users, setUsers] = useState({
    usersList: [],
    totalPages: 0
  });

  const [error, setError] = useState("")

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await fetchUsers(filter);
        setUsers(response.data);
      } catch (error) {
        setError(error.data.message)
      }
    }
    getUsers();
  }, [filter]);

  return {users, setUsers, error};
};
export default useFetchUsers;