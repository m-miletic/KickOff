import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";

import homepageBackground from "../../../assets/homepageBackground.jpg";
import homepageBackground1 from "../../../assets/homepageBackground1.jpg";
import homepageBackground2 from "../../../assets/homepageBackground2.jpg";
import homepageBackground4 from '../../../assets/homepageBackground4.jpg'
import homepageBackground5 from '../../../assets/homepageBackground5.jpg'
import homepageBackground6 from '../../../assets/homepageBackground6.jpg'
import homepageBackground8 from '../../../assets/homepageBackground8.jpg'
import homepageBackground9 from '../../../assets/homepageBackground9.jpg'
import { fetchActiveAndUpcomingTournaments } from "../../../service/tournamentService";

const Carousel = () => {
  const images = [homepageBackground, homepageBackground1, homepageBackground2, homepageBackground4, homepageBackground5, homepageBackground6, homepageBackground8, homepageBackground9];

  const [tournaments, setTournaments] = useState()

  useEffect(() => {
    const fetchAvailableTournaments = async () => {
      try {
        const response = await fetchActiveAndUpcomingTournaments()
        setTournaments(response.data)
      } catch (error) {
        console.log("error iz komponente - ", error.message)
      }
    }

    fetchAvailableTournaments()
  }, [])

  console.log("Tournaments: ", tournaments)


  return (
    <div className="my-20">
      <div className="mx-auto w-[1300px]">
        <Swiper
          modules={[Autoplay]}
          spaceBetween={60}
          slidesPerView={3}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          grabCursor={true}
          loop={true}
        >
          {tournaments?.map((tournament) => (
            <SwiperSlide key={tournament.id}>
              <div className="bg-transparent opacity-60">
                <img
                  className="w-full h-[300px] object-cover rounded-md shadow-lg hover:p-1"
                  alt={`Slide ${tournament.id}`}
                  src={homepageBackground}
                />


              
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Carousel;
