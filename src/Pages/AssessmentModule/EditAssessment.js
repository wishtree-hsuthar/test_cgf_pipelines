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
  SPECIFIC_MEMBER_DROPDOWN,
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
    Logger.info(
      "Edit Assessment - fetchOperationMembersAccordingToMemberCompanyForAddAssessment handler"
    );
    try {
      const responseEditMember = await privateAxios.get(
        FETCH_OPERATION_MEMBER + id + "/master"
        // checkIfItIsCgfStaff
        //     ? FETCH_OPERATION_MEMBER + id + "/master/internal"
        //     : FETCH_OPERATION_MEMBER + id
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

      checkIfItIsCgfStaff
        ? setValue("assignedOperationMember", "")
        : setValue("assignedOperationMember", representative[0]._id);
    } catch (error) {
      Logger.info(
        "Edit Assessment - fetchOperationMembersAccordingToMemberCompanyForAddAssessment handler catch error"
      );
    }
  };

  const userAuth = useSelector((state) => state?.user?.userObj);
  const { isMemberRepresentative, isOperationMember, memberId } = userAuth;

  const handlememberDropdownAPI = () => {
    if (isMemberRepresentative || isOperationMember) {

      return `${SPECIFIC_MEMBER_DROPDOWN}${memberId}`;
    } else {


      return MEMBER_DROPDOWN;
    }
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchAssessment = async () => {
      Logger.info("Edit Assessment - fetchAssessment handler");
      try {
        setIsEditAssessmentLoading(true);
        const responseEditMember = await privateAxios.get(
          FETCH_ASSESSMENT_BY_ID + params.id,
          {
            signal: controller.signal,
          }
        );
        setIsEditAssessmentLoading(false);

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
        Logger.info("Edit Assessment - fetchAssessment handler catch error");
        if (error?.code === "ERR_CANCELED") return;
        catchError(
          error,
          setToasterDetails,
          toasterRef,
          navigate,
          "/assessment-list"
        );
        setIsEditAssessmentLoading(false);
      }
    };
    fetchAssessment();
    const fetchMemberCompaniesForAddAssesments = async () => {
      Logger.info(
        "Edit Assessment - fetchMemberCompaniesForAddAssesments handler"
      );
      try {
        const responseEditMember = await privateAxios.get(
          handlememberDropdownAPI(),
          {
            signal: controller.signal,
          }
        );

        isMounted &&
          setMemberCompaniesForAddAssessments(
            responseEditMember.data.map((data) => ({
              _id: data._id,
              name: data.companyName,
            }))
          );
      } catch (error) {
        Logger.info(
          "Edit Assessment - fetchMemberCompaniesForAddAssesments handler catch error"
        );
      }
    };
    fetchMemberCompaniesForAddAssesments();

    const fetchQuestionnaires = async () => {
      Logger.info("Edit Assessment - fetchQuestionnaires handler");
      try {
        const responseEditMember = await privateAxios.get(
          ADD_QUESTIONNAIRE + "/master",
          {
            signal: controller.signal,
          }
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
        Logger.info(
          "Edit Assessment - fetchQuestionnaires handler catch error"
        );
      }
    };
    fetchQuestionnaires();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const fetchMember = async (id) => {
    Logger.info("Edit Assessment - fetchMember handler");
    try {
      const responseEditMember = await privateAxios.get(
        ADD_OPERATION_MEMBER + "/member/" + id + "/master"
      );
      setOperationMemberForAddAssessments(
        responseEditMember.data.map((data) => ({
          _id: data._id,
          name: data.name,
        }))
      );
    } catch (error) {
      Logger.info("Edit Assessment - fetchMember handler catch error");
    }
  };

  const updateAssessment = async (data) => {
    setDisableEditAssessmentButton(true);
    setIsEditAssessmentLoading(true);
    Logger.info("Edit Assessment - updateAssessment handler");
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
      Logger.info("Edit Assessment - updateAssessment handler catch error");

      setDisableEditAssessmentButton(false);
      setIsEditAssessmentLoading(false);
      catchError(error, setToasterDetails, toasterRef, navigate);
    }
  };

  const handleChangeForMemberCompany = (e) => {
    setValue("assignedMember", e.target.value);
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
    Logger.info("Edit Assessment - handleChangeForAssessmentModule handler");
    let filterQuestionnaireById = questionnaresObj.filter(
      (questionnare) => questionnare.name === e.target.value
    );
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
              : "Oops! Something went wrong. Please try again later.",
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
            Deleting the assessment will be an irreversible action. All the
            related details would be lost.
          </p>
        }
        info2={<p>Do you still want to continue?</p>}
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
