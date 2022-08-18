import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import ClearIcon from "@mui/icons-material/Clear";
import "./Toaster.css";
function Toaster({ titleMessage, descriptionMessage, messageType, myRef }) {
  const showToasts = () => {
    toast(customMsg, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  console.log("messageType", messageType);
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
          <div
            className={`toaster-ttl ${
              messageType === "success" && "toaster-ttl-success"
            }`}
          >
            {titleMessage.length >= 30
              ? `${titleMessage.slice(0, 30)}...`
              : titleMessage}
          </div>
        <p>
          {descriptionMessage.length >= 50
            ? `${descriptionMessage.slice(0, 50)}...`
            : descriptionMessage}
        </p>
      </div>
    </div>
  );
  myRef.current = showToasts;
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
