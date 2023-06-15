import React from "react";
import "./Landing.css";

function Landing() {
  return (
    <>
      <div className="landingPage"></div>
      <div className="tagLineContainer">
        <div className="tagLine">
          <p>Your Ultimate Task Management Solution!</p>
        </div>
        <div class="text-box">
          <a href="/home" class="btn btn-white btn-        animate">
            Continue
          </a>
        </div>
      </div>
    </>
  );
}

export default Landing;
