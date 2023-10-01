import React from "react";
import NavBar from "./NavBar";
import Hero from "./Hero";
import Ad from "./Ad";
import Footer from "./Footer";

const Home = () => {
  return (
    <div className="home">
      <NavBar />
      <Hero />
      <Ad />
      <Footer />
    </div>
  );
};

export default Home;
