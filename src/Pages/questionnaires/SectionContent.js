import {
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
  Switch,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { privateAxios } from "../../api/axios";
import { ADD_QUESTIONNAIRE } from "../../api/Url";
import { useNavigate, useParams } from "react-router-dom";
import DialogBox from "../../components/DialogBox";
import Questions from "./Questions";
import useCallbackState from "../../utils/useCallBackState";
import Toaster from "../../components/Toaster";

const SectionContent = ({
  value,
  questionnaire,
  setQuestionnaire,
  uuid,
  setValue,
  index,
  section,
  id,
  globalSectionTitleError,
  setGlobalSectionTitleError,
}) => {
  const navigate = useNavigate();
  // state to handle question level erros
  const [err, setErr] = useState({ questionTitle: "", option: "" });
  const ITEM_HEIGHT = 22;

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5,
      },
    },
  };
  //Refr for Toaster
  const myRef = React.useRef();
  //Toaster Message setter
  const [toasterDetails, setToasterDetails] = useCallbackState({
    titleMessage: "",
    descriptionMessage: "",
    messageType: "success",
  });
  //method to call all error toaster from this method
  const setErrorToaster = (error) => {
    console.log("error",error)
    setToasterDetails(
      {
        titleMessage: "Error",
        descriptionMessage:
          error?.response?.data?.message &&
          typeof error.response.data.message === "string"
            ? error.response.data.message
            : "Something Went Wrong!",
        messageType: "error",
      },
      () => myRef.current()
    );
  };
  // console.log("global title error", globalSectionTitleError);
  const onDialogPrimaryButtonClickHandler = () => {
    deleteSection(uuid);
  };
  const onDialogSecondaryButtonClickHandler = () => {
    setOpenDialog(false);
  };
  const deleteSection = (uuid) => {
    let tempQuestionnare = { ...questionnaire };

    let tempSections = tempQuestionnare.sections.filter(
      (section) => section.uuid !== uuid
    );

    // console.log("filter sections", tempQuestionnare);
    // console.log("filter sections", tempSections);
    // console.log("filter sections id", uuid);
    setQuestionnaire({
      ...tempQuestionnare,
      sections: tempSections,
    });
    let newObj = {
      ...tempQuestionnare,
      sections: tempSections,
    };

    saveSection(newObj);

    setValue(0);
    setOpenDialog(false);
  };

  const validateSection = () => {
    let countError = 0;
    //Rajkumar's save section
    let tempError = {
      questionTitle: "",
      option: "",
    };
    questionnaire?.sections[index]?.questions?.map((question, questionIdx) => {
      if (question?.questionTitle === "") {
        console.log("is Error");
        tempError["questionTitle"] = "Enter question title";
        countError++
      }
      //   console.log("question in validate section map",question)
      if (
        ["dropdown", "checkbox", "radioGroup"].includes(question?.inputType)
      ) {
        question?.options?.map((option) => {
          if (option === "") {
            tempError["option"] = "Enter option";
            countError++
          }
        });
      }
    });

    setErr({ ...tempError });
    //Madhav's save section
    // console.log("questionnaire", questionnaire);
    
    if(questionnaire?.title === ""){
      setGlobalSectionTitleError({ errMsg: "Section title required" });
      countError++
    } 
    for (let i = 0; i < questionnaire.sections.length; i++) {
      if (questionnaire.sections[i].sectionTitle === "") {
        setGlobalSectionTitleError({
          errMsg: "Section title required",
        });
        // console.log("in validate section for block");
        setValue(i);
        countError++;
        return false;
      }
    }
    if (countError === 0) {
      return true;
    }
      return false
  };

  const handleStatusChange = (e) => {
    console.log("inside Status change handler")
    const { name, value } = e.target;
    let tempQuestionnare = { ...questionnaire };
    if (value === "active") {
      // console.log(
      //   "inside if condition",
      //   tempQuestionnare.sections[index][name]
      // );
      tempQuestionnare.sections[index].isActive = true;
    }
    if (value === "inActive") tempQuestionnare.sections[index].isActive = false;
    setQuestionnaire(tempQuestionnare);
  };
  const handleInputSection = (e) => {
    const { name, value } = e.target;
    let tempQuestionnare = { ...questionnaire };

    tempQuestionnare.sections[index][name] = value;
    //   value === "active" ? true : value === "inActive" ? false : value;
    setQuestionnaire(tempQuestionnare);
    // console.log("Name ", name);
    // console.log("Value ", value);
  };
  const handleSubmitSection = (e) => {
    e.preventDefault();
    validateSection() && saveSection();
    // console.log("questionnaire after submiting questionnaire", questionnaire);
  };

  const params = useParams();
  const [openDialog, setOpenDialog] = useState(false);

  const saveSection = async (questionnaireObj) => {
    try {
      const response = await privateAxios.post(
        ADD_QUESTIONNAIRE,
        questionnaireObj ? questionnaireObj : questionnaire
      );
      // console.log("response from save section", response);
      if (response.status === 201) {
        const fetch = async () => {
          try {
            const response = await privateAxios.get(
              `http://localhost:3000/api/questionnaires/${params.id}`
            );
            // console.log("response from fetch questionnaire", response);
            setQuestionnaire({ ...response.data });
          } catch (error) {
            setErrorToaster(error)
            console.log("error from fetch questionnaire", error);
          }
        };
        fetch();
      }
    } catch (error) {
      setErrorToaster(error)
      console.log("error from section component", error);
    }
  };
  const onCancelClickHandler = () => {
    return navigate("/questionnaires");
  };
  const [sectionObj, setSectionObj] = useState({ ...section });
  // console.log("questionnaire after submiting questionnaire", sectionObj);
  console.log("Questionnaire: ", questionnaire);
  return (
    // <div className="member-info-wrapper table-content-wrap table-footer-btm-space">
    <div className="sect-form-card-wrapper">
      <Toaster
        myRef={myRef}
        titleMessage={toasterDetails.titleMessage}
        descriptionMessage={toasterDetails.descriptionMessage}
        messageType={toasterDetails.messageType}
      />
      <DialogBox
        title={<p>Delete Section "{section?.sectionTitle}"</p>}
        info1={
          <p>
            On deleting all the details of this section would get deleted and
            this will be an irreversible action, Are you want to remove the
            section name?
          </p>
        }
        info2={
          <p>
            Are you sure you want to delete <b>{section?.sectionTitle}</b>?
          </p>
        }
        primaryButtonText="Delete"
        secondaryButtonText="Cancel"
        onPrimaryModalButtonClickHandler={onDialogPrimaryButtonClickHandler}
        onSecondaryModalButtonClickHandler={onDialogSecondaryButtonClickHandler}
        openModal={openDialog}
        setOpenModal={setOpenDialog}
      />
      <div className="sect-form-card-info">
        <div className="sect-form-innercard-blk">
          <div className="sect-ttl-blk flex-between">
            <div className="sect-leftblk">
              {/* <h2 className="subheading">
                                {`Section ${value}`}{" "}
                            </h2> */}
            </div>
            <div className="sect-rightblk">
              <div className="sect-ttl-right-iconblk">
                {/* <span className="sect-icon-blk add-sect-iconblk mr-40">
                                    <img
                                        src={
                                            process.env.PUBLIC_URL +
                                            "/images/add-section-icon.svg"
                                        }
                                        alt=""
                                    />
                                </span> */}
                {questionnaire.sections.length > 1 && (
                  <span className="sect-icon-blk delete-iconblk">
                    <img
                      onClick={() => setOpenDialog(true)}
                      src={process.env.PUBLIC_URL + "/images/delete-icon.svg"}
                      alt=""
                    />
                  </span>
                )}
              </div>
            </div>
          </div>
          <form>
            <div className="sect-form-card-blk">
              <div className="sect-form-card-innerblk flex-between">
                <div className="sect-card-form-leftfield">
                  <div className="form-group">
                    <label htmlFor="title">
                      Section Title <span className="mandatory">*</span>
                    </label>
                    <TextField
                      className={`input-field ${
                        section.sectionTitle === "" &&
                        globalSectionTitleError?.errMsg &&
                        "input-error"
                      }`}
                      id="outlined-basic"
                      placeholder="Enter section title"
                      variant="outlined"
                      // error={
                      //     section.sectionTitle.length !=
                      //     ""
                      // }
                      inputProps={{ maxLength: 250 }}
                      onChange={handleInputSection}
                      value={section.sectionTitle}
                      name={"sectionTitle"}
                      helperText={
                        section.sectionTitle === "" &&
                        globalSectionTitleError?.errMsg
                          ? globalSectionTitleError.errMsg
                          : " "
                      }
                    />
                  </div>
                </div>
                <div className="sect-card-form-rightfield flex-between">
                  <div className="form-group">
                    <label htmlFor="layout">
                      Layout <span className="mandatory">*</span>
                    </label>
                    <div className="select-field">
                      <FormControl>
                        <Select
                          IconComponent={(props) => (
                            <KeyboardArrowDownRoundedIcon {...props} />
                          )}
                          value={section.layout}
                          onChange={handleInputSection}
                          MenuProps={MenuProps}
                          name={"layout"}
                        >
                          <MenuItem value="form">Form</MenuItem>
                          <MenuItem value="table" selected>
                            Table
                          </MenuItem>
                        </Select>
                        <FormHelperText> </FormHelperText>
                      </FormControl>
                      {/* <Dropdown
                                            name={"layout"}
                                            control={control}
                                            placeholder={"Select layout"}
                                            options={["Form", "Table"]}
                                            rules={{
                                                required: true,
                                            }}
                                            myHelper={helperTextForSectionForm}
                                        /> */}
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="status">
                      Status <span className="mandatory">*</span>
                    </label>
                    <div className="select-field">
                      <FormControl>
                        <Select
                          IconComponent={(props) => (
                            <KeyboardArrowDownRoundedIcon {...props} />
                          )}
                          value={section?.isActive ? "active" : "inActive"}
                          onChange={handleStatusChange}
                          MenuProps={MenuProps}
                          name={"isActive"}
                        >
                          <MenuItem value={"active"} selected>
                            Active
                          </MenuItem>
                          <MenuItem value={"inActive"}>Inactive</MenuItem>
                        </Select>
                        <FormHelperText> </FormHelperText>
                      </FormControl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="sect-form-card-innerblk">
                <div className="sect-card-form-leftfield full-width">
                  <div className="form-group mb-0">
                    <label htmlFor="emailid">Description</label>
                    <TextField
                      className="input-field"
                      id="outlined-basic"
                      placeholder="Enter description"
                      variant="outlined"
                      onChange={handleInputSection}
                      name={"description"}
                      value={section.description}
                      // multiline
                    />
                  </div>
                </div>
              </div>
              {/* <button onClick={handleSubmit}>Submit</button> */}
              {/* Question content component over here */}
            </div>
          </form>
        </div>
        {section?.layout === "form" ? (
          <Questions
            sectionIndex={index}
            questionnaire={questionnaire}
            setQuestionnaire={setQuestionnaire}
            err={err}
            setErr={setErr}
          />
        ) : (
          " "
        )}
      </div>
      <div className="form-btn flex-between add-members-btn que-page-btn">
        <button
          type="reset"
          className="secondary-button mr-10"
          onClick={onCancelClickHandler}
        >
          Cancel
        </button>
        <button
          type="submit"
          onClick={handleSubmitSection}
          className="primary-button add-button"
        >
          Save
        </button>
      </div>
    </div>
    // </div>
  );
};

export default SectionContent;
