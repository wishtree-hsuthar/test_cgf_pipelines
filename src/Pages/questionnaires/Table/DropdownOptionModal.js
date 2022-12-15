import { Backdrop, Box, Fade, Modal, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, {useState} from "react";

/* Popup */
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

const DropdownOptionModal = ({
  openModal,
  setOpenModal,
  questionnaire,
  setQuestionnaire,
  sectionIndex,
  columnId,
  tableErr,
  setTableErr,
}) => {
  
  // const questionnaireCopy = Object.assign(questionnaire,{})
  // const  questionnaireCopy= structuredClone( questionnaire)
  const [tableOptionErr, setTableOptionErr] = useState("")
  const onAddOptionClickHandler = () => {
    let tempQuestionnaire = { ...questionnaire };
    tempQuestionnaire.sections[sectionIndex].columnValues[
      columnId
    ].options?.push("");
    setQuestionnaire(tempQuestionnaire);
  };
  const onTableLayoutOptionChangeHandler = (e, optionIdx) => {
    const { name, value } = e.target;
    let tempQuestionnaire = { ...questionnaire };
    tempQuestionnaire.sections[sectionIndex].columnValues[columnId].options[
      optionIdx
    ] = value;
    setQuestionnaire(tempQuestionnaire);
  };
  const onTableLayoutOptionBlurHandler = (e, optionIdx) => {
    const { name, value } = e.target;
    let tempQuestionnaire = { ...questionnaire };
    tempQuestionnaire.sections[sectionIndex].columnValues[columnId].options[
      optionIdx
    ] = value?.trim();
    setQuestionnaire(tempQuestionnaire);
  }
  const onTableLayoutOptionDeleteHandler = (optionIdx) => {
    let tempQuestionnaire = { ...questionnaire };
    tempQuestionnaire?.sections[sectionIndex]?.columnValues[
      columnId
    ]?.options?.splice(optionIdx, 1);
    setQuestionnaire(tempQuestionnaire);
  };
  const onOptionSubmitHandler = () => {
    let tempQuestionnaire = {...questionnaire}
    let isError = false
    tempQuestionnaire.sections[sectionIndex].columnValues[
      columnId
    ].options?.forEach(option => {
        if(option)  return
        isError = true
        setTableOptionErr("Option required")
    });
    !isError && setOpenModal(false);
  };
  const onCancelButtonClickHandler = () => {
    let tempQuestionnaire = {...questionnaire}
    tempQuestionnaire.sections[sectionIndex].columnValues[columnId].options = ["", ""]
    tempQuestionnaire.sections[sectionIndex].columnValues[columnId].columnType = "textbox"

    setQuestionnaire(tempQuestionnaire)
    setOpenModal(false)
  }
  
  // console.log("questionnaire:", questionnaire);
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={true}
      // onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      className="popup-blk"
      style={{ overflow: 'scroll' }}
    >
      <Fade in={true}>
        <Box sx={style} className="popup-box">
          <div className="popup-innerblk">
          <div id="transition-modal-title" className="popup-ttl-blk">
            <h2 className="popup-ttl heading2">Create Custom List Dropdown</h2>
            <span className="popup-close-icon" onClick={onCancelButtonClickHandler}><CloseIcon/></span>
          </div>
          <div id="transition-modal-description" className="popup-body">
            <div className="popup-content-blk">
              <div className="custom-list-sect">
                {/* <div className='subheading mb-20'>Create custom list</div> */}
                {questionnaire?.sections[sectionIndex]?.columnValues[
                  columnId
                ]?.options?.map((option, optionIdx) => (
                  <div className="form-group" key={optionIdx}>
                    <div className="que-checkbox-wrap">
                      <div className="que-checkbox-blk que-dropdown-blk">
                        <TextField
                          className={`input-field que-input-type ${tableOptionErr && !option && "input-error"}`}
                          value={option}
                          onChange={(e) =>
                            onTableLayoutOptionChangeHandler(e, optionIdx)
                          }
                          onBlur={(e) => onTableLayoutOptionBlurHandler(e, optionIdx)}
                          id="outlined-basic"
                          helperText={(tableOptionErr && !option) ? "Enter the option" : " "}
                          placeholder={`Enter option value`}
                          variant="outlined"
                        />
                      </div>
                      {questionnaire?.sections[sectionIndex]?.columnValues[
                        columnId
                      ]?.options?.length > 2 && (
                        <div
                          className="que-input-type-close"
                          onClick={() =>
                            onTableLayoutOptionDeleteHandler(optionIdx)
                          }
                        >
                          <CloseIcon />
                        </div>
                      )}
                    </div>
                    {/* <TextField className='input-field' id="outlined-basic" placeholder='Dropdown value1' variant="outlined" /> */}
                  </div>
                ))}
                <div className="add-dropdown-btnblk mb-30">
                  <span
                    className="addmore-icon"
                    // onClick={onAddOptionClickHandler}
                  >
                    <i className="fa fa-plus"></i>
                  </span>{" "}
                  <span onClick={onAddOptionClickHandler}>Add Dropdown</span>
                </div>
              </div>
              <div className="form-btn flex-center text-center">
                <button className="secondary-button mr-10" onClick={onCancelButtonClickHandler}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="primary-button"
                  onClick={onOptionSubmitHandler}
                >
                  Save
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

export default DropdownOptionModal;
