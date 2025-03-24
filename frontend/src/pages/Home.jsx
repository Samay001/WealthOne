import React from "react";
import Navbar from "../components/Navbar";
import Landing from "../components/Landing";
import Content from "../components/Content";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div>
      <Navbar />
      <Landing />
      <Content />
      <Footer />
    </div>
  );
};

export default Home;
