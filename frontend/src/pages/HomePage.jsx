import Footer from "../components/common/footer/Footer";
import Navbar from "../components/common/navigation/Navbar";
import Standings from "../components/ui/standings/Standings";
import { useState } from "react";
import MatchHub from "../components/ui/match/MatchHub";

const HomePage = () => {
  const [selectedTournament, setSelectedTournament] = useState(null);

  return (
    <div id="homepage">
      <div className="relative z-10">
        <Navbar />

        <div>
          <div className="pt-14 w-screen">
            <Standings selectedTournament={selectedTournament} setSelectedTournament={setSelectedTournament} />
          </div>

          <div className="pt-6 pb-20 w-screen">
            <MatchHub selectedTournament={selectedTournament} />
          </div>

          <div id="about-us">
            <Footer />
          </div>
        </div>




{/*         <div id="leaderboard" className="mt-14">
          <Standings selectedTournament={selectedTournament} setSelectedTournament={setSelectedTournament} />
        </div>

        <div id="match-hub" className="mt-14"> 
          <MatchHub selectedTournament={selectedTournament} />
        </div>

        <div id="about-us">
          <Footer />
        </div> */}

      </div>
    </div>
  );
}
export default HomePage;