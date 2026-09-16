import React from "react";
import "../../css/Home.css";

const Footer = () => {
  return (
    <>
      <footer className="fixed-bottom bg-white p-2 ">
        <p>© 2023 HomeHub, Inc.</p>
        <ul className="footerlist">
          <li>Privacy</li>
          <li>Terms</li>
          <li>Sitemap</li>
          <li>Company details</li>
        </ul>
        <p>English(IN) ₹ INR</p>
      </footer>
    </>
  );
};

export default Footer;
