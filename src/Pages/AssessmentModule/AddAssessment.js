import { Button, TextField } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import {
  Controller as AddAssessmentController,
  useForm,
} from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { privateAxios } from "../../api/axios";
import Dropdown from "../../components/Dropdown";
import Input from "../../components/Input";
import Toaster from "../../components/Toaster";
import useCallbackState from "../../utils/useCallBackState";
import { Logger } from "../../Logger/Logger";
import DateRangeOutlinedIcon from "@mui/icons-material/DateRangeOutlined";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import CloseIcon from "@mui/icons-material/Close";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  ADD_ASSESSMENTS,
  ADD_QUESTIONNAIRE,
  FETCH_OPERATION_MEMBER,
  MEMBER_DROPDOWN,
  REGIONCOUNTRIES,
  REGIONS,
  SPECIFIC_MEMBER_DROPDOWN,
  STATES,
} from "../../api/Url";
import { useDocumentTitle } from "../../utils/useDocumentTitle";
import Loader from "../../utils/Loader";
import { catchError } from "../../utils/CatchError";
import { useSelector } from "react-redux";

const helperTextForAssessment = {
  title: {
    required: "Enter the assessment title",
    minLength: "minimum 3 characters required",
  },
  assessmentType: {
    required: "Select the assessment type",
  },
  assignedMember: {
    required: "Select the member company",
  },
  assignedOperationMember: {
    required: "Select the operation member",
  },
  dueDate: {
    required: "Select the due date",
  },
  region: {
    required: "Select the region",
  },
  country: {
    required: "Select the country",
  },
  remarks: {
    minLength: "minimum 3 characters required",
    maxLength: "Reached max limit",
  },
};
const AddAssessment = () => {
  //custom hook to set title of page
  useDocumentTitle("Add Assessment");


  const userAuth = useSelector((state) => state?.user?.userObj);
  const { isMemberRepresentative, isOperationMember, memberId } = userAuth;

  const handlememberDropdownAPI = () => {
    if (isMemberRepresentative || isOperationMember) {
      return `${SPECIFIC_MEMBER_DROPDOWN}${memberId}`;
    } else {
      return MEMBER_DROPDOWN;
    }
  };
  const [datevalue, setDateValue] = useState("");
  const [
    memberCompaniesForAddAssessments,
    setMemberCompaniesForAddAssessments,
  ] = useState([]);
  const [
    operationMemberForAddAssessments,
    setOperationMemberForAddAssessments,
  ] = useState([]);
  const [memberRepresentatives, setMemberRepresentatives] = useState([]);
  const [questionnares, setQuestionnares] = useState([]);
  const [questionnaresObj, setQuestionnaresObj] = useState([]);
  const navigate = useNavigate();
  const toasterRef = useRef();
  const [toasterDetails, setToasterDetails] = useCallbackState({
    titleMessage: "",
    descriptionMessage: "",
    messageType: "success",
  });
  const {
    handleSubmit,
    // formState: { errors },
    control,
    reset,
    setValue,
    trigger,
    watch,
  } = useForm({
    defaultValues: {
      title: "",
      assessmentType: "",
      assignedMember: "",
      assignedOperationMember: "",
      dueDate: "",
      remarks: "",
      questionnaireId: "",
      region: "",
      country: "",
    },
  });
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState("");

  const allowdedFiles = [
    ".jpg",
    ".jpeg",
    ".png",
    ".doc",
    ".txt",
    ".pdf",
    ".docx",
    ".xlsx",
    ".xls",
    ".ppt",
    ".pptx",
    ".mp4",
    ".mp3",
    ".zip",
    ".rar",
  ];
  const removeFile = () => {
    setFile(null);
    setFilePreview("");
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];

    // Check if a file is selected
    if (file) {
      // Check if the file type is allowed
      const fileExtension = `.${file.name.split(".").pop()}`;
      if (!allowdedFiles.includes(fileExtension.toLowerCase())) {
        alert("Invalid file type. Please select a valid file.");
        return;
      }

      // Check if the file size is within the limit (10 MB)
      if (file.size > 10 * 1024 * 1024) {
        alert(
          "File size exceeds the limit of 10 MB. Please select a smaller file."
        );
        return;
      }
      console.log("inside if");
      setFilePreview(file.name);
      // setValue(fname, file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        setFile(e?.target?.result);
      };
      reader.readAsDataURL(file);

      // Set the selected file
      // setFile(file);
    }
  };
  const [isCGFStaff, setIsCGFStaff] = useState(false);
  const [arrOfRegionsAddMember, setArrOfRegionsAddMember] = useState([]);

  const [arrOfCountryRegionsAddMember, setArrOfCountryRegionsAddMember] =
    useState([]);
  //to hold array of Country states
  const [arrOfStateCountryAddMember, setArrOfStateCountryAddMember] = useState(
    []
  );
  const [disableEditAssessmentButton, setDisableEditAssessmentButton] =
    useState(false);
  const [isAssessmentLoading, setIsAssessmentLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    getRegionsAddMember(controller, isMounted);
    const fetchMemberCompaniesForAddAssesments = async () => {
      try {
        const response = await privateAxios.get(handlememberDropdownAPI(), {
          signal: controller.signal,
        });

        Logger.info("Add assessments - Fetch member companies handler");
        isMounted &&
          setMemberCompaniesForAddAssessments(
            response.data.map((data) => ({
              _id: data._id,
              name: data.companyName,
            }))
          );
        setMemberRepresentatives(response.data);
      } catch (error) {
        Logger.info(
          "Add assessments - Fetch member companies handler catch error"
        );
      }
    };
    fetchMemberCompaniesForAddAssesments();

    const fetchQuestionnaires = async () => {
      Logger.info("Add assessments - Fetch questionnaires handler");

      try {
        const response = await privateAxios.get(ADD_QUESTIONNAIRE + "/master", {
          signal: controller.signal,
        });
        isMounted && setQuestionnares(response.data.map((data) => data.title));
        setQuestionnaresObj(
          response.data.map((data) => ({
            _id: data.uuid,
            name: data.title,
          }))
        );
      } catch (error) {
        Logger.info(
          "Add assessments - Fetch questionnaires handler catch error",error
        );
        catchError(error, setToasterDetails, toasterRef, navigate);
      }
    };
    fetchQuestionnaires();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);
  const setErrorToaster = (error) => {
    Logger.info("Add Member - setErrorToaster handler");
    setToasterDetails(
      {
        titleMessage: "Error",
        descriptionMessage:
          error?.response?.data?.message &&
          typeof error.response.data.message === "string"
            ? error.response.data.message
            : "Oops! Something went wrong. Please try again later.",
        messageType: "error",
      },
      () => toasterRef.current()
    );
  };
  const onCountryChangeHandlerAddMember = async (e) => {
    Logger.info(`Add Member - onCountryChangeHandlerAddMember handler`);
    setValue("country", e.target.value);
    const stateCountries = await privateAxios.get(
      STATES + `/${e.target.value}`
    );
    setArrOfStateCountryAddMember(stateCountries.data);
  };

  const getCountriesAddMember = async (region) => {
    Logger.info(`Add member - getCountriesAddMember handler`);
    try {
      return await privateAxios.get(REGIONCOUNTRIES + `/${region}`);
      // return regionCountries;
    } catch (error) {
      if (error?.code === "ERR_CANCELED") return;

      Logger.info(
        `Add member - getCountriesAddMember handler catch error - ${error?.response?.data?.message} `
      );
      return [];
    }
  };
  const formatRegionCountriesAddMember = (regionCountries) => {
    regionCountries.forEach(
      (country, id) =>
        (regionCountries[id] = country.hasOwnProperty("_id")
          ? country.name
          : country)
    );
    return regionCountries;
  };
  const getRegionsAddMember = async (controller, isMounted) => {
    try {
      const regions = await privateAxios.get(REGIONS, {
        signal: controller.signal,
      });
      setArrOfRegionsAddMember(regions.data);
      return arrOfRegionsAddMember;
    } catch (error) {
      if (error?.code === "ERR_CANCELED") return;
      if (error?.response?.status == 401) {
        isMounted &&
          setToasterDetails(
            {
              titleMessage: "Error",
              descriptionMessage: "Session Timeout: Please login again",
              messageType: "error",
            },
            () => toasterRef.current()
          );
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else if (error?.response?.status === 403) {
        isMounted &&
          setToasterDetails(
            {
              titleMessage: "Error",
              descriptionMessage: error?.response?.data?.message
                ? error?.response?.data?.message
                : "Oops! Something went wrong. Please try again later.",
              messageType: "error",
            },
            () => toasterRef.current()
          );
        setTimeout(() => {
          navigate("/home");
        }, 3000);
      } else {
        setErrorToaster(error);
        return [];
      }
    }
  };

  const onRegionChangeHandlerAddMember = async (e) => {
    Logger.info("Add member - onRegionChangeHandlerAddMember handler");
    setValue("country", "");

    setValue("region", e.target.value);
    trigger("region");
    const countriesOnRegion = await getCountriesAddMember(watch("region"));
    const arrOfCountryRegionsTemp = formatRegionCountriesAddMember(
      countriesOnRegion.data
    );
    setArrOfCountryRegionsAddMember([...arrOfCountryRegionsTemp]);
  };

  const fetchOperationMembersAccordingToMemberCompanyForAddAssessment = async (
    id,
    checkCgfStaff
  ) => {
    Logger.info("Add assessments - Fetch operation member handler");
    try {
      const response = await privateAxios.get(
        // FETCH_OPERATION_MEMBER + id
        checkCgfStaff
          ? FETCH_OPERATION_MEMBER + id + "/master/internal"
          : FETCH_OPERATION_MEMBER + id + "/master"
      );

      setOperationMemberForAddAssessments(
        response.data.map((data) => ({
          _id: data._id,
          name: data.name,
        }))
      );
      let representative = response.data.filter(
        (data) => data?.isMemberRepresentative
      );

      checkCgfStaff
        ? setValue("assignedOperationMember", "")
        : setValue(
            "assignedOperationMember",
            representative[0]?._id ? representative[0]?._id : ""
          );
    } catch (error) {
      Logger.info(
        "Add assessments - Fetch operation member handler catch error"
      );
    }
  };

  const handleChangeForMemberCompany = async (e) => {
    Logger.info("Add assessments - HandleChangeForMemberCompany handler");
    setValue("assignedMember", e.target.value);
    let cgfCompany = memberCompaniesForAddAssessments.filter(
      (data) => data._id === e.target.value
    );
    let memberRepresentative = memberRepresentatives.filter(
      (data) => data._id === e.target.value
    );

    if (cgfCompany[0].name === "The Consumer Goods Forum") {
      setIsCGFStaff(true);
      await fetchOperationMembersAccordingToMemberCompanyForAddAssessment(
        e.target.value,
        true
      );
    } else {
      setIsCGFStaff(false);
      await fetchOperationMembersAccordingToMemberCompanyForAddAssessment(
        e.target.value,
        false
      );
      trigger("assignedOperationMember");
    }

    trigger("assignedMember");
  };

  const handleChangeForAssessmentModule = (e) => {
    Logger.info("Add assessments - handleChangeForAssessmentModule hanler");
    let selectedQuestionnnaire = e.target.value
    let filterQuestionnaireById = questionnaresObj.filter(
      (questionnare) => questionnare.name === e.target.value
    );
   
    setValue("questionnaireId", filterQuestionnaireById[0]._id);
    setValue("assessmentType", e.target.value);
    trigger("assessmentType");
  };

  const submitAssessments = async (data) => {
    Logger.info("Add assessments - submitAssessments");
    setDisableEditAssessmentButton(true);
    let someDate = new Date(data.dueDate).setDate(
      new Date(data.dueDate).getDate() + 1
    );
    data = {
      ...data,
      dueDate: new Date(new Date(someDate).setHours(0, 0, 0, 0)).toISOString(),
      actionPlan: file,
      actionPlanName: filePreview,
    };

    setIsAssessmentLoading(true);
    try {
      const response = await privateAxios.post(ADD_ASSESSMENTS, data);
      if (response.status === 201) {
        setIsAssessmentLoading(false);

        setDisableEditAssessmentButton(false);
        reset({
          title: "",
          assessmentType: "",
          assignedMember: "",
          // name: .assignedMember?.companyName,

          assignedOperationMember: "",
          dueDate: "",
          remarks: "",
          questionnaireId: "",
        });
        // Add success toaster here
        setToasterDetails(
          {
            titleMessage: "Success!",
            descriptionMessage: response.data.message,
            messageType: "success",
          },
          () => toasterRef.current()
        );
        setTimeout(() => {
          navigate("/assessment-list");
        }, 2000);
      }
    } catch (error) {
      Logger.info("Add assessments - submitAssessments catch error");
      setDisableEditAssessmentButton(false);
      catchError(error, setToasterDetails, toasterRef, navigate);
    }
    setIsAssessmentLoading(false);
  };

  //method to prevent typing on date field
  const handleOnKeyDownChange = (e) => {
    e.preventDefault();
  };
  return (
    <div className="page-wrapper">
      <Toaster
        messageType={toasterDetails.messageType}
        descriptionMessage={toasterDetails.descriptionMessage}
        myRef={toasterRef}
        titleMessage={toasterDetails.titleMessage}
      />
      <div className="breadcrumb-wrapper">
        <div className="container">
          <ul className="breadcrumb">
            <li>
              <Link to="/assessment-list">Assessments</Link>
            </li>
            <li>Add Assessment</li>
          </ul>
        </div>
      </div>
      <section>
        {isAssessmentLoading ? (
          <Loader />
        ) : (
          <div className="container">
            <form onSubmit={handleSubmit(submitAssessments)}>
              <div className="form-header flex-between">
                <h2 className="heading2">Add Assessment</h2>
              </div>
              <div className="card-wrapper">
                <div className="card-blk flex-between">
                  <div className="card-form-field">
                    <div className="form-group">
                      <label>
                        Assessment Title <span className="mandatory">*</span>
                      </label>
                      <Input
                        name={"title"}
                        control={control}
                        onBlur={(e) =>
                          setValue("title", e.target.value?.trim())
                        }
                        myHelper={helperTextForAssessment}
                        placeholder={"Enter assessment title"}
                        rules={{
                          required: "true",
                          minLength: 3,
                          maxLength: 50,
                        }}
                      />
                    </div>
                  </div>
                  <div className="card-form-field">
                    <div className="form-group">
                      <label>
                        Assessment Type <span className="mandatory">*</span>
                      </label>
                      <Dropdown
                        control={control}
                        name="assessmentType"
                        placeholder={"Select assessment type"}
                        myHelper={helperTextForAssessment}
                        rules={{ required: true }}
                        options={questionnares}
                        myOnChange={handleChangeForAssessmentModule}
                      />
                    </div>
                  </div>
                  <div className="card-form-field">
                    <div className="form-group">
                      <label>
                        Member Company <span className="mandatory">*</span>
                      </label>
                      <Dropdown
                        control={control}
                        name={"assignedMember"}
                        placeholder={"Select member company"}
                        options={memberCompaniesForAddAssessments}
                        myHelper={helperTextForAssessment}
                        myOnChange={handleChangeForMemberCompany}
                        rules={{ required: true }}
                      />
                    </div>
                  </div>
                  <div className="card-form-field">
                    <div className="form-group">
                      <label>
                        Operation Member <span className="mandatory">*</span>
                      </label>
                      <Dropdown
                        control={control}
                        isDisabled={!isCGFStaff}
                        name={"assignedOperationMember"}
                        options={operationMemberForAddAssessments}
                        placeholder={"Select operation member "}
                        myHelper={helperTextForAssessment}
                        rules={{ required: true }}
                      />
                    </div>
                  </div>
                  <div className="card-form-field">
                    <div className="form-group">
                      <label htmlFor="region">
                        Region
                        <span className="mandatory">*</span>
                      </label>
                      <Dropdown
                        control={control}
                        myOnChange={onRegionChangeHandlerAddMember}
                        name="region"
                        rules={{ required: true}}
                        placeholder="Select region"
                        myHelper={helperTextForAssessment}
                        options={arrOfRegionsAddMember}
                      />
                    </div>
                  </div>
                  <div className="card-form-field">
                    <div className="form-group">
                      <label htmlFor="country">
                        Country
                        <span className="mandatory"> *</span>
                      </label>
                      <Dropdown
                        control={control}
                        name="country"
                        rules={{ required: true }}
                        myOnChange={onCountryChangeHandlerAddMember}
                        placeholder="Select country"
                        myHelper={helperTextForAssessment}
                        options={arrOfCountryRegionsAddMember}
                      />
                    </div>
                  </div>
                  <div className="card-form-field">
                    <div className="form-group">
                      <label>
                        Due Date <span className="mandatory">*</span>
                      </label>
                      <AddAssessmentController
                        name="dueDate"
                        control={control}
                        rules={{ required: true }}
                        render={({ field, fieldState: { error } }) => (
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              disablePast
                              className="datepicker-blk"
                              // value={datevalue}
                              components={{
                                OpenPickerIcon: DateRangeOutlinedIcon,
                              }}
                              // inputFormat={
                              //     "MM/DD/YYYY"
                              // }
                              value={datevalue}
                              onChange={(event = "") => {
                                setDateValue(event);
                                setValue(
                                  "dueDate",

                                  event?.toISOString()
                                );
                                trigger("dueDate");
                              }}
                              renderInput={(params) => (
                                <TextField
                                  autoComplete="off"
                                  {...params}
                                  className={` input-field ${
                                    error && "input-error"
                                  }`}
                                  onKeyDown={handleOnKeyDownChange}
                                  placeholder="MM/DD/YYYY"
                                  error
                                  helperText={
                                    error
                                      ? helperTextForAssessment.dueDate[
                                          error.type
                                        ]
                                      : " "
                                  }
                                />
                              )}
                              // {...field}
                            />
                          </LocalizationProvider>
                        )}
                      />
                    </div>
                  </div>
                  <div className="card-form-field">
                    <div className="form-group">
                      <label>Remarks/Comments</label>
                      <AddAssessmentController
                        name="remarks"
                        control={control}
                        rules={{
                          // required: true,
                          minLength: 3,
                          maxLength: 250,
                        }}
                        render={({ field, fieldState: { error } }) => (
                          <TextField
                            multiline
                            {...field}
                            onBlur={(e) =>
                              setValue("remarks", e.target.value?.trim())
                            }
                            inputProps={{
                              maxLength: 250,
                            }}
                            className={`input-textarea ${
                              error && "input-textarea-error"
                            }`}
                            id="outlined-basic"
                            placeholder="Enter remarks/comments"
                            helperText={
                              error
                                ? helperTextForAssessment.remarks[error.type]
                                : " "
                            }
                            variant="outlined"
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div className="card-form-field">
                    <div className="form-group">
                      <label>Action Plan</label>
                      <div className="upload-file-wrap">
                        <Button
                          variant="contained"
                          component="label"
                          className="upload-file-btn"
                        >
                          <div
                            className={
                              // currentSelectedFiles?.length > 0
                              // ? "upload-file-blk selected-file-blk"
                              // :
                              "upload-file-blk"
                            }
                          >
                            {/* <input hidden accept="image/*" multiple type="file" /> */}
                            <input
                              // ref={fileRef}
                              type={"file"}
                              hidden
                              accept={
                                ".jpg, .jpeg, .png, .doc, .txt, .pdf, .docx, .xlsx, .xls, .ppt, .pptx, .mp4, .mp3, .zip, .rar"
                              }
                              name="files[]"
                              // value={filePreview}
                              onChange={handleFileChange}
                              // multiple
                            />
                            <span className="upload-icon">
                              <CloudUploadOutlinedIcon />
                            </span>
                            <span className="file-upload-txt">
                              Click here to choose files (max file size{" "}
                              {`${process.env.REACT_APP_MAX_FILE_SIZE_MB} MB`})
                            </span>
                          </div>
                        </Button>
                        <p
                          style={{
                            color: "#f7a823",
                            fontFamily:
                              "ProximaNova-Semibold, serif, sans-serif",
                            margin: "10px 0px",
                          }}
                        >
                          Uploading large files may take some time
                        </p>
                        {filePreview}
                        <span
                          className="file-close-icon"
                          style={{
                            display:
                              filePreview.length > 1 ? "inline-block" : "none",
                            cursor: "pointer",
                          }}
                          onClick={removeFile}
                        >
                          {" "}
                          <CloseIcon />
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="form-btn flex-between add-members-btn">
                    <button
                      type={"reset"}
                      onClick={() => navigate("/assessment-list")}
                      className="secondary-button mr-10"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="primary-button add-button"
                      disabled={disableEditAssessmentButton}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}
      </section>
    </div>
  );
};

export default AddAssessment;
