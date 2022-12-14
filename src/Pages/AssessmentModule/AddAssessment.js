import { TextField } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { privateAxios } from "../../api/axios";
import Dropdown from "../../components/Dropdown";
import Input from "../../components/Input";
import Toaster from "../../components/Toaster";
import useCallbackState from "../../utils/useCallBackState";

import DateRangeOutlinedIcon from "@mui/icons-material/DateRangeOutlined";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  ADD_ASSESSMENTS,
  ADD_QUESTIONNAIRE,
  FETCH_OPERATION_MEMBER,
  MEMBER_DROPDOWN,
} from "../../api/Url";
import { useDocumentTitle } from "../../utils/useDocumentTitle";

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
const AddAssessment = () => {
  //custom hook to set title of page
  useDocumentTitle("Add Assessment");

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
    formState: { errors },
    control,
    reset,
    setValue,
    trigger,
  } = useForm({
    defaultValues: {
      title: "",
      assessmentType: "",
      assignedMember: "",
      assignedOperationMember: "",
      dueDate: "",
      remarks: "",
      questionnaireId: "",
    },
  });
  const [isCGFStaff, setIsCGFStaff] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

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
        const response = await privateAxios.get(ADD_QUESTIONNAIRE + "/master", {
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

  const fetchOperationMembersAccordingToMemberCompanyForAddAssessment = async (
    id,
    isCGFStaff
  ) => {
    try {
      const response = await privateAxios.get(
        // FETCH_OPERATION_MEMBER + id
        isCGFStaff
          ? FETCH_OPERATION_MEMBER + id + "/master/internal"
          : FETCH_OPERATION_MEMBER + id + "/list"
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
        ? setValue("assignedOperationMember", "")
        : setValue(
            "assignedOperationMember",
            representative[0]?._id ? representative[0]?._id : ""
          );
    } catch (error) {
      console.log(
        "Error from from fetch operation member according to member company",
        error
      );
    }
  };

  const handleChangeForMemberCompany = async (e) => {
    setValue("assignedMember", e.target.value);
    console.log("assignedMember", e.target.value);
    console.log("member representatives-----", memberRepresentatives);

    let cgfCompany = memberCompaniesForAddAssessments.filter(
      (data) => data._id === e.target.value
    );
    console.log("cgf company-----", cgfCompany);

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

    console.log("member representative----", memberRepresentative);

    trigger("assignedMember");
  };

  const handleChangeForAssessmentModule = (e) => {
    console.log("assessment type", e);
    let filterQuestionnaireById = questionnaresObj.filter(
      (questionnare) => questionnare.name === e.target.value
    );
    console.log("filtered questionnaire", filterQuestionnaireById);
    setValue("questionnaireId", filterQuestionnaireById[0]._id);
    setValue("assessmentType", e.target.value);
    trigger("assessmentType");
  };

  const submitAssessments = async (data) => {
    console.log("data from on submit", data);

    let someDate = new Date(data.dueDate).setDate(
      new Date(data.dueDate).getDate() - 1
    );
    console.log(
      "data after converting to ISOstring",
      // new Date(ISOdate).toISOString()
      new Date(new Date(someDate).setUTCHours(23, 59, 59, 59)).toISOString()
    );
    data = {
      ...data,
      dueDate: new Date(
        new Date(someDate).setUTCHours(23, 59, 59, 59)
      ).toISOString(),
    };

    console.log("submitted data", data);

    try {
      const response = await privateAxios.post(ADD_ASSESSMENTS, data);
      if (response.status === 201) {
        console.log("response from add assessments", response);
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
            descriptionMessage: "Assessment added sucessfully!",
            messageType: "success",
          },
          () => toasterRef.current()
        );
        setTimeout(() => {
          navigate("/assessment-list");
        }, 2000);
      }
    } catch (error) {
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
                      onBlur={(e) => setValue("title", e.target.value?.trim())}
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
                      myOnChange={handleChangeForMemberCompany}
                      placeholder={"Select member company"}
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
                      // isDisabled={
                      //     !watch("assignedMember")
                      // }
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
                              console.log("date" + "  " + event);
                              setValue(
                                "dueDate",

                                event?.toISOString()
                              );
                              trigger("dueDate");
                            }}
                            renderInput={(params) => (
                              <TextField
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
                    <Controller
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
                <div className="form-btn flex-between add-members-btn">
                  <button
                    type={"reset"}
                    onClick={() => navigate("/assessment-list")}
                    className="secondary-button mr-10"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="primary-button add-button">
                    Save
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default AddAssessment;
