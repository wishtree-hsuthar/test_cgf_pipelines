import { Autocomplete, Paper, TextField } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import Input from "../components/Input";
import Dropdown from "../components/Dropdown";
import { privateAxios } from "../api/axios";
import useCallbackState from "../utils/useCallBackState";
import Toaster from "../components/Toaster";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import DateRangeOutlinedIcon from '@mui/icons-material/DateRangeOutlined';
import { FETCH_OPERATION_MEMBER } from "../api/Url";
import { date } from "yup";

const helperTextForAssessment = {
    title: {
        required: "Assessment title required",
    },
    assessmentType: {
        required: "Assessment type required",
    },
    assignedMember: {
        required: "Member required",
    },
    assignedOperationMember: {
        required: "Operation member required",
    },
    dueDate: {
        required: "Due date required",
    },
    remarks: {
        max: "Reached max limit",
    },
};
const AddAssessment = () => {
    const [datevalue, setDateValue] = useState(new Date());
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
        watch,
        reset,
        setValue,
    } = useForm({
        defaultValues: {
            title: "",
            assessmentType: "",
            assignedMember: "",
            assignedOperationMember: "",
            dueDate: new Date().toLocaleDateString(),
            remarks: "",
            questionnaireId: "",
        },
    });
    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const fetchMemberCompaniesForAddAssesments = async () => {
            try {
                const response = await privateAxios.get(
                    "http://localhost:3000/api/members",
                    {
                        signal: controller.signal,
                    }
                );

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
            } catch (error) {
                console.log("Error from fetch member company api", error);
            }
        };
        fetchMemberCompaniesForAddAssesments();

        const fetchQuestionnaires = async () => {
            try {
                const response = await privateAxios.get(
                    "http://localhost:3000/api/questionnaires",
                    {
                        signal: controller.signal,
                    }
                );
                console.log("response from questionnaires api", response.data);
                isMounted &&
                    setQuestionnares(response.data.map((data) => data.title));
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

    const fetchOperationMembersAccordingToMemberCompanyForAddAssessment =
        async (id) => {
            try {
                const response = await privateAxios.get(
                    FETCH_OPERATION_MEMBER + id
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
            } catch (error) {
                console.log(
                    "Error from from fetch operation member according to member company",
                    error
                );
            }
        };

    const handleChangeForMemberCompany = (e) => {
        setValue("assignedMember", e.target.value);
        console.log("assignedMember", e.target.value);
        fetchOperationMembersAccordingToMemberCompanyForAddAssessment(
            e.target.value
        );
    };

    const handleChangeForAssessmentModule = (e) => {
        console.log("assessment type", e);
        let filterQuestionnaireById = questionnaresObj.filter(
            (questionnare) => questionnare.name === e.target.value
        );
        console.log("filtered questionnaire", filterQuestionnaireById);
        setValue("questionnaireId", filterQuestionnaireById[0]._id);
        setValue("assessmentType", e.target.value);
    };
    const submitAssessments = async (data) => {
        console.log("data from on submit", data);

        let someDate = new Date(data.dueDate);
        let setUTCHoursForDueDate = new Date(
            someDate.setDate(someDate.getDate() + 1)
        );
        let ISOdate = setUTCHoursForDueDate.setUTCHours(23, 59, 59, 59);
        console.log(
            "data after converting to ISOstring",
            new Date(ISOdate).toISOString()
        );
        data = {
            ...data,
            dueDate: new Date(setUTCHoursForDueDate) ,
        };

        try {
            const response = await privateAxios.post(
                "http://localhost:3000/api/assessments",
                data
            );
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
                        descriptionMessage: response?.data?.message,
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
                            <Link to="/assessments">Assessments</Link>
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
                                            Assessment title
                                            <span className="mandatory">*</span>
                                        </label>
                                        <Input
                                            name={"title"}
                                            control={control}
                                            myHelper={helperTextForAssessment}
                                            placeholder={
                                                "Enter assessment title"
                                            }
                                            rules={{
                                                required: "true",
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="card-form-field">
                                    <div className="form-group">
                                        <label>
                                            Assessment Type
                                            <span className="mandatory">*</span>
                                        </label>
                                        <Dropdown
                                            control={control}
                                            name="assessmentType"
                                            placeholder={"Select assessment "}
                                            myHelper={helperTextForAssessment}
                                            rules={{ required: true }}
                                            options={questionnares}
                                            myOnChange={
                                                handleChangeForAssessmentModule
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="card-form-field">
                                    <div className="form-group">
                                        <label>
                                            Assign Member
                                            <span className="mandatory">*</span>
                                        </label>
                                        <Dropdown
                                            control={control}
                                            name={"assignedMember"}
                                            myOnChange={
                                                handleChangeForMemberCompany
                                            }
                                            placeholder={"Assign member"}
                                            myHelper={helperTextForAssessment}
                                            rules={{ required: true }}
                                            options={
                                                memberCompaniesForAddAssessments
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="card-form-field">
                                    <div className="form-group">
                                        <label>
                                            Assign Operation Member
                                            <span className="mandatory">*</span>
                                        </label>
                                        <Dropdown
                                            control={control}
                                            isDisabled={
                                                !watch("assignedMember")
                                            }
                                            name={"assignedOperationMember"}
                                            placeholder={
                                                "Select operation member "
                                            }
                                            myHelper={helperTextForAssessment}
                                            rules={{ required: true }}
                                            options={
                                                operationMemberForAddAssessments
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="card-form-field">
                                    <div className="form-group">
                                        <label>
                                            Due date
                                            <span className="mandatory">*</span>
                                        </label>
                                        <Controller
                                            name="dueDate"
                                            control={control}
                                            render={({
                                                field,
                                                fieldState: { error },
                                            }) => (
                                                <LocalizationProvider
                                                    dateAdapter={AdapterDayjs}
                                                >
                                                    <DatePicker
                                                        // {...field}
                                                        disablePast
                                                        className="datepicker-blk"
                                                        value={datevalue}
                                                        components={{
                                                            OpenPickerIcon:
                                                                DateRangeOutlinedIcon,
                                                        }}
                                                        // inputFormat={
                                                        //     "MM/DD/YYYY"
                                                        // }
                                                        // value={datevalue}
                                                        onChange={(value) => {
                                                            setDateValue(value);
                                                            console.log(
                                                                "date",
                                                                new Date(
                                                                    value
                                                                ).toLocaleDateString()
                                                            );
                                                            setValue(
                                                                "dueDate",
                                                                new Date(
                                                                    value
                                                                ).toISOString()
                                                            );
                                                        }}
                                                        renderInput={(
                                                            params
                                                        ) => (
                                                            <TextField
                                                                {...params}
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
                                                required: true,
                                                minLength: 3,
                                                maxLength: 250,
                                            }}
                                            render={({
                                                field,
                                                fieldState: { error },
                                            }) => (
                                                <TextField
                                                    multiline
                                                    {...field}
                                                    inputProps={{
                                                        maxLength: 250,
                                                    }}
                                                    className={`input-textarea ${
                                                        error &&
                                                        "input-textarea-error"
                                                    }`}
                                                    id="outlined-basic"
                                                    placeholder="Enter remarks/comments"
                                                    helperText={
                                                        error
                                                            ? helperTextForAssessment
                                                                  .remarks[
                                                                  error.type
                                                              ]
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
                                        onClick={() => navigate("/assessments")}
                                        className="secondary-button mr-10"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="primary-button add-button"
                                    >
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
