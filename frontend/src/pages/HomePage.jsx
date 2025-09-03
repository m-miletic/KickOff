import Footer from "../components/common/footer/Footer";
import Navbar from "../components/common/navigation/Navbar";
import Standings from "../components/ui/standings/Standings";
import { useState } from "react";
import MatchHub from "../components/ui/match/MatchHub";

const HomePage = () => {
  const [selectedTournament, setSelectedTournament] = useState(null);

  return (
    <div id="homepage">
      <Navbar />

      <div>
        <div id="leaderboard" className="pt-14">
          <Standings selectedTournament={selectedTournament} setSelectedTournament={setSelectedTournament} />
        </div>

        <div id="match-hub" className="pt-6">
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