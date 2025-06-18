import Carousel from "../components/common/carousel/Carousel";
import Footer from "../components/common/footer/Footer";
import Navbar from "../components/common/navigation/Navbar";
import Standings from "../components/ui/Standings";

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex justify-center pt-20 xl:pt-12">
        <Standings />
      </main>
      
      <Carousel />
      
      <Footer />
    </div>
  );
}

export default HomePage;