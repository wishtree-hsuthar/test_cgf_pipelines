import React, { useRef, useState, useEffect } from "react";
import { useForm, Control, Controller } from "react-hook-form";
import Input from "../../components/Input";
import Dropdown from "../../components/Dropdown";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Loader2 from "../../assets/Loader/Loader2.svg";
import { privateAxios } from "../../api/axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ADD_OPERATION_MEMBER,
  ADD_QUESTIONNAIRE,
  FETCH_ASSESSMENT_BY_ID,
  FETCH_OPERATION_MEMBER,
  MEMBER,
  MEMBER_DROPDOWN,
  UPDATE_ASSESSMENT_BY_ID,
} from "../../api/Url";
import useCallbackState from "../../utils/useCallBackState";
import { TextField } from "@mui/material";
import Toaster from "../../components/Toaster";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import DateRangeOutlinedIcon from "@mui/icons-material/DateRangeOutlined";
import { useDocumentTitle } from "../../utils/useDocumentTitle";
import DialogBox from "../../components/DialogBox";
import axios from "axios";
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
  const [isLoading, setIsLoading] = useState(false);

  const { handleSubmit, control, setValue, reset, watch, getValues } = useForm({
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
  const [memberRepresentatives, setMemberRepresentatives] = useState([]);
  const [questionnares, setQuestionnares] = useState([]);
  const [questionnaresObj, setQuestionnaresObj] = useState([]);
  const [questionnaireId, setQuestionnaireId] = useState("");
  const [isCGFStaff, setIsCGFStaff] = useState();
  const [openDialog, setOpenDialog] = useState(false);

  const fetchOperationMembersAccordingToMemberCompanyForAddAssessment = async (
    id,
    isCGFStaff
  ) => {
    try {
      const response = await privateAxios.get(
        FETCH_OPERATION_MEMBER + id
        // isCGFStaff
        //     ? FETCH_OPERATION_MEMBER + id + "/master/internal"
        //     : FETCH_OPERATION_MEMBER + id
      );
      console.log(
        "Response from fetch operation member according to member company",
        response
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

      console.log("Representative---", representative);
      console.log("is Cgf staff---", isCGFStaff);
      isCGFStaff
        ? setValue("assignedOperationMember")
        : setValue("assignedOperationMember", representative[0]._id);
    } catch (error) {
      console.log(
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
        setIsLoading(true);
        const response = await privateAxios.get(
          FETCH_ASSESSMENT_BY_ID + params.id,
          {
            signal: controller.signal,
          }
        );
        setIsLoading(false);
        console.log("response from fetch assessment", response.data);
        isMounted &&
          reset({
            title: response.data.title,
            assessmentType: response.data.assessmentType,
            assignedMember: response.data.assignedMember?._id,
            // name: response.data.assignedMember?.companyName,

            assignedOperationMember: response.data.assignedOperationMember?._id,
            dueDate: new Date(response.data.dueDate),
            remarks: response.data.remarks,
            questionnaireId: response.data.questionnaireId,
          });
        setQuestionnaireId(response.data.questionnaireId);
        // fetchOperationMembersAccordingToMemberCompanyForAddAssessment(
        //     response.data?.assignedMember?._id
        // );
        fetchMember();
      } catch (error) {
        if (error?.code === "ERR_CANCELED") return;
        setIsLoading(false);
        console.log("Error from fetch assessment", error);
      }
    };
    fetchAssessment();
    const fetchMemberCompaniesForAddAssesments = async () => {
      try {
        const response = await privateAxios.get(MEMBER_DROPDOWN, {
          signal: controller.signal,
        });

        console.log(
          "response from fetch member companies for add assessments",
          response
        );
        isMounted &&
          setMemberCompaniesForAddAssessments(
            response.data.map((data) => ({
              _id: data._id,
              name: data.companyName,
            }))
          );
        setMemberRepresentatives(response.data);
      } catch (error) {
        console.log("Error from fetch member company api", error);
      }
    };
    fetchMemberCompaniesForAddAssesments();

    const fetchQuestionnaires = async () => {
      try {
        const response = await privateAxios.get(ADD_QUESTIONNAIRE, {
          signal: controller.signal,
        });
        console.log("response from questionnaires api", response.data);
        isMounted && setQuestionnares(response.data.map((data) => data.title));
        setQuestionnaresObj(
          response.data.map((data) => ({
            _id: data.uuid,
            name: data.title,
          }))
        );
      } catch (error) {
        console.log("Error from fetch questionnaires", error);
      }
    };
    fetchQuestionnaires();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const fetchMember = async () => {
    try {
      const response = await privateAxios.get(ADD_OPERATION_MEMBER);
      console.log("Member fetched", response.data);
      setOperationMemberForAddAssessments(
        response.data.map((data) => ({
          _id: data._id,
          name: data.name,
        }))
      );
    } catch (error) {
      console.log("error from fetch member api", error);
    }
  };

  const updateAssessment = async (data) => {
    console.log("data for update assessment", data);
    data = { ...data, questionnaireId: questionnaireId };
    try {
      const response = await privateAxios.put(
        UPDATE_ASSESSMENT_BY_ID + params.id,
        data
      );
      console.log("response from update assessment page");
      if (response.status === 200) {
        setToasterDetails(
          {
            titleMessage: "Success!",
            descriptionMessage: response?.data?.message,
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
      console.log("error from update assessment url", error);
      if (error.response.status === 401) {
        console.log("Unauthorized user access");
        // Add error toaster here
        setToasterDetails(
          {
            titleMessage: "Oops!",
            descriptionMessage: error?.response?.data?.message,
            messageType: "error",
          },
          () => toasterRef.current()
        );
        navigate("/login");
      }
      if (error.response.status === 400) {
        console.log("something went wrong");
        // Add error toaster here
        setToasterDetails(
          {
            titleMessage: "Oops!",
            descriptionMessage: error?.response?.data?.message,
            messageType: "error",
          },
          () => toasterRef.current()
        );
      }
      if (error.response.status === 403) {
        console.log("something went wrong");
        // Add error toaster here
        setToasterDetails(
          {
            titleMessage: "Oops!",
            descriptionMessage: "Something went wrong",
            messageType: "error",
          },
          () => toasterRef.current()
        );
      }
    }
  };

  const handleChangeForMemberCompany = (e) => {
    setValue("assignedMember", e.target.value);
    console.log("assignedMember", e.target.value);
    // let memberRepresentative = memberRepresentatives.filter(
    //     (data) => data._id === e.target.value
    // );

    // console.log("member representative----", memberRepresentative[0]?.name);

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
    console.log("cgf company-----", cgfCompany);

    let memberRepresentative = memberRepresentatives.filter(
      (data) => data._id === e.target.value
    );

    if (cgfCompany[0].name === "CGF") {
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
    console.log("assessment type", e);
    let filterQuestionnaireById = questionnaresObj.filter(
      (questionnare) => questionnare.name === e.target.value
    );
    console.log("filtered questionnaire", filterQuestionnaireById);
    setValue("questionnaireId", filterQuestionnaireById[0]._id);
    setQuestionnaireId(filterQuestionnaireById[0]._id);
    setValue("assessmentType", e.target.value);
  };
  const [isActive, setActive] = useState(false);
  const handleToggle = () => {
    setActive(!isActive);
  };
  const onDialogPrimaryButtonClickHandler = async() => {
    try {
      await axios.delete(FETCH_ASSESSMENT_BY_ID+`${params?.id}`)
      setToasterDetails(
        {
          titleMessage: "Success",
          descriptionMessage: `Assessment deleted successfully!`,
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
            error?.response?.data?.message &&
            typeof error.response.data.message === "string"
              ? error.response.data.message
              : "Something went wrong!",
          messageType: "error",
        },
        () => toasterRef.current()
      );
    }
    finally {
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
        title={<p>Delete assessment "{watch("title")}"!</p>}
        info1={
          <p>
            Once the assignment is deleted, all the related information would be lost. 
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
                style={{ display: isActive ? "block" : "none" }}
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
           
            {isLoading ? (
              <div className="loader-blk">
                <img src={Loader2} alt="Loading" />
              </div>
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
                      <Controller
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
                              //     console.log(
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
                      <Controller
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
                  <div className="form-btn flex-between add-members-btn">
                    <button
                      type={"reset"}
                      onClick={() => navigate("/assessment-list")}
                      className="secondary-button mr-10"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="primary-button add-button">
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
