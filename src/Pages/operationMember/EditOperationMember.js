import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import {
  Autocomplete as EditOPAutoComplete,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup as EditOPRadioGroup,
  TextField,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import {
  Controller as EditOperationMemberController,
  useForm,
} from "react-hook-form";
import { Logger } from "../../Logger/Logger";
import { Link, useNavigate, useParams } from "react-router-dom";
import { privateAxios } from "../../api/axios";
import {
  COUNTRIES,
  FETCH_OPERATION_MEMBER,
  FETCH_ROLES,
  GET_OPERATION_MEMBER_BY_ID,
  MEMBER,
  UPDATE_OPERATION_MEMBER,
} from "../../api/Url";
import Dropdown from "../../components/Dropdown";
import Input from "../../components/Input";
import Toaster from "../../components/Toaster";
import Loader from "../../utils/Loader";
import {
  getOperationTypes,
  helperText,
} from "../../utils/OperationMemberModuleUtil";
import useCallbackState from "../../utils/useCallBackState";
import { useDocumentTitle } from "../../utils/useDocumentTitle";
import { catchError } from "../../utils/CatchError";
const defaultValues = {
  memberCompany: "",
  companyType: "Internal",
  countryCode: "",
  phoneNumber: "",
  salutation: "",
  title: "",
  department: "",
  email: "",
  operationType: "",
  memberId: {
    _id: "",
    companyName: "",
    companyType: "",
  },
  address: "",
  reportingManager: "",
  isActive: "",
  isCGFStaff: "",
};

let OPERATION_TYPES = [];

function EditOperationMember() {
  //custom hook to set title of page
  useDocumentTitle("Edit Operation Member");
  // state to manage loaders
  const [isEditOperationMemberLoading, setIsEditOperationMemberLoading] =
    useState(true);
  const {
    handleSubmit,
    formState: { errors },

    control,
    setValue,
    trigger,
    watch,
    reset,
  } = useForm({
    defaultValues: defaultValues,
  });
  // watch('')
  const navigate = useNavigate();
  const params = useParams();
  const [memberCompanies, setMemberCompanies] = useState([]);
  const [disableEditMemberUpdateButton, setDisableEditMemberUpdateButton] =
    useState(false);
  const [countries, setCountries] = useState([]);
  const [reportingManagers, setReportingManagers] = useState([]);
  const [operationMember, setOperationMember] = useState({});
  const toasterRef = useRef();
  const [toasterDetails, setToasterDetails] = useCallbackState({
    titleMessage: "",
    descriptionMessage: "",
    messageType: "error",
  });
  const [roles, setRoles] = useState([]);
  Logger.debug("operationMember", operationMember);
  Logger.debug("watch country code", watch("countryCode"));
  const fetchReportingManagers = async (id) => {
    try {
      const response = await privateAxios.get(FETCH_OPERATION_MEMBER + id);
      if (response.status == 200) {
        setReportingManagers(
          response?.data.map((data) => ({
            _id: data?._id,
            name: data?.name,
          }))
        );
        Logger.debug(
          "reporting managersssss",
          response?.data.map((data) => ({
            _id: data?._id,
            name: data?.name,
          }))
        );
      }
    } catch (error) {
      Logger.debug("error from fetching reporting managers", error);
    }
  };
  // fetch all countries and its objects
  const fetchCountries = async (isMounted, controller) => {
    try {
      const response = await privateAxios.get(COUNTRIES);
      Logger.debug("response from countries", response);
      // isMounted &&
      let tempCountries = response.data.map((country) => country?.countryCode);
      tempCountries = new Set(tempCountries);
      setCountries([...tempCountries]);
    } catch (error) {
      if (error?.code === "ERR_CANCELED") return;

      Logger.debug("error from countries api", error);
    }
  };
  // Fetch all member comapanies
  const fetchMemberComapany = async (isMounted, controller) => {
    try {
      const response = await privateAxios.get(MEMBER + "/list");
      Logger.debug(
        "member company---",
        response.data.map((data) => {
          Logger.debug("member company=", data?.companyName);
        })
      );

      if (response.status == 200) {
        isMounted &&
          setMemberCompanies(
            response.data.map((data) => ({
              _id: data?._id,
              companyName: data?.companyName,
              companyType: data?.companyType,
            }))
          );
      }

      Logger.debug("member company---", memberCompanies);
    } catch (error) {
      if (error?.code === "ERR_CANCELED") return;

      Logger.debug("error from fetch member company", error);
    }
  };

  // Fetch reporting managers of all member companies
  const fetchRm = async (id, isCGFStaff) => {
    Logger.debug("operation member----", operationMember);
    try {
      const response = await privateAxios.get(
        // FETCH_REPORTING_MANAGER + id
        // + isCGFStaff
        //     ? "/master/external"
        //     : "/master/internal"
        // // operationMember?.memberId?._id +
        isCGFStaff
          ? FETCH_OPERATION_MEMBER + id + "/master/external"
          : FETCH_OPERATION_MEMBER + id + "/master/internal"
      );
      Logger.debug("response from rm", response);
      setReportingManagers(
        response.data
          .filter((data) => data._id !== params.id)
          .map((data) => ({
            _id: data?._id,
            name: data?.name,
          }))
      );
    } catch (error) {
      Logger.debug("Error from fetching rm reporting manager", error);
    }
  };

  // fetch operation member by id
  Logger.debug("reporting managers", reportingManagers);

  const fetchOperationMember = async (controller, isMounted) => {
    try {
      setIsEditOperationMemberLoading(true);
      const response = await privateAxios.get(
        GET_OPERATION_MEMBER_BY_ID + params.id,
        {
          signal: controller.signal,
        }
      );
      setIsEditOperationMemberLoading(false);
      isMounted &&
        reset({
          memberId: {
            _id: response?.data?.memberId?._id,
            companyName: response?.data?.memberId?.companyName,
            companyType: response?.data?.memberId?.companyType,
          },
          companyType: response?.data?.memberId?.companyType,
          countryCode: response?.data?.countryCode,
          phoneNumber: response?.data?.phoneNumber,
          address: response?.data?.address,
          title: response?.data?.title ? response.data.title : "",
          department: response?.data?.department
            ? response?.data?.department
            : "",
          email: response?.data?.email,
          operationType: response?.data?.operationType
            ? response?.data?.operationType
            : "",
          reportingManager: response?.data?.reportingManager[0]?._id,
          salutation: response?.data?.salutation,
          name: response?.data?.name,
          isActive: response?.data?.isActive === true ? "true" : "false",
          roleId: response?.data?.role?._id ?? "",
          isCGFStaff: response?.data?.isCGFStaff === true ? "true" : "false",
          // reportingManagerId:
          //     response?.data?.reportingManager?._id,
        });
      setOperationMember(response.data);
      Logger.debug("response data ----", operationMember);
      let isCGFStaff = response?.data?.isCGFStaff ? true : false;
      fetchRm(response?.data?.memberId?._id, isCGFStaff);
    } catch (error) {
      if (error?.code === "ERR_CANCELED") return;
      setIsEditOperationMemberLoading(false);
      Logger.debug("error from edit operation members", error);
      catchError(
        error,
        setToasterDetails,
        toasterRef,
        navigate,
        "/users/operation-members"
      );
    }
  };

  // fetch & set Roles
  let fetchRoles = async (isMounted, controller) => {
    try {
      const response = await privateAxios.get(FETCH_ROLES, {
        signal: controller.signal,
      });
      Logger.debug("Response from fetch roles - ", response);
      setRoles(response.data);
    } catch (error) {
      if (error?.code === "ERR_CANCELED") return;

      Logger.debug("Error from fetch roles", error);
    }
  };
  const phoneNumberChangeHandler = (e, name, code) => {
    Logger.debug(
      "on number change",
      e.target.value,
      "name: ",
      name,
      "code",
      code
    );
    setValue(name, e.target.value);
    trigger(name);
    trigger(code);
  };
  const callGetOperatinType = async () => {
    OPERATION_TYPES = await getOperationTypes();
  };
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    OPERATION_TYPES?.length === 0 && callGetOperatinType();
    countries.length === 0 && fetchCountries(controller);
    memberCompanies.length === 0 && fetchMemberComapany(controller);
    roles.length === 0 && fetchRoles(isMounted, controller);

    fetchOperationMember(controller, isMounted);

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);
  Logger.debug("countries----", countries);
  Logger.debug("members companies----", memberCompanies);

  const editOperationMember = async (data, navigateToListPage) => {
    setDisableEditMemberUpdateButton(true);
    setIsEditOperationMemberLoading(true);
    data = {
      ...data,
      isActive: data?.isActive === "true" ? true : false,
    };
    try {
      const response = await privateAxios.put(
        UPDATE_OPERATION_MEMBER + params.id,
        data
      );
      if (response.status == 200) {
        setIsEditOperationMemberLoading(false);

        setToasterDetails(
          {
            titleMessage: "Hurray!",
            descriptionMessage: response.data.message,
            messageType: "success",
          },
          () => toasterRef.current()
        );

        setTimeout(() => {
          navigate("/users/operation-members");
        }, 3000);
      }
    } catch (error) {
      Logger.debug("error in submit data  add operation member method", error);
      setDisableEditMemberUpdateButton(false);
      setIsEditOperationMemberLoading(false);

      setToasterDetails(
        {
          titleMessage: "Oops!",
          descriptionMessage: error?.response?.data?.message,
          messageType: "error",
        },
        () => toasterRef.current()
      );
      if (error?.response?.status == 401) {
        navigate("/login");
      }
    }
  };

  const handleOnSubmit = async (data) => {
    Logger.debug("data from onsubmit", data);
    editOperationMember(data);
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
              <Link to="/users/operation-members">Operation Members</Link>
            </li>
            <li>
              <Link
                to={`/users/operation-member/view-operation-member/${params.id}`}
              >
                View Operation Members
              </Link>
            </li>
            <li>Edit Operation Member</li>
          </ul>
        </div>
      </div>
      <section>
        <div className="container">
          <form onSubmit={handleSubmit(handleOnSubmit)}>
            <div className="form-header flex-between">
              <h2 className="heading2">Edit Operation Member</h2>
              <div className="form-header-right-txt"></div>
            </div>
            {isEditOperationMemberLoading ? (
              <Loader />
            ) : (
              <div className="card-wrapper">
                <div className="card-blk flex-between">
                  <div className="card-form-field">
                    <div className="form-group">
                      <div className="salutation-wrap">
                        <div className="salutation-blk">
                          <label htmlFor="salutation">
                            Salutation <span className="mandatory">*</span>
                          </label>

                          <Dropdown
                            control={control}
                            name="salutation"
                            placeholder="Mr."
                            myHelper={helperText}
                            rules={{
                              required: true,
                            }}
                            options={["Mr.", "Mrs.", "Ms."]}
                          />
                        </div>
                        <div className="salutation-inputblk">
                          <label htmlFor="name">
                            Full Name <span className="mandatory">*</span>
                          </label>
                          <Input
                            name={"name"}
                            control={control}
                            onBlur={(e) =>
                              setValue("name", e.target.value?.trim())
                            }
                            placeholder="Enter full name"
                            myHelper={helperText}
                            rules={{
                              required: true,
                              pattern: /^[a-zA-Z][a-zA-Z ]*$/,
                              maxLength: 50,
                              minLength: 3,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-form-field">
                    <div className="form-group">
                      <label htmlFor="email">Job Title </label>
                      <Input
                        name={"title"}
                        placeholder="Enter job title"
                        control={control}
                        onBlur={(e) =>
                          setValue("title", e.target.value?.trim())
                        }
                        myHelper={helperText}
                        rules={{
                          maxLength: 50,
                          minLength: 3,
                        }}
                      />
                    </div>
                  </div>
                  <div className="card-form-field">
                    <div className="form-group">
                      <label htmlFor="email">Department </label>
                      <Input
                        name={"department"}
                        placeholder="Enter department"
                        control={control}
                        onBlur={(e) =>
                          setValue("department", e.target.value?.trim())
                        }
                        myHelper={helperText}
                        rules={{
                          maxLength: 50,
                          minLength: 3,
                        }}
                      />
                    </div>
                  </div>
                  <div className="card-form-field">
                    <div className="form-group">
                      <label htmlFor="email">
                        Email <span className="mandatory">*</span>
                      </label>
                      <Input
                        name={"email"}
                        control={control}
                        onBlur={(e) =>
                          setValue("email", e.target.value?.trim())
                        }
                        placeholder="NA"
                        isDisabled
                        myHelper={helperText}
                        rules={{ required: true }}
                      />
                    </div>
                  </div>
                  <div className="card-form-field">
                    <div className="form-group">
                      <label htmlFor="phoneNumber">Phone Number</label>
                      <div className="phone-number-field">
                        <div className="select-field country-code">
                          <EditOperationMemberController
                            control={control}
                            name="countryCode"
                            rules={{
                              validate: () => {
                                if (
                                  !watch("countryCode") &&
                                  watch("phoneNumber")
                                )
                                  return "Invalid input";
                              },
                            }}
                            render={({ field, fieldState: { error } }) => (
                              <EditOPAutoComplete
                                popupIcon={<KeyboardArrowDownRoundedIcon />}
                                PaperComponent={({ children }) => (
                                  <Paper
                                    className={
                                      countries?.length > 5
                                        ? "autocomplete-option-txt autocomplete-option-limit"
                                        : "autocomplete-option-txt"
                                    }
                                  >
                                    {children}
                                  </Paper>
                                )}
                                {...field}
                                onChange={(event, newValue) => {
                                  Logger.debug(
                                    "inside autocomplete onchange .of edit operation member"
                                  );
                                  Logger.debug("new Value ", newValue);
                                  newValue && typeof newValue === "object"
                                    ? setValue("countryCode", newValue.name)
                                    : setValue("countryCode", newValue);
                                  trigger("countryCode");
                                  trigger("phoneNumber");
                                }}
                                options={
                                  countries.length > 0 ? countries : ["+91"]
                                }
                                autoHighlight
                                renderOption={(props, option) => (
                                  <li {...props}>{option}</li>
                                )}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    inputProps={{
                                      ...params.inputProps,
                                    }}
                                    onChange={() => trigger("countryCode")}
                                    placeholder={"+91"}
                                    helperText={
                                      error
                                        ? helperText.countryCode[error.type]
                                        : " "
                                    }
                                  />
                                )}
                              />
                            )}
                          />
                        </div>
                        <Input
                          control={control}
                          placeholder="1234567890"
                          name={"phoneNumber"}
                          myOnChange={(e) =>
                            phoneNumberChangeHandler(
                              e,
                              "phoneNumber",
                              "countryCode"
                            )
                          }
                          onBlur={(e) =>
                            setValue("phoneNumber", e.target.value?.trim())
                          }
                          myHelper={helperText}
                          rules={{
                            maxLength: 15,
                            minLength: 7,
                            validate: (value) => {
                              if (!watch("phoneNumber") && watch("countryCode"))
                                return "invalid input";
                              if (value && !Number(value))
                                return "Invalid input";
                            },
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="card-form-field">
                    <div className="form-group">
                      <label htmlFor="">
                        Operation Type{" "}
                        {!operationMember?.isMemberRepresentative && (
                          <span className="mandatory">*</span>
                        )}
                      </label>
                      <Dropdown
                        control={control}
                        name="operationType"
                        placeholder="Select operation type"
                        myHelper={helperText}
                        rules={{
                          required: !operationMember?.isMemberRepresentative,
                        }}
                        options={OPERATION_TYPES}
                      />
                    </div>
                  </div>
                  <div className="card-form-field">
                    <div className="form-group">
                      <label htmlFor="">
                        CGF Staff <span className="mandatory">*</span>
                      </label>
                      <div className="radio-btn-field">
                        <EditOperationMemberController
                          name="isCGFStaff"
                          control={control}
                          render={({ field }) => (
                            <EditOPRadioGroup
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                e.target.value === "true"
                                  ? setValue("companyType", "Internal")
                                  : setValue("companyType", "External");
                              }}
                              aria-labelledby="demo-radio-buttons-group-label"
                              name="radio-buttons-group"
                              className="radio-btn"
                            >
                              <FormControlLabel
                                value="true"
                                control={<Radio disabled />}
                                label="Yes"
                              />
                              <FormControlLabel
                                value="false"
                                control={<Radio disabled />}
                                label="No"
                              />
                            </EditOPRadioGroup>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="card-form-field">
                    <div className="form-group">
                      <label htmlFor="">
                        Member Company <span className="mandatory">*</span>
                      </label>
                      <div className="country-code-auto-search">
                        <EditOperationMemberController
                          control={control}
                          name="memberId"
                          rules={{ required: true }}
                          render={({ field, fieldState: { error } }) => (
                            <EditOPAutoComplete
                              {...field}
                              PaperComponent={({ children }) => (
                                <Paper
                                  className={
                                    memberCompanies?.length > 5
                                      ? "autocomplete-option-txt autocomplete-option-limit"
                                      : "autocomplete-option-txt"
                                  }
                                >
                                  {children}
                                </Paper>
                              )}
                              popupIcon={<KeyboardArrowDownRoundedIcon />}
                              disableClearable
                              disabled
                              // value={
                              //     memberCompanies?._id
                              // }
                              onChange={(event, newValue) => {
                                newValue && typeof newValue === "object"
                                  ? setValue("memberId", {
                                      _id: newValue?._id,
                                      companyName: newValue.companyName,
                                    })
                                  : setValue("memberId", newValue);
                                Logger.debug("inside autocomplete onchange");
                                Logger.debug("new Value ", newValue);
                                setValue("reportingManager", "");
                                trigger("memberId");
                                // call fetch Reporting managers here
                                fetchReportingManagers(newValue._id);
                                setValue("companyType", newValue.companyType);
                              }}
                              // sx={{ width: 200 }}
                              options={memberCompanies}
                              placeholder="Select country code"
                              getOptionLabel={(company) => company.companyName}
                              renderOption={(props, option) => (
                                <li {...props}>{option.companyName}</li>
                              )}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  inputProps={{
                                    ...params.inputProps,
                                  }}
                                  placeholder={"Select member company"}
                                  onChange={() => trigger("memberId")}
                                  helperText={
                                    error
                                      ? helperText.memberId[error?.type]
                                      : " "
                                  }
                                />
                              )}
                            />
                          )}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="card-form-field">
                    <div className="form-group">
                      <label htmlFor="status">Company Type</label>
                      <Input
                        isDisabled={true}
                        name={"companyType"}
                        placeholder="NA"
                        control={control}
                        myHelper={helperText}
                      />
                    </div>
                  </div>
                  <div className="card-form-field">
                    <div className="form-group">
                      <label htmlFor="">Address</label>
                      <EditOperationMemberController
                        control={control}
                        name="address"
                        rules={{
                          minLength: 3,
                          maxLength: 250,
                        }}
                        render={({ field, fieldState: { error } }) => (
                          <TextField
                            {...field}
                            id="outlined-basic"
                            placeholder="Enter address"
                            variant="outlined"
                            multiline
                            onBlur={(e) =>
                              setValue("address", e.target.value?.trim())
                            }
                            inputProps={{
                              maxLength: 250,
                            }}
                            className={`input-textarea ${
                              error && "input-textarea-error"
                            }`}
                            helperText={
                              error ? helperText.address[error.type] : " "
                            }
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div className="card-form-field">
                    <div className="form-group">
                      <label htmlFor="">
                        Reporting Manager{" "}
                        {!operationMember?.isMemberRepresentative && (
                          <span className="mandatory">*</span>
                        )}
                      </label>
                      <Dropdown
                        control={control}
                        name="reportingManager"
                        // myHelper={myHelper}
                        placeholder={"Select reporting manager "}
                        // isDisabled={disableReportingManager}
                        myHelper={helperText}
                        rules={{
                          required: !operationMember?.isMemberRepresentative,
                        }}
                        options={reportingManagers}
                      />
                    </div>
                  </div>
                  <div className="card-form-field">
                    <div className="form-group">
                      <label htmlFor="opmember-role">
                        Role <span className="mandatory">*</span>
                      </label>

                      <div>
                        <Dropdown
                          control={control}
                          name="roleId"
                          options={roles}
                          rules={{
                            required: true,
                          }}
                          myHelper={helperText}
                          placeholder={"Select role"}
                        />

                        <p className={`password-error`}>
                          {errors.subRoleId?.message}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="card-form-field">
                    <div className="form-group">
                      <label htmlFor="status">Status</label>
                      <div className="radio-btn-field">
                        <EditOperationMemberController
                          name="isActive"
                          control={control}
                          render={({ field }) => (
                            <EditOPRadioGroup
                              {...field}
                              // value={editDefault && editDefault.status}
                              aria-labelledby="demo-radio-buttons-group-label"
                              name="radio-buttons-group"
                              className="radio-btn"
                            >
                              <FormControlLabel
                                value="true"
                                control={<Radio />}
                                label="Active"
                              />
                              <FormControlLabel
                                value="false"
                                control={<Radio />}
                                label="Inactive"
                              />
                            </EditOPRadioGroup>
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-btn flex-between add-members-btn">
                    <button
                      type={"reset"}
                      onClick={() => navigate("/users/operation-members")}
                      className="secondary-button mr-10"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="primary-button add-button"
                      disabled={disableEditMemberUpdateButton}
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

export default EditOperationMember;
