import React from "react";
import Loader2 from "../assets/Loader/Loader2.svg";

function Loader() {
  return (
    <div className="loader-blk">
      <div className="loader-image-blk">
        <img src={Loader2} alt="Loading" />
      </div>
    </div>
  );
}

export default Loader;
