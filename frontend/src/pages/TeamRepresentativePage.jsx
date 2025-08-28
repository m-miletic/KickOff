import React from "react";
import Navbar from "../components/common/navigation/Navbar";
import Footer from "../components/common/footer/Footer";
import { Outlet } from "react-router-dom";

const TeamRepresentativePage = () => {
  return (
    <> 
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};
export default TeamRepresentativePage;
