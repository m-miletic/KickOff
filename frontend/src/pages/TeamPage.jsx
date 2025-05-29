import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/common/navigation/Navbar";
import image from '../../public/kantrida.jpg'
import grb from '../../public/Hajduk_Grb.jpg'

const TeamPage = () => {
  const [team, setTeam] = useState([]);
  const { id } = useParams();
  useEffect(() => {
    const getTeamById = async () => {
      const fetchedTeam = await axios.get(`http://localhost:8080/teams/${id}`);
      console.log(fetchedTeam.data.teamName)
      setTeam(fetchedTeam.data);
    };
    getTeamById();
  }, [id]);

  return(
    <section className="bg-black text-white">
      <section className="pl-4 pt-36 sm:pl-12 sm:pt-44 md:pl-18 md:pt-48 lg:pl-20 lg:pt-52 xl:pl-28 xl:pt-56 2xl:pl-36 2xl:pt-60">
        <div className="w-[300px] flex p-6 bg-[#001E28] rounded-lg shadow-sm md:w-[700px] lg:w-[930px]">
          <div>
            <a href="#">
              <img className="size-11 rounded-lg" src={grb} alt="" />
            </a>
          </div>
          <div className="ml-4 ">
            {team.teamName}
          </div>
        </div>
      </section>
      <section className="pl-4 pb-4 sm:pl-12 md:pl-18 lg:pl-20 xl:pl-28 2xl:pl-36">
        <Navbar />
          <h5 className="py-4 px-6 text-2xl font-bold tracking-tight text-white">News</h5>
          <div className="w-[300px] px-6 pt-4 pb-10 bg-[#001E28] rounded-lg shadow-sm md:w-[700px] md:grid md:grid-cols-2 md:pb-12 lg:w-[930px] lg:grid lg:grid-cols-3">
            <div className="text-black max-w-sm p-6 my-2 bg-[#001E28] 0 rounded-lg shadow-sm">
              <img className="rounded-lg" src={image} alt="" />
              <h5 className="text-white mt-1">News title #1</h5>
            </div>
            <div className="text-black max-w-sm p-6 my-2 bg-[#001E28] 0 rounded-lg shadow-sm">
              <img className="rounded-lg" src={image} alt="" />
              <h5 className="text-white mt-1">News title #2</h5>
            </div>
            <div className="text-black max-w-sm p-6 my-2 bg-[#001E28] 0 rounded-lg shadow-sm">
              <img className="rounded-lg" src={image} alt="" />
              <h5 className="text-white mt-1">News title #3</h5>
            </div>
          </div>
          <a href="#" className="inline-flex w-[200] absolute -mt-14 ml-10 items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ">
            More news
            <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
            </svg>
          </a>
      </section>

      <section className="">
        <div>
          test
        </div>
      </section>
    </section>
  );
}
export default TeamPage;