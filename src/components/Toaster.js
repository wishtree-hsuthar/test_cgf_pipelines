import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import ClearIcon from "@mui/icons-material/Clear";
import "./Toaster.css";
function Toaster({ titleMessage, descriptionMessage, messageType, myRef }) {
  const showToasts = () => {
    toast(customMsg, {
      position: "bottom-center",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  const customMsg = () => (
    <div
      className={`toaster-blk flex-start ${
        messageType === "success" && "toaster-blk-success"
      }`}
    >
      <div
        className={`toaster-left ${
          messageType === "success" && "toaster-left-success"
        }`}
      >
        <div className="toaster-icon">
          {messageType === "success" && <CheckRoundedIcon />}
          {messageType === "error" && <ClearIcon />}
          {/* <CheckRoundedIcon /> */}
        </div>
      </div>
      <div className="toaster-right">
        {/* <div
          className={`toaster-ttl ${
            messageType === "success" && "toaster-ttl-success"
          }`}
        >
          {titleMessage}
        </div> */}
        <p>{descriptionMessage}</p>
      </div>
    </div>
  );
  useEffect(() => {
    myRef.current = showToasts;
  }, [showToasts, myRef]);
  return (
    <div className="toaster-sect">
      <button style={{ display: "none" }}>Show Toast !</button>
      <ToastContainer
        className={`toaster-wrap ${
          messageType === "success" && "toaster-wrap-success"
        } `}
      />
    </div>
  );
}

export default Toaster;

Toaster.propTypes = {
  titleMessage: PropTypes.string.isRequired,
  descriptionMessage: PropTypes.string.isRequired,
  messageType: PropTypes.string.isRequired,
  myRef: PropTypes.object.isRequired,
};
