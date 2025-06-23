import axios from "axios";

class AuthService {
  static BASE_URL = "http://localhost:8080/auth";

  static async login(username, password) {
    try{
      const response = await axios.post(`${AuthService.BASE_URL}/login`, {username, password});
      return response.data;
    }catch(err){
      throw err;
    }
  }
  

  static async register(userData) {
    try {
      const response = await axios.post(`${AuthService.BASE_URL}/register`, userData);
      return response.data;
    } catch (err) {
        throw err;
    }
  };

  static async logout(refreshToken) {
    try {
      const response = await axios.delete(`${AuthService.BASE_URL}/logout`, {
        data: {refreshToken}
      });
    } catch (error) {
      throw error;
    }
  };

  // sljedece 2 metode koriste se u refreshAuthState - koja je uloga ?

  static isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token;
  };

  static isAdmin = () => {
    const role = localStorage.getItem('role');
    return role && role.toUpperCase() === 'ADMIN';
  };

}
export default AuthService;