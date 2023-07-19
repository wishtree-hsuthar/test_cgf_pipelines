import { IconButton, InputAdornment } from "@mui/material";
import React from "react";

const CustomInputAdornment = ({show,onClickHandler,mouseDownHandler}) => {
  return (
    <InputAdornment position="end">
      <IconButton
        aria-label="toggle password visibility"
        onClick={onClickHandler}
        onMouseDown={mouseDownHandler}
        edge="end"
        className="eye-btn"
      >
        {show ? (
          <img
            src={process.env.PUBLIC_URL + "/images/visibleicon.svg"}
            alt=""
            className="img-fluid"
          />
        ) : (
          <img
            src={process.env.PUBLIC_URL + "/images/non-visibleicon.svg"}
            alt=""
            className="img-fluid"
          />
        )}
      </IconButton>
    </InputAdornment>
  );
};

export default CustomInputAdornment;
