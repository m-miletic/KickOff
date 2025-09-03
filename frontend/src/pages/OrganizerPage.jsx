import React from "react";
import Navbar from "../components/common/navigation/Navbar";
import Footer from "../components/common/footer/Footer";
import { Outlet } from "react-router-dom";

const OrganizerPage = () => {
  return(
    <div className="relative min-h-screen">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}
export default OrganizerPage;