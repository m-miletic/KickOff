import axios from "axios";

class UserService {
  static BASE_URL = "http://localhost:8080";

  static async login(email, password) {
    try{
      const response = await axios.post(`${UserService.BASE_URL}/auth/login`, {email, password});
      return response.data;
    }catch(err){
      throw err;
    }
  }

  static async register(userData) {
    try {
      const response = await axios.post(`${UserService.BASE_URL}/auth/register`, userData);
      return response.data;
    } catch (err) {
        throw err;
    }
  };


  /*

  export const getAllUsers = async (token) => {
    try { 
      const response = await axios.get(`${BASE_URL}/auth/get-all-users` ,{
        headers: {Authorization: `Bearer ${token}`}
      });
      return response.data;
    } catch (err) {
        throw err;
    }
  };

  export const getUserById = async (userId, token) => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/get-user/${userId}`,{
        headers: {Authorization: `Bearer ${token}`}
      });
      return response;
    } catch (err) {
        throw err;
    }
  };

  export const updateUser = async (userId, updatedUserData, token) => {
    try {
      const response = await axios.put(`${BASE_URL}/admin/update/${userId}`, updatedUserData, {
        headers: {Authorization: `Bearer ${token}`}
      });
      return response.data;
    } catch (err) {
        throw err;
    }
  };

  export const deleteUser = async (userId, token) => {
    try {
      const response = await axios.delete(`${BASE_URL}/admin/delete/${userId}`, {
        headers: {Authorization: `Bearer ${token}`}
      });
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  export const getLoggedInUser = async (token) => {
    try {
      const response = await axios.get(`${BASE_URL}/adminuser/get-profile`, {
        headers: {Authorization: `Bearer ${token}`}
      });
      return response.data;
    } catch (err) {
        throw err;
    }
  };

  export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }; */


  // sljedece 2 metode koriste se u refreshAuthState - koja je uloga ?

  static isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token;
  };

  static isAdmin = () => {
    const role = localStorage.getItem('role');
    return role && role.toUpperCase() === 'ADMIN';
  };

/*   export const isUser = () => {
    const role = localStorage.getItem('role');
    return role && role.toUpperCase() === 'USER';
  }; */
}
export default UserService;