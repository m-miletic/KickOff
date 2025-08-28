import React from "react";
import Navbar from "../components/common/navigation/Navbar";
import Footer from "../components/common/footer/Footer";
import { Outlet } from "react-router-dom";

const OrganizerPage = () => {
  return(
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}
export default OrganizerPage;