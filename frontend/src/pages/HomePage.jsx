import Footer from "../components/common/footer/Footer";
import Navbar from "../components/common/navigation/Navbar";
import Carousel from "../components/common/carousel/Carousel";
import Standings from "../components/ui/Standings";
import homepageBackground from '../assets/homepageBackground.jpg'
import homepageBackground1 from '../assets/homepageBackground1.jpg'
import homepageBackground2 from '../assets/homepageBackground2.jpg'
import homepageBackground3 from '../assets/homepageBackground3.jpg'
import homepageBackground4 from '../assets/homepageBackground4.jpg'
import homepageBackground5 from '../assets/homepageBackground5.jpg'
import homepageBackground6 from '../assets/homepageBackground6.jpg'
import homepageBackground8 from '../assets/homepageBackground8.jpg'
import homepageBackground9 from '../assets/homepageBackground9.jpg'
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


  console.log("selected tournament: ", selectedTournament)



  return (
    <div id="homepage" className="relative min-h-screen flex flex-col bg-cover bg-center bg-no-repeat bg-scroll text-white" /* style={{ backgroundImage: `url(${homepageBackground8})` }} */>
      {/* Dark overlay */}
      {/* <div className="absolute inset-0 bg-black opacity-60 z-0"></div> */}

      <div className="relative z-10">

        <Navbar />

        <div id="standings-section" className="mt-14">
          <Standings selectedTournament={selectedTournament} setSelectedTournament={setSelectedTournament} />
        </div>

        {/* <div id="swiper-section">
          <Carousel />
        </div> */}

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