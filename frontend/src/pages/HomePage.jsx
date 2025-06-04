import Navbar from "../components/common/navigation/Navbar";
import Standings from "../components/ui/Standings";

const HomePage = () => {
  
  return(
    <div>
      <div><Navbar /></div>
      <div className="flex justify-center pt-32"><Standings /></div>
    </div>
  );
}

export default HomePage;