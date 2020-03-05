import "./Logo.css";
import logo from "../../assents/img/logo_transparent.png";
import React from "react";

export default props => (
  <aside className="logo">
    <a href="/" className="logo">
      <img src={logo} alt="logo" srcset="" />
    </a>
  </aside>
);
