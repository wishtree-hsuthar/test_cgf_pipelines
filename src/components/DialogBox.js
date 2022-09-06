import React from "react";
import PropTypes from 'prop-types'
import { Backdrop, Box, Modal, Fade } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const DialogBox = ({
  title,
  info1,
  info2,
  primaryButtonText,
  secondaryButtonText,
  onPrimaryModalButtonClickHandler,
  onSecondaryModalButtonClickHandler,
  openModal,
  setOpenModal,
}) => {
  // css for modal
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  //modal button close
  const handleClose = () => {
    setOpenModal(false);
  };

  //on Primary modal button click handler to call function written in tester component
  const onPrimaryButtonClickHandler = () => {
    onPrimaryModalButtonClickHandler();
  };

  // on Secondary modal button click handler to call function written in tester component
  const onSecondaryButtonClickHandler = () => {
    onSecondaryModalButtonClickHandler();
  };
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={openModal}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      className="popup-blk"
    >
      <Fade in={openModal}>
        <Box sx={style} className="popup-box">
          <div id="transition-modal-title" className="popup-ttl-blk">
            <h2 className="popup-ttl heading2">
              {title}
            </h2>
            <span className="popup-close-icon" onClick={handleClose}>
              <CloseIcon />
            </span>
          </div>
          <div id="transition-modal-description" className="popup-body">
            <div className="popup-content-blk text-center">
              {info2 && <p>{info1}</p>}
              {info2 && <p>{info2}</p>}
              <div className="form-btn flex-center">
                <button
                  type="submit"
                  onClick={onSecondaryButtonClickHandler}
                  className="secondary-button mr-10"
                >
                  {secondaryButtonText}
                </button>
                <button
                  type="submit"
                  onClick={onPrimaryButtonClickHandler}
                  className="primary-button"
                >
                  {primaryButtonText}
                </button>
              </div>
            </div>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
};

export default DialogBox;


DialogBox.propTypes = {
  title : PropTypes.string,
  info1: PropTypes.string,
  info2: PropTypes.string,
  primaryButtonText: PropTypes.string,
  secondaryButtonText: PropTypes.string,
  onPrimaryModalButtonClickHandler: PropTypes.func,
  onSecondaryModalButtonClickHandler: PropTypes.func,
  openModal:PropTypes.bool,
  setOpenModal:PropTypes.func,
};
 