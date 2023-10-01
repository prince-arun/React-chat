import React from "react";
import { BsLinkedin, BsGithub } from "react-icons/bs";

const Footer = () => {
  return (
    <footer className="bg-dark text-center text-white py-3">
      <div className="container">
        <p>
          &copy; {new Date().getFullYear()} Chat Application. All rights
          reserved.
        </p>
        <div className="social-icons">
          <p>
            <BsLinkedin className="s-icon" />
            {"      "}
            <BsGithub className="s-icon" />
          </p>
          <p></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
