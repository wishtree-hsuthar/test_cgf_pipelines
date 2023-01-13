import CloseIcon from "@mui/icons-material/Close";
import { Backdrop, Box, Fade, Modal, Tooltip } from "@mui/material";
import PropTypes from "prop-types";
import React from "react";

const DialogBox = ({
    title,
    info1,
    info2,
    primaryButtonText,
    secondaryButtonText,
    onPrimaryModalButtonClickHandler,
    isDisabledPrimaryButton = false,
    onSecondaryModalButtonClickHandler,
    openModal,
    setOpenModal,
    isModalForm,
    handleCloseRedirect,
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
    const handleClose = (event, reason) => {
        if (reason && reason === "backdropClick") {
            return;
        }
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
    let dialogTitle = "";
    typeof title?.props?.children === "object"
        ? title?.props?.children?.map((value) => (dialogTitle += value))
        : (dialogTitle = title?.props?.children);
    // console.log("dialogTitle", dialogTitle);
    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={openModal}
            onClose={handleClose}
            closeAfterTransition
            disableEscapeKeyDown={isModalForm ? true : false}
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
            className="popup-blk"
        >
            <Fade in={openModal}>
                <Box sx={style} className="popup-box">
                <div className="popup-innerblk">
                    <div id="transition-modal-title" className="popup-ttl-blk">
                        {/* {console.log("title", title)} */}
                        {dialogTitle?.length <= 47 ? (
                            <h2 className="popup-ttl heading2">{title}</h2>
                        ) : (
                            <Tooltip title={dialogTitle}>
                                <h2 className="popup-ttl heading2">
                                    {" "}
                                    {dialogTitle?.slice(0, 50)}..."
                                </h2>
                            </Tooltip>
                        )}

                        <span
                            // hidden={isModalForm}
                            className="popup-close-icon"
                            onClick={
                                isModalForm ? handleCloseRedirect : handleClose
                            }
                        >
                            <CloseIcon />
                        </span>
                    </div>
                    <div
                        id="transition-modal-description"
                        className="popup-body"
                    >
                        <div className="popup-content-blk text-center">
                            {info1}
                            {isModalForm ? (
                                <form onSubmit={onSecondaryButtonClickHandler}>
                                    {info2}
                                </form>
                            ) : (
                                info2
                            )}
                            {/* {info2 && <p>{info2}</p>} */}
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
                                    disabled={isDisabledPrimaryButton}
                                    className="primary-button"
                                >
                                    {primaryButtonText}
                                </button>
                            </div>
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
    title: PropTypes.object,
    info1: PropTypes.object,
    info2: PropTypes.object,
    primaryButtonText: PropTypes.string,
    secondaryButtonText: PropTypes.string,
    onPrimaryModalButtonClickHandler: PropTypes.func,
    onSecondaryModalButtonClickHandler: PropTypes.func,
    openModal: PropTypes.bool,
    setOpenModal: PropTypes.func,
    isModalForm: PropTypes.bool,
};
