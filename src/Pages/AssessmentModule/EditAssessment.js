import MoreVertIcon from "@mui/icons-material/MoreVert";
import { TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import React, { useEffect, useRef, useState } from "react";
import {
  Controller as EditAssessmentController,
  useForm,
} from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { privateAxios } from "../../api/axios";
import {
  ADD_OPERATION_MEMBER,
  ADD_QUESTIONNAIRE,
  FETCH_ASSESSMENT_BY_ID,
  FETCH_OPERATION_MEMBER,
  MEMBER_DROPDOWN,
  UPDATE_ASSESSMENT_BY_ID,
} from "../../api/Url";
import Dropdown from "../../components/Dropdown";
import Input from "../../components/Input";
import Toaster from "../../components/Toaster";
import useCallbackState from "../../utils/useCallBackState";

import DateRangeOutlinedIcon from "@mui/icons-material/DateRangeOutlined";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import DialogBox from "../../components/DialogBox";
import { useDocumentTitle } from "../../utils/useDocumentTitle";
import Loader from "../../utils/Loader";
import { Logger } from "../../Logger/Logger";
import { catchError } from "../../utils/CatchError";
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
  remarks: {
    minLength: "minimum 3 characters required",
    maxLength: "Reached max limit",
  },
};
function EditAssessment() {
  //custom hook to set title of page
  useDocumentTitle("Edit Assessment");
  // state to manage loaders
  const [isEditAssessmentLoading, setIsEditAssessmentLoading] = useState(false);

  const { handleSubmit, control, setValue, reset, watch } = useForm({
    defaultValues: {
      title: "",
      assessmentType: "",
      assignedMember: {
        _id: "",
        name: "",
      },
      assignedOperationMember: "",
      dueDate: "",
      remarks: "",
    },
  });

  // navigate function
  const navigate = useNavigate();
  // params to extract id/uuid from url
  const params = useParams();

  const toasterRef = useRef();
  const [toasterDetails, setToasterDetails] = useCallbackState({
    titleMessage: "",
    descriptionMessage: "",
    messageType: "success",
  });
  const [
    memberCompaniesForAddAssessments,
    setMemberCompaniesForAddAssessments,
  ] = useState([]);
  const [
    operationMemberForAddAssessments,
    setOperationMemberForAddAssessments,
  ] = useState([]);
  const [questionnares, setQuestionnares] = useState([]);
  const [questionnaresObj, setQuestionnaresObj] = useState([]);
  const [questionnaireId, setQuestionnaireId] = useState("");
  const [isCGFStaff, setIsCGFStaff] = useState();
  const [openDialog, setOpenDialog] = useState(false);
  const [disableEditAssessmentButton, setDisableEditAssessmentButton] =
    useState(false);
  const fetchOperationMembersAccordingToMemberCompanyForAddAssessment = async (
    id,
    checkIfItIsCgfStaff
  ) => {
    try {
      const responseEditMember = await privateAxios.get(
        FETCH_OPERATION_MEMBER + id + "/master"
        // checkIfItIsCgfStaff
        //     ? FETCH_OPERATION_MEMBER + id + "/master/internal"
        //     : FETCH_OPERATION_MEMBER + id
      );
      Logger.debug(
        "Response from fetch operation member according to member company",
        responseEditMember
      );
      setOperationMemberForAddAssessments(
        responseEditMember.data.map((data) => ({
          _id: data._id,
          name: data.name,
        }))
      );
      let representative = responseEditMember.data.filter(
        (data) => data?.isMemberRepresentative
      );

      Logger.debug("Representative---", representative);
      Logger.debug("is Cgf staff---", checkIfItIsCgfStaff);
      checkIfItIsCgfStaff
        ? setValue("assignedOperationMember", "")
        : setValue("assignedOperationMember", representative[0]._id);
    } catch (error) {
      Logger.debug(
        "Error from from fetch operation member according to member company",
        error
      );
    }
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchAssessment = async () => {
      try {
        setIsEditAssessmentLoading(true);
        const responseEditMember = await privateAxios.get(
          FETCH_ASSESSMENT_BY_ID + params.id,
          {
            signal: controller.signal,
          }
        );
        setIsEditAssessmentLoading(false);
        Logger.debug(
          "responseEditMember from fetch assessment",
          responseEditMember.data
        );
        isMounted &&
          reset({
            title: responseEditMember.data.title,
            assessmentType: responseEditMember.data.assessmentType,
            assignedMember: responseEditMember.data.assignedMember?._id,
            // name: responseEditMember.data.assignedMember?.companyName,

            assignedOperationMember:
              responseEditMember.data.assignedOperationMember?._id,
            dueDate: new Date(
              new Date(responseEditMember.data.dueDate)
            ).setDate(new Date(responseEditMember.data.dueDate).getDate() - 1),
            remarks: responseEditMember.data.remarks,
            questionnaireId: responseEditMember.data.questionnaireId,
          });
        setQuestionnaireId(responseEditMember.data.questionnaireId);
        fetchMember(responseEditMember.data.assignedMember?._id);
      } catch (error) {
        if (error?.code === "ERR_CANCELED") return;
        catchError(
          error,
          setToasterDetails,
          toasterRef,
          navigate,
          "/assessment-list"
        );
        // if (error?.response?.status === 401) {
        //     isMounted &&
        //         setToasterDetails(
        //             {
        //                 titleMessage: "Oops!",
        //                 descriptionMessage:
        //                     "Session Timeout: Please login again",
        //                 messageType: "error",
        //             },
        //             () => toasterRef.current()
        //         );
        //     setTimeout(() => {
        //         navigate("/login");
        //     }, 3000);
        // } else if (error?.response?.status === 403) {
        //     setToasterDetails(
        //         {
        //             titleMessage: "Oops!",
        //             descriptionMessage: error?.response?.data?.message
        //                 ? error?.response?.data?.message
        //                 : "Something went wrong",
        //             messageType: "error",
        //         },
        //         () => toasterRef.current()
        //     );
        //     setTimeout(() => {
        //         navigate("/home");
        //     }, 3000);
        // } else {
        //     setToasterDetails(
        //         {
        //             titleMessage: "Oops!",
        //             descriptionMessage: error?.response?.data?.message
        //                 ? error?.response?.data?.message
        //                 : "Something went wrong",
        //             messageType: "error",
        //         },
        //         () => toasterRef.current()
        //     );
        // }
        setIsEditAssessmentLoading(false);
        Logger.debug("Error from fetch assessment", error);
      }
    };
    fetchAssessment();
    const fetchMemberCompaniesForAddAssesments = async () => {
      try {
        const responseEditMember = await privateAxios.get(MEMBER_DROPDOWN, {
          signal: controller.signal,
        });

        Logger.debug(
          "responseEditMember from fetch member companies for add assessments",
          responseEditMember
        );
        isMounted &&
          setMemberCompaniesForAddAssessments(
            responseEditMember.data.map((data) => ({
              _id: data._id,
              name: data.companyName,
            }))
          );
      } catch (error) {
        Logger.debug("Error from fetch member company api", error);
      }
    };
    fetchMemberCompaniesForAddAssesments();

    const fetchQuestionnaires = async () => {
      try {
        const responseEditMember = await privateAxios.get(
          ADD_QUESTIONNAIRE + "/master",
          {
            signal: controller.signal,
          }
        );
        Logger.debug(
          "responseEditMember from questionnaires api",
          responseEditMember.data
        );
        isMounted &&
          setQuestionnares(responseEditMember.data.map((data) => data.title));
        setQuestionnaresObj(
          responseEditMember.data.map((data) => ({
            _id: data.uuid,
            name: data.title,
          }))
        );
      } catch (error) {
        Logger.debug("Error from fetch questionnaires", error);
      }
    };
    fetchQuestionnaires();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const fetchMember = async (id) => {
    try {
      const responseEditMember = await privateAxios.get(
        ADD_OPERATION_MEMBER + "/member/" + id + "/master"
      );
      Logger.debug("Member fetched", responseEditMember.data);
      setOperationMemberForAddAssessments(
        responseEditMember.data.map((data) => ({
          _id: data._id,
          name: data.name,
        }))
      );
    } catch (error) {
      Logger.debug("error from fetch member api", error);
    }
  };

  const updateAssessment = async (data) => {
    setDisableEditAssessmentButton(true);
    setIsEditAssessmentLoading(true);
    Logger.debug("data for update assessment", data);
    data = {
      ...data,
      questionnaireId: questionnaireId,
      dueDate: new Date(
        new Date(
          new Date(data?.dueDate).setDate(
            new Date(new Date(data?.dueDate)).getDate() + 1
          )
        ).setHours(0, 0, 0, 0)
      ),
    };
    try {
      const responseEditMember = await privateAxios.put(
        UPDATE_ASSESSMENT_BY_ID + params.id,
        data
      );
      Logger.debug("responseEditMember from update assessment page");
      if (responseEditMember.status === 200) {
        setDisableEditAssessmentButton(false);
        setIsEditAssessmentLoading(true);
        setToasterDetails(
          {
            titleMessage: "Success!",
            descriptionMessage: responseEditMember?.data?.message,
            messageType: "success",
          },
          () => toasterRef.current()
        );

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
        setTimeout(() => {
          navigate("/assessment-list");
        }, 2000);
      }
    } catch (error) {
      Logger.debug("error from update assessment url", error);
      setDisableEditAssessmentButton(false);
      setIsEditAssessmentLoading(false);
      catchError(error, setToasterDetails, toasterRef, navigate);
      // if (error.responseEditMember.status === 401) {
      //     Logger.debug("Unauthorized user access");
      //     // Add error toaster here
      //     setToasterDetails(
      //         {
      //             titleMessage: "Oops!",
      //             descriptionMessage:
      //                 error?.responseEditMember?.data?.message,
      //             messageType: "error",
      //         },
      //         () => toasterRef.current()
      //     );
      //     navigate("/login");
      // }
      // if (error.responseEditMember.status === 400) {
      //     Logger.debug("something went wrong");
      //     // Add error toaster here
      //     setToasterDetails(
      //         {
      //             titleMessage: "Oops!",
      //             descriptionMessage:
      //                 error?.responseEditMember?.data?.message,
      //             messageType: "error",
      //         },
      //         () => toasterRef.current()
      //     );
      // }
      // if (error.responseEditMember.status === 403) {
      //     Logger.debug("something went wrong");
      //     // Add error toaster here
      //     setToasterDetails(
      //         {
      //             titleMessage: "Oops!",
      //             descriptionMessage: "Something went wrong",
      //             messageType: "error",
      //         },
      //         () => toasterRef.current()
      //     );
      // }
    }
  };

  const handleChangeForMemberCompany = (e) => {
    setValue("assignedMember", e.target.value);
    Logger.debug("assignedMember", e.target.value);
    // let memberRepresentative = memberRepresentatives.filter(

    // setValue(
    //     "assignedOperationMember",

    //     memberRepresentative[0]?._id
    // );
    // fetchOperationMembersAccordingToMemberCompanyForAddAssessment(
    //     e.target.value
    // );
    let cgfCompany = memberCompaniesForAddAssessments.filter(
      (data) => data._id === e.target.value
    );
    Logger.debug("cgf company-----", cgfCompany);

    if (cgfCompany[0].name === "The Consumer Goods Forum") {
      setIsCGFStaff(true);
      fetchOperationMembersAccordingToMemberCompanyForAddAssessment(
        e.target.value,
        true
      );
    } else {
      setIsCGFStaff(false);
      fetchOperationMembersAccordingToMemberCompanyForAddAssessment(
        e.target.value,
        false
      );
    }
  };

  const handleChangeForAssessmentModule = (e) => {
    Logger.debug("assessment type", e);
    let filterQuestionnaireById = questionnaresObj.filter(
      (questionnare) => questionnare.name === e.target.value
    );
    Logger.debug("filtered questionnaire", filterQuestionnaireById);
    setValue("questionnaireId", filterQuestionnaireById[0]._id);
    setQuestionnaireId(filterQuestionnaireById[0]._id);
    setValue("assessmentType", e.target.value);
  };
  const [isActive, setActive] = useState(false);
  const handleToggle = () => {
    setActive(!isActive);
  };
  const onDialogPrimaryButtonClickHandler = async () => {
    try {
      const response = await axios.delete(
        FETCH_ASSESSMENT_BY_ID + `${params?.id}`
      );
      setToasterDetails(
        {
          titleMessage: "Success",
          descriptionMessage: response.data.message,
          messageType: "success",
        },
        () => toasterRef.current()
      );
      return setTimeout(() => navigate("/assessment-list"), 3000);
    } catch (error) {
      if (error?.code === "ERR_CANCELED") return;

      setToasterDetails(
        {
          titleMessage: "Error",
          descriptionMessage:
            error?.responseEditMember?.data?.message &&
            typeof error.responseEditMember.data.message === "string"
              ? error.responseEditMember.data.message
              : "Something went wrong.",
          messageType: "error",
        },
        () => toasterRef.current()
      );
    } finally {
      setOpenDialog(false);
    }
  };
  const onDialogSecondaryButtonClickHandler = () => {
    navigate("/assessment-list");
  };
  //method to prevent typing on date field
  const handleOnKeyDownChange = (e) => {
    e.preventDefault();
  };
  return (
    <div className="page-wrapper" onClick={() => isActive && setActive(false)}>
      <Toaster
        messageType={toasterDetails.messageType}
        descriptionMessage={toasterDetails.descriptionMessage}
        myRef={toasterRef}
        titleMessage={toasterDetails.titleMessage}
      />
      <DialogBox
        title={<p>Delete Assessment "{watch("title")}"</p>}
        info1={
          <p>
            Once the assignment is deleted, all the related information would be
            lost.
          </p>
        }
        info2={<p>Do you want to continue?</p>}
        primaryButtonText="Delete"
        secondaryButtonText="Cancel"
        onPrimaryModalButtonClickHandler={onDialogPrimaryButtonClickHandler}
        onSecondaryModalButtonClickHandler={onDialogSecondaryButtonClickHandler}
        openModal={openDialog}
        setOpenModal={setOpenDialog}
      />
      <div className="breadcrumb-wrapper">
        <div className="container">
          <ul className="breadcrumb">
            <li>
              <Link to="/assessment-list">Assessments</Link>
            </li>
            <li>Edit Assessment</li>
          </ul>
        </div>
      </div>
      <section>
        <div className="container">
          <form onSubmit={handleSubmit(updateAssessment)}>
            <div className="form-header flex-between">
              <h2 className="heading2">Edit Assessment</h2>
              <span className="form-header-right-txt" onClick={handleToggle}>
                <span
                  className={`crud-operation ${
                    isActive && "crud-operation-active"
                  }`}
                >
                  <MoreVertIcon />
                </span>
                <div
                  className="crud-toggle-wrap"
                  style={{
                    display: isActive ? "block" : "none",
                  }}
                >
                  <ul className="crud-toggle-list">
                    {/* <li onClick={() => navigate(`/roles/edit-role/${params.id}`)}>
                    Edit
                  </li> */}
                    <li onClick={() => setOpenDialog(true)}>Delete</li>
                  </ul>
                </div>
                {/* <CustomModal /> */}
              </span>
            </div>

            {isEditAssessmentLoading ? (
              <Loader />
            ) : (
              <div className="card-wrapper">
                <div className="card-blk flex-between">
                  <div className="card-form-field">
                    <div className="form-group">
                      <label>
                        Assessment Title <span className="mandatory">*</span>
                      </label>
                      <Input
                        name={"title"}
                        onBlur={(e) =>
                          setValue("title", e.target.value?.trim())
                        }
                        control={control}
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
                        placeholder={"Select assessment "}
                        isDisabled
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
                        myOnChange={handleChangeForMemberCompany}
                        placeholder={"Assign member"}
                        myHelper={helperTextForAssessment}
                        rules={{ required: true }}
                        options={memberCompaniesForAddAssessments}
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
                        placeholder={"Select operation member "}
                        myHelper={helperTextForAssessment}
                        rules={{ required: true }}
                        options={operationMemberForAddAssessments}
                      />
                    </div>
                  </div>
                  <div className="card-form-field">
                    <div className="form-group">
                      <label>
                        Due Date <span className="mandatory">*</span>
                      </label>
                      <EditAssessmentController
                        name="dueDate"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              {...field}
                              disablePast
                              className="datepicker-blk"
                              // value={datevalue}
                              components={{
                                OpenPickerIcon: DateRangeOutlinedIcon,
                              }}
                              // inputFormat={
                              //     "MM/DD/YYYY"
                              // }
                              // value={datevalue}
                              // onChange={(value) => {
                              //     setDateValue(value);
                              //     Logger.debug(
                              //         "date",
                              //         new Date(
                              //             value
                              //         ).toLocaleDateString()
                              //     );
                              //     setValue(
                              //         "dueDate",
                              //         new Date(
                              //             value
                              //         ).toISOString()
                              //     );
                              // }}
                              renderInput={(params) => (
                                <TextField
                                  autoComplete="off"
                                  {...params}
                                  onKeyDown={handleOnKeyDownChange}
                                />
                              )}
                            />
                          </LocalizationProvider>
                        )}
                      />
                    </div>
                  </div>
                  <div className="card-form-field">
                    <div className="form-group">
                      <label>Remarks/Comments</label>
                      <EditAssessmentController
                        name="remarks"
                        control={control}
                        rules={{
                          minLength: 3,
                          maxLength: 250,
                        }}
                        render={({ field, fieldState: { error } }) => (
                          <TextField
                            multiline
                            {...field}
                            id="outlined-basic"
                            placeholder="Enter remarks/comments"
                            onBlur={(e) =>
                              setValue("remarks", e.target.value?.trim())
                            }
                            inputProps={{
                              maxLength: 250,
                            }}
                            className={`input-textarea ${
                              error && "input-textarea-error"
                            }`}
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
                      Update
                    </button>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </section>
    </div>
  );
}

export default EditAssessment;
