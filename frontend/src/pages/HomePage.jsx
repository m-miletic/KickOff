import { jwtDecode } from "jwt-decode";
import Navbar from "../components/common/navigation/Navbar";
import Standings from "../components/ui/Standings";

const HomePage = () => {

    let decodedJwt = null;
    const jwt = localStorage.getItem('token');
    if (jwt) {
      try {
        decodedJwt = jwtDecode(jwt);
      } catch (error) {
        console.error("Invalid JWT:", error);
      }
    }

    console.log("decodedJwt: ", decodedJwt);
  


  return(
    <div>
      <div>
        <Navbar decodedJwt={decodedJwt} />
      </div>
      <div className="flex justify-center pt-32">
        <Standings />
      </div>
      
    </div>
  );
}

export default HomePage;