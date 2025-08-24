import Footer from "../components/common/footer/Footer";
import Navbar from "../components/common/navigation/Navbar";
import Standings from "../components/ui/standings/Standings";
import { useState } from "react";
import MatchHub from "../components/ui/match/MatchHub";

const HomePage = () => {
  const [selectedTournament, setSelectedTournament] = useState()

  return (
    <div id="homepage" className="relative min-h-screen flex flex-col bg-cover bg-center bg-no-repeat bg-scroll text-white">
      <div className="relative z-10">
        <Navbar />

        <div id="leaderboard" className="mt-14">
          <Standings selectedTournament={selectedTournament} setSelectedTournament={setSelectedTournament} />
        </div>

        <div id="match-hub" className="mt-14"> 
          <MatchHub selectedTournament={selectedTournament} />
        </div>

        <div id="about-us">
          <Footer />
        </div>

      </div>
    </div>
  );
}
export default HomePage;