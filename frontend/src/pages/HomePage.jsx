import Footer from "../components/common/footer/Footer";
import Navbar from "../components/common/navigation/Navbar";
import Standings from "../components/ui/standings/Standings";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import MatchHub from "../components/ui/match/MatchHub";

const HomePage = () => {
  const location = useLocation()

  const [selectedTournament, setSelectedTournament] = useState()

  useEffect(() => {
    const scrollToId = location.state?.scrollTo
    if (scrollToId) {
      const section = document.getElementById(scrollToId)
      if (section) {
        section.scrollIntoView({ behavior: "smooth" })
      }
    }
  }, [location.state])

  return (
    <div id="homepage" className="relative min-h-screen flex flex-col bg-cover bg-center bg-no-repeat bg-scroll text-white">
      <div className="relative z-10">
        <Navbar />

        <div id="standings-section" className="mt-14">
          <Standings selectedTournament={selectedTournament} setSelectedTournament={setSelectedTournament} />
        </div>

        <div id="match-hub" className="mt-14"> 
          <MatchHub selectedTournament={selectedTournament} />
        </div>

        <div id="footer-section">
          <Footer />
        </div>

      </div>
    </div>
  );
}
export default HomePage;