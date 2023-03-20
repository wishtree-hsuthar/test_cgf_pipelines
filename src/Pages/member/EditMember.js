import {
    Autocomplete as EditMemberAutoComplete,
    FormControlLabel,
    Paper,
    Radio,
    RadioGroup,
    TextField,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    CITES,
    COUNTRIES,
    FETCH_ROLES,
    MEMBER,
    REGIONCOUNTRIES,
    REGIONS,
    STATES,
} from "../../api/Url";
import Dropdown from "../../components/Dropdown";
import Input from "../../components/Input";
import Toaster from "../../components/Toaster";
import useCallbackState from "../../utils/useCallBackState";
import { memberHelper } from "../../utils/helpertext";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { privateAxios } from "../../api/axios";
import { useDocumentTitle } from "../../utils/useDocumentTitle";
import {
    defaultValues,
    getCategories,
    getCGFOffices,
} from "../../utils/MemberModuleUtil";
import Loader from "../../utils/Loader";

import { Logger } from "../../Logger/Logger";
let MEMBER_LOOKUP = {};
let CGF_OFFICES = [];
const EditMember = () => {
    //custom hook to set title of page
    useDocumentTitle("Edit Member");

    const param = useParams();
    const navigate = useNavigate();
    const [disableEditMemberUpdateButton, setDisableEditMemberUpdateButton] =
        useState(false);
    // Refr for Toaster
    const myRef = React.useRef();
    //Toaster Message setter
    const [toasterDetailsEditMember, setToasterDetailsEditMember] =
        useCallbackState({
            titleMessage: "",
            descriptionMessage: "",
            messageType: "success",
        });
    //method to call all error toaster from this method
    const setErrorToaster1 = (error) => {
        Logger.debug("error", error);
        setToasterDetailsEditMember(
            {
                titleMessage: "Error",
                descriptionMessage:
                    error?.response?.data?.message &&
                    typeof error.response.data.message === "string"
                        ? error.response.data.message
                        : "Something went wrong.",
                messageType: "error",
            },
            () => myRef.current()
        );
    };
    //to hold all regions
    const [arrOfRegions, setArrOfRegions] = useState([]);
    //to hold array of countries for perticular region for Company Adress
    const [arrOfCountryRegions, setArrOfCountryRegions] = useState([]);
    //to hold array of Country states
    const [arrOfStateCountry, setArrOfStateCountry] = useState([]);
    //to hold array of countries for perticular region for CGF Office details
    const [arrOfCgfOfficeCountryRegions, setArrOfCgfOfficeCountryRegions] =
        useState([]);
    const [arrOfCites, setArrOfCites] = useState([]);

    // state to manage loader
    const [isEditMemberLoading, setIsEditMemberLoading] = useState(true);
    const [arrOfCountryCode, setArrOfCountryCode] = useState([]);
    const [member, setMember] = useState({});

    // state to hold roles
    const [roles, setRoles] = useState([]);

    const [disableMember, setDisableMember] = useState(false);
    const { control, reset, setValue, watch, trigger, handleSubmit } = useForm({
        reValidateMode: "onChange",
        defaultValues: defaultValues,
    });
    const onSubmitFunctionCall = async (data) => {
        Logger.debug("data", data);
        setIsEditMemberLoading(true);
        try {
            let backendObject = {
                parentCompany: data.parentCompany,
                countryCode: data.countryCode,
                phoneNumber: data.phoneNumber,
                website: data.websiteUrl,
                state: data.state,
                city: data.city,
                companyName: data.memberCompany,
                companyType: data.companyType,
                cgfCategory: data.cgfCategory,
                cgfActivity: data?.cgfActivity ? data.cgfActivity : "N/A",
                corporateEmail: data.corporateEmail,
                region: data.region,
                country: data.country,
                address: data.address,
                cgfOfficeRegion: data.cgfOfficeRegion,
                cgfOfficeCountry: data.cgfOfficeCountry,
                cgfOffice: data.cgfOffice,
                memberRepresentative: {
                    id: member?.memberRepresentativeId[0]?._id,
                    title: data.title,
                    department: data.department,
                    salutation: data.memberContactSalutation,
                    name: data.memberContactFullName,
                    email: data.memberContactEmail,
                    countryCode: data.memberContactCountryCode,
                    phoneNumber: data?.memberContactPhoneNuber,
                    isActive: data.status === "active" ? true : false,
                    roleId: data.roleId,
                },
            };

            Logger.debug("Member Representative Id", member.createdBy);
            const response = await axios.put(MEMBER + `/${param.id}`, {
                ...backendObject,
            });
            if (response.status === 200) {
                setIsEditMemberLoading(false);

                setDisableEditMemberUpdateButton(false);
                reset(defaultValues);

                setToasterDetailsEditMember(
                    {
                        titleMessage: "Success!",
                        descriptionMessage: response.data.message,
                        messageType: "success",
                    },
                    () => myRef.current()
                );
            }

            Logger.debug("Default values: ", defaultValues);
        } catch (error) {
            setIsEditMemberLoading(false);

            if (error?.response?.status == 401) {
                setToasterDetailsEditMember(
                    {
                        titleMessage: "Error",
                        descriptionMessage:
                            "Session Timeout: Please login again",
                        messageType: "error",
                    },
                    () => myRef.current()
                );
                setTimeout(() => {
                    navigate("/login");
                }, 3000);
            } else if (error?.response?.status === 403) {
                setToasterDetailsEditMember(
                    {
                        titleMessage: "Error",
                        descriptionMessage: error?.response?.data?.message
                            ? error?.response?.data?.message
                            : "Something went wrong",
                        messageType: "error",
                    },
                    () => myRef.current()
                );
                setTimeout(() => {
                    navigate("/home");
                }, 3000);
            } else {
                setErrorToaster1(error);
            }
        }
    };
    // On Click cancel handler
    const onClickCancelHandler = () => {
        reset({ defaultValues });
        navigate("/users/members");
    };
    const onSubmit = (data) => {
        Logger.debug("data", data);
        setDisableEditMemberUpdateButton(true);

        onSubmitFunctionCall(data);
        setTimeout(() => navigate("/users/members"), 3000);
    };
    const formatRegionCountries1 = (regionCountries) => {
        regionCountries &&
            regionCountries.forEach(
                (country, id) =>
                    (regionCountries[id] = country.hasOwnProperty("_id")
                        ? country?.name
                        : country)
            );
        Logger.debug("arr of country ", regionCountries);
        return regionCountries;
    };

    //method to handle country change
    const onCountryChangeHandler1 = async (e) => {
        setValue("country", e.target.value);
        setValue("state", "");
        setValue("city", "");
        getCites();
        trigger("country");
        try {
            if (watch("country")) {
                const stateCountries = await axios.get(
                    STATES + `/${watch("country")}`
                );
                setArrOfStateCountry(stateCountries.data);
            }
        } catch (error) {
            Logger.debug("error");
        }
    };

    //method to set region and update other fields accordingly
    const onRegionChangeHandler1 = async (e) => {
        setValue("country", "");
        setValue("state", "");
        setValue("city", "");
        setValue("region", e.target.value);
        trigger("region");
        const countriesOnRegion = await getCountries1(watch("region"));
        const arrOfCountryRegionsTemp = formatRegionCountries1(
            countriesOnRegion?.data
        );
        arrOfCountryRegionsTemp &&
            setArrOfCountryRegions([...arrOfCountryRegionsTemp]);
    };

    const categoryChangeHandler1 = (e) => {
        setValue("cgfCategory", e.target.value);
        trigger("cgfCategory");
        setValue("cgfActivity", "");
    };
    const getCites = async () => {
        try {
            let url =
                CITES +
                `/?region=${watch("region")}&country=${watch("country")}`;
            if (watch("state")) {
                url += `&state=${watch("state")}`;
            }
            const response = await axios.get(url);
            Logger.debug("cites from backend", response?.data);
            setArrOfCites(response?.data);
        } catch (error) {
            if (error?.code === "ERR_CANCELED") return;

            setErrorToaster1(error);
        }
    };

    //method to handle state change
    const onStateChangeHandler = async (e) => {
        setValue("state", e.target.value);
        setValue("city", "");
        getCites();
    };
    const getCountryCode1 = async (controller) => {
        try {
            const response = await axios.get(COUNTRIES, {
                signal: controller.signal,
            });
            let arrOfCountryCodeTemp = [];
            response.data.forEach((code, id) => {
                if (!code.countryCode) return;
                arrOfCountryCodeTemp.push(code.countryCode);
            });
            const countryCodeSet = new Set(arrOfCountryCodeTemp);
            setArrOfCountryCode([...countryCodeSet]);
        } catch (error) {
            if (error?.code === "ERR_CANCELED") return;
        }
    };
    const getCountries1 = async (region) => {
        try {
            if (region) {
                return await axios.get(REGIONCOUNTRIES + `/${region}`);
            }
        } catch (error) {
            if (error?.code === "ERR_CANCELED") return;
            setErrorToaster1(error);
            return [];
        }
    };
    const getRegions1 = async (controller) => {
        try {
            const regions = await axios.get(REGIONS, {
                signal: controller.signal,
            });

            setArrOfRegions(regions?.data);
            const countriesOnRegion1 = await getCountries1(watch("region"));

            const arrOfCountryRegionsTemp1 = formatRegionCountries1(
                countriesOnRegion1.data
            );
            setArrOfCountryRegions([...arrOfCountryRegionsTemp1]);
            const countriesOnRegion2 = await getCountries1(
                watch("cgfOfficeRegion")
            );
            Logger.debug("countriesOnRegion2", countriesOnRegion2);
            const arrOfCgfOfficeCountryRegionsTemp1 =
                await formatRegionCountries1(countriesOnRegion2.data);
            setArrOfCgfOfficeCountryRegions([
                ...arrOfCgfOfficeCountryRegionsTemp1,
            ]);
            const stateCountries = await axios.get(
                STATES + `/${watch("country")}`
            );
            Logger.debug(
                "stateCountries",
                stateCountries,
                "country",
                watch("country")
            );
            setArrOfStateCountry(stateCountries.data);

            // getCountries1()
            return arrOfRegions;
        } catch (error) {
            if (error?.code === "ERR_CANCELED") return;

            return [];
        }
    };
    // const getCgfOfficeCountryRegion = async () => {
    //   Logger.debug("Inside office change function: ", watch("cgfOfficeRegion"));
    //   const countriesOnRegion = await getCountries1(watch("cgfOfficeRegion"));
    //   Logger.debug("countries region", countriesOnRegion);
    //   const arrOfCgfOfficeCountryRegionsTemp = formatRegionCountries1(
    //     countriesOnRegion.data
    //   );
    //   setArrOfCgfOfficeCountryRegions([...arrOfCgfOfficeCountryRegionsTemp]);
    // };
    // Fetch roles
    let fetchRoles = async () => {
        try {
            const response = await privateAxios.get(FETCH_ROLES);
            Logger.debug("Response from fetch roles - ", response);
            setRoles(response.data);
        } catch (error) {
            Logger.debug("Error from fetch roles", error);
        }
    };
    const getMemberByID1 = async (isMounted) => {
        try {
            setIsEditMemberLoading(true);
            const response = await axios.get(MEMBER + `/${param.id}`);
            const data = response.data;
            setIsEditMemberLoading(false);
            reset({
                memberCompany: data?.companyName,
                companyType: data?.companyType,
                parentCompany: data?.parentCompany,
                cgfCategory: data?.cgfCategory,
                cgfActivity: data?.cgfActivity ?? "N/A",
                corporateEmail: data?.corporateEmail,
                countryCode: data?.countryCode,
                phoneNumber: data?.phoneNumber?.toString(),
                websiteUrl: data?.website,
                region: data?.region,
                country: data?.country,
                state: data?.state,
                city: data?.city,
                address: data?.address,
                cgfOfficeRegion: data?.cgfOfficeRegion,
                cgfOfficeCountry: data?.cgfOfficeCountry,
                cgfOffice: data?.cgfOffice,
                memberContactSalutation:
                    data?.memberRepresentativeId[0]?.salutation,
                memberContactFullName: data?.memberRepresentativeId[0]?.name,
                title: data?.memberRepresentativeId[0]?.title,
                department: data?.memberRepresentativeId[0]?.department,
                memberContactCountryCode:
                    data?.memberRepresentativeId[0]?.countryCode,
                memberContactEmail: data?.memberRepresentativeId[0]?.email,
                memberContactPhoneNuber:
                    data?.memberRepresentativeId[0]?.phoneNumber?.toString(),
                status: data?.memberRepresentativeId[0]?.isActive
                    ? "active"
                    : "inactive",
                roleId: data?.memberRepresentativeId[0]?.roleId,
            });
            setMember(response.data);
            getCites();
            setDisableMember(
                response?.data?.memberRepresentativeId?.length > 0
                    ? false
                    : true
            );
        } catch (error) {
            if (error?.code === "ERR_CANCELED") return;
            Logger.debug("error", error);
            if (error?.response?.status == 401) {
                setToasterDetailsEditMember(
                    {
                        titleMessage: "Error",
                        descriptionMessage:
                            "Session Timeout: Please login again",
                        messageType: "error",
                    },
                    () => myRef.current()
                );
                setTimeout(() => {
                    navigate("/login");
                }, 3000);
            } else if (error?.response?.status === 403) {
                setToasterDetailsEditMember(
                    {
                        titleMessage: "Error",
                        descriptionMessage: error?.response?.data?.message
                            ? error?.response?.data?.message
                            : "Something went wrong",
                        messageType: "error",
                    },
                    () => myRef.current()
                );
                setTimeout(() => {
                    navigate("/home");
                }, 3000);
            } else {
                setIsEditMemberLoading(false);
                isMounted && setErrorToaster1(error);
            }
        }
    };
    //prevent form submission on press of enter key
    const checkKeyDown = (e) => {
        if (e.code === "Enter") e.preventDefault();
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

    const callGetCategories = async () => {
        MEMBER_LOOKUP = await getCategories();

        Logger.debug("MEMBER LOOKUP", MEMBER_LOOKUP);
    };
    const callGetOffices = async () => {
        CGF_OFFICES = await getCGFOffices();
    };
    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
        (async () => {
            Object.keys(MEMBER_LOOKUP)?.length === 0 && callGetCategories();
            CGF_OFFICES?.length === 0 && callGetOffices();
            isMounted && (await getMemberByID1(isMounted));
            isMounted && (await getRegions1(controller));
            isMounted && (await getCountryCode1(controller));
            isMounted && fetchRoles();
        })();
        // Logger.debug("member",member)

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [watch]);
    Logger.debug("member: ", member);
    Logger.debug("disable: ", disableMember);
    return (
        <div className="page-wrapper">
            <Toaster
                myRef={myRef}
                titleMessage={toasterDetailsEditMember.titleMessage}
                descriptionMessage={toasterDetailsEditMember.descriptionMessage}
                messageType={toasterDetailsEditMember.messageType}
            />
            <div className="breadcrumb-wrapper">
                <div className="container">
                    <ul className="breadcrumb">
                        <li>
                            <Link to="/users/members">Members</Link>
                        </li>
                        <li>
                            <Link to={`/users/members/view-member/${param.id}`}>
                                View Member
                            </Link>
                        </li>
                        <li>Edit Member</li>
                    </ul>
                </div>
            </div>
            <section>
                <div className="container">
                    <div className="form-header flex-between">
                        <h2 className="heading2">Edit Member</h2>
                    </div>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        onKeyDown={(e) => checkKeyDown(e)}
                    >
                        {isEditMemberLoading ? (
                            <Loader />
                        ) : (
                            <div className="card-wrapper">
                                <div className="card-inner-wrap">
                                    <h2 className="sub-heading1">
                                        Company Detail
                                    </h2>
                                    <div className="card-blk flex-between">
                                        <div className="card-form-field">
                                            <div className="form-group">
                                                <label htmlFor="memberCompany">
                                                    Member Company{" "}
                                                    <span className="mandatory">
                                                        *
                                                    </span>
                                                </label>
                                                <Input
                                                    control={control}
                                                    name="memberCompany"
                                                    onBlur={(e) =>
                                                        setValue(
                                                            "memberCompany",
                                                            e.target.value?.trim()
                                                        )
                                                    }
                                                    placeholder="Enter member company"
                                                    myHelper={memberHelper}
                                                    rules={{
                                                        required: true,
                                                        maxLength: 50,
                                                        minLength: 3,
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div className="card-form-field">
                                            <div className="form-group">
                                                <label htmlFor="companyType">
                                                    Company Type{" "}
                                                    <span className="mandatory">
                                                        *
                                                    </span>
                                                </label>
                                                <div className="radio-btn-field">
                                                    <Controller
                                                        name="companyType"
                                                        control={control}
                                                        render={({ field }) => (
                                                            <RadioGroup
                                                                {...field}
                                                                aria-labelledby="demo-radio-buttons-group-label"
                                                                name="radio-buttons-group"
                                                                className="radio-btn"
                                                            >
                                                                <FormControlLabel
                                                                    disabled
                                                                    value="Internal"
                                                                    control={
                                                                        <Radio />
                                                                    }
                                                                    label="Internal"
                                                                />
                                                                <FormControlLabel
                                                                    disabled
                                                                    value="External"
                                                                    control={
                                                                        <Radio />
                                                                    }
                                                                    label="External"
                                                                />
                                                            </RadioGroup>
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-form-field">
                                            <div className="form-group">
                                                <label htmlFor="parentCompany">
                                                    Parent Company
                                                </label>
                                                <Controller
                                                    name="parentCompany"
                                                    control={control}
                                                    render={({
                                                        field,
                                                        fieldState: { error },
                                                    }) => (
                                                        <EditMemberAutoComplete
                                                            disabled
                                                            className="searchable-input"
                                                            PaperComponent={({
                                                                children,
                                                            }) => (
                                                                <Paper
                                                                    className={
                                                                        "autocomplete-option-txt"
                                                                    }
                                                                >
                                                                    {children}
                                                                </Paper>
                                                            )}
                                                            {...field}
                                                            onSubmit={() =>
                                                                setValue(
                                                                    "parentCompany",
                                                                    ""
                                                                )
                                                            }
                                                            onChange={(
                                                                event,
                                                                newValue
                                                            ) => {
                                                                Logger.debug(
                                                                    "new Value ",
                                                                    newValue
                                                                );
                                                                if (newValue) {
                                                                    typeof newValue ===
                                                                    "object"
                                                                        ? setValue(
                                                                              "parentCompany",
                                                                              newValue.name
                                                                          )
                                                                        : setValue(
                                                                              "parentCompany",
                                                                              newValue
                                                                          );
                                                                }
                                                            }}
                                                            onBlur={(e) =>
                                                                setValue(
                                                                    "parentCompany",
                                                                    e.target.value?.trim()
                                                                )
                                                            }
                                                            selectOnFocus
                                                            handleHomeEndKeys
                                                            id="free-solo-with-text-demo"
                                                            // options={parentCompany}
                                                            // getOptionLabel={(option) => {
                                                            //   // Value selected with enter, right from the input
                                                            //   if (typeof option === "string") {
                                                            //     // Logger.debug("option inside type string",option)
                                                            //     return option;
                                                            //   }
                                                            //   return option;
                                                            // }}
                                                            renderOption={(
                                                                props,
                                                                option
                                                            ) => (
                                                                <li {...props}>
                                                                    {option}
                                                                </li>
                                                            )}
                                                            //   sx={{ width: 300 }}
                                                            freeSolo
                                                            renderInput={(
                                                                params
                                                            ) => (
                                                                <TextField
                                                                    {...params}
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        setValue(
                                                                            "parentCompany",
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    onSubmit={() =>
                                                                        setValue(
                                                                            "parentCompany",
                                                                            ""
                                                                        )
                                                                    }
                                                                    placeholder="N/A"
                                                                />
                                                            )}
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </div>
                                        <div className="card-form-field">
                                            <div className="form-group">
                                                {/* <div className="select-field"> */}
                                                <label htmlFor="cgfCategory">
                                                    CGF Category{" "}
                                                    <span className="mandatory">
                                                        *
                                                    </span>
                                                </label>
                                                <Dropdown
                                                    control={control}
                                                    name="cgfCategory"
                                                    placeholder="Select category"
                                                    myHelper={memberHelper}
                                                    rules={{ required: true }}
                                                    myOnChange={
                                                        categoryChangeHandler1
                                                    }
                                                    options={
                                                        Object.keys(
                                                            MEMBER_LOOKUP
                                                        )?.length > 0 &&
                                                        Object.keys(
                                                            MEMBER_LOOKUP
                                                        )
                                                    }
                                                />
                                            </div>
                                            {/* </div> */}
                                        </div>
                                        <div className="card-form-field">
                                            <div className="form-group">
                                                {/* <div className="select-field"> */}
                                                <label htmlFor="cgfActivity">
                                                    CGF Activity{" "}
                                                    <span className="mandatory">
                                                        *
                                                    </span>
                                                </label>
                                                <Dropdown
                                                    control={control}
                                                    name="cgfActivity"
                                                    placeholder="Select activity"
                                                    myHelper={memberHelper}
                                                    rules={{
                                                        validate: (value) => {
                                                            if (
                                                                !value &&
                                                                (watch(
                                                                    "cgfCategory"
                                                                ) ===
                                                                    "Manufacturer" ||
                                                                    watch(
                                                                        "cgfCategory"
                                                                    ) ===
                                                                        "Retailer")
                                                            )
                                                                return "Select activity";
                                                        },
                                                    }}
                                                    options={
                                                        Object.keys(MEMBER)
                                                            .length > 0 &&
                                                        MEMBER_LOOKUP[
                                                            watch("cgfCategory")
                                                        ]
                                                    }
                                                    isDisabled={
                                                        watch("cgfCategory") ===
                                                        "Other"
                                                    }
                                                />
                                            </div>
                                            {/* </div> */}
                                        </div>
                                    </div>
                                </div>
                                <div className="card-inner-wrap">
                                    <h2 className="sub-heading1">
                                        Contact Detail
                                    </h2>
                                    <div className="flex-between card-blk">
                                        <div className="card-form-field">
                                            <div className="form-group">
                                                <label htmlFor="corporateEmail">
                                                    Corporate Email{" "}
                                                    <span className="mandatory">
                                                        *
                                                    </span>
                                                </label>
                                                <Input
                                                    control={control}
                                                    name="corporateEmail"
                                                    onBlur={(e) =>
                                                        setValue(
                                                            "corporateEmail",
                                                            e.target.value?.trim()
                                                        )
                                                    }
                                                    placeholder="example@domain.com"
                                                    myHelper={memberHelper}
                                                    rules={{
                                                        required: "true",
                                                        maxLength: 50,
                                                        minLength: 3,
                                                        pattern:
                                                            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="card-form-field">
                                            <div className="form-group">
                                                <label htmlFor="phoneNumber">
                                                    Phone Number
                                                </label>
                                                <div className="phone-number-field">
                                                    <div className="select-field country-code">
                                                        <Controller
                                                            control={control}
                                                            name="countryCode"
                                                            rules={{
                                                                validate:
                                                                    () => {
                                                                        if (
                                                                            !watch(
                                                                                "countryCode"
                                                                            ) &&
                                                                            watch(
                                                                                "phoneNumber"
                                                                            )
                                                                        )
                                                                            return "Invalid input";
                                                                    },
                                                            }}
                                                            // rules={{
                                                            //   validate: () => {
                                                            //     if (watch("phoneNumber") && !watch("countryCode"))
                                                            //       return "Invalid Input";
                                                            //   },
                                                            // }}
                                                            render={({
                                                                field,
                                                                fieldState: {
                                                                    error,
                                                                },
                                                            }) => (
                                                                <EditMemberAutoComplete
                                                                    popupIcon={
                                                                        <KeyboardArrowDownRoundedIcon />
                                                                    }
                                                                    PaperComponent={({
                                                                        children,
                                                                    }) => (
                                                                        <Paper
                                                                            className={
                                                                                arrOfCountryCode?.length >
                                                                                5
                                                                                    ? "autocomplete-option-txt autocomplete-option-limit"
                                                                                    : "autocomplete-option-txt"
                                                                            }
                                                                        >
                                                                            {
                                                                                children
                                                                            }
                                                                        </Paper>
                                                                    )}
                                                                    {...field}
                                                                    className={`${
                                                                        error &&
                                                                        "autocomplete-error"
                                                                    }`}
                                                                    onChange={(
                                                                        event,
                                                                        newValue
                                                                    ) => {
                                                                        Logger.debug(
                                                                            "inside autocomplete onchange"
                                                                        );
                                                                        Logger.debug(
                                                                            "new Value ",
                                                                            newValue
                                                                        );
                                                                        newValue &&
                                                                        typeof newValue ===
                                                                            "object"
                                                                            ? setValue(
                                                                                  "countryCode",
                                                                                  newValue.name
                                                                              )
                                                                            : setValue(
                                                                                  "countryCode",
                                                                                  newValue
                                                                              );
                                                                        trigger(
                                                                            "countryCode"
                                                                        );
                                                                        trigger(
                                                                            "phoneNumber"
                                                                        );
                                                                    }}
                                                                    // sx={{ width: 200 }}
                                                                    options={
                                                                        arrOfCountryCode
                                                                    }
                                                                    autoHighlight
                                                                    // placeholder="Select country code"
                                                                    // getOptionLabel={(country) => country.name + " " + country}
                                                                    renderOption={(
                                                                        props,
                                                                        option
                                                                    ) => (
                                                                        <li
                                                                            {...props}
                                                                        >
                                                                            {
                                                                                option
                                                                            }
                                                                        </li>
                                                                    )}
                                                                    renderInput={(
                                                                        params
                                                                    ) => (
                                                                        <TextField
                                                                            // className={`input-field ${
                                                                            //   error && "input-error"
                                                                            // }`}
                                                                            {...params}
                                                                            inputProps={{
                                                                                ...params.inputProps,
                                                                            }}
                                                                            onChange={() =>
                                                                                trigger(
                                                                                    "countryCode"
                                                                                )
                                                                            }
                                                                            // onSubmit={() => setValue("countryCode", "")}
                                                                            placeholder={
                                                                                "+91"
                                                                            }
                                                                            helperText={
                                                                                error
                                                                                    ? memberHelper
                                                                                          .countryCode[
                                                                                          error
                                                                                              ?.type
                                                                                      ]
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
                                                        name="phoneNumber"
                                                        myOnChange={(e) =>
                                                            phoneNumberChangeHandler(
                                                                e,
                                                                "phoneNumber",
                                                                "countryCode"
                                                            )
                                                        }
                                                        onBlur={(e) =>
                                                            setValue(
                                                                "phoneNumber",
                                                                e.target.value?.trim()
                                                            )
                                                        }
                                                        placeholder="1234567890"
                                                        myHelper={memberHelper}
                                                        rules={{
                                                            maxLength: 15,
                                                            minLength: 7,
                                                            validate: (
                                                                value
                                                            ) => {
                                                                if (
                                                                    !watch(
                                                                        "phoneNumber"
                                                                    ) &&
                                                                    watch(
                                                                        "countryCode"
                                                                    )
                                                                )
                                                                    return "invalid input";
                                                                if (
                                                                    value &&
                                                                    !Number(
                                                                        value
                                                                    )
                                                                )
                                                                    return "Invalid input";
                                                            },
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-form-field">
                                            <div className="form-group">
                                                <label htmlFor="websiteUrl">
                                                    Website URL
                                                </label>
                                                <Input
                                                    control={control}
                                                    name="websiteUrl"
                                                    onBlur={(e) =>
                                                        setValue(
                                                            "websiteUrl",
                                                            e.target.value?.trim()
                                                        )
                                                    }
                                                    placeholder="www.google.com"
                                                    myHelper={memberHelper}
                                                    rules={{
                                                        maxLength: 50,
                                                        minLength: 3,
                                                        pattern:
                                                            /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-inner-wrap">
                                    <h2 className="sub-heading1">
                                        Company Address Detail
                                    </h2>
                                    <div className="flex-between card-blk">
                                        <div className="card-form-field">
                                            <div className="form-group">
                                                <label htmlFor="region">
                                                    Region{" "}
                                                    <span className="mandatory">
                                                        *
                                                    </span>
                                                </label>
                                                <Dropdown
                                                    control={control}
                                                    myOnChange={
                                                        onRegionChangeHandler1
                                                    }
                                                    name="region"
                                                    placeholder="Select region"
                                                    myHelper={memberHelper}
                                                    rules={{ required: true }}
                                                    options={arrOfRegions}
                                                />
                                            </div>
                                        </div>
                                        <div className="card-form-field">
                                            <div className="form-group">
                                                <label htmlFor="country">
                                                    Country{" "}
                                                    <span className="mandatory">
                                                        *
                                                    </span>
                                                </label>
                                                <Dropdown
                                                    isDisabled={
                                                        !watch("region")
                                                    }
                                                    control={control}
                                                    name="country"
                                                    myOnChange={
                                                        onCountryChangeHandler1
                                                    }
                                                    placeholder="Select country"
                                                    myHelper={memberHelper}
                                                    rules={{ required: true }}
                                                    options={
                                                        arrOfCountryRegions
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className="card-form-field">
                                            <div className="form-group">
                                                <label htmlFor="state">
                                                    State
                                                </label>
                                                <Dropdown
                                                    isDisabled={
                                                        !watch("country")
                                                    }
                                                    control={control}
                                                    name="state"
                                                    placeholder="Enter state"
                                                    myOnChange={
                                                        onStateChangeHandler
                                                    }
                                                    myHelper={memberHelper}
                                                    options={arrOfStateCountry}
                                                />
                                            </div>
                                        </div>
                                        <div className="card-form-field">
                                            <div className="form-group">
                                                <label htmlFor="city">
                                                    City
                                                </label>
                                                <Controller
                                                    name="city"
                                                    control={control}
                                                    render={({
                                                        field,
                                                        fieldState: { error },
                                                    }) => (
                                                        <EditMemberAutoComplete
                                                            {...field}
                                                            className="searchable-input"
                                                            PaperComponent={({
                                                                children,
                                                            }) =>
                                                                watch("city")
                                                                    ?.length >
                                                                    0 && (
                                                                    <Paper
                                                                        className={
                                                                            arrOfCites?.length >
                                                                            5
                                                                                ? "autocomplete-option-txt autocomplete-option-limit"
                                                                                : "autocomplete-option-txt"
                                                                        }
                                                                    >
                                                                        {
                                                                            children
                                                                        }
                                                                    </Paper>
                                                                )
                                                            }
                                                            disabled={
                                                                !watch(
                                                                    "country"
                                                                )
                                                            }
                                                            onSubmit={() =>
                                                                setValue(
                                                                    "city",
                                                                    ""
                                                                )
                                                            }
                                                            onChange={(
                                                                event,
                                                                newValue
                                                            ) => {
                                                                Logger.debug(
                                                                    "new Value ",
                                                                    newValue
                                                                );
                                                                if (newValue) {
                                                                    typeof newValue ===
                                                                    "object"
                                                                        ? setValue(
                                                                              "city",
                                                                              newValue.name
                                                                          )
                                                                        : setValue(
                                                                              "city",
                                                                              newValue
                                                                          );
                                                                }
                                                            }}
                                                            onBlur={(e) =>
                                                                setValue(
                                                                    "city",
                                                                    e.target.value?.trim()
                                                                )
                                                            }
                                                            selectOnFocus
                                                            handleHomeEndKeys
                                                            id="free-solo-with-text-demo"
                                                            options={arrOfCites}
                                                            // getOptionLabel={(option) => {
                                                            //   // Value selected with enter, right from the input
                                                            //   if (typeof option === "string") {
                                                            //     // Logger.debug("option inside type string",option)
                                                            //     return option;
                                                            //   }
                                                            //   return option;
                                                            // }}
                                                            renderOption={(
                                                                props,
                                                                option
                                                            ) => (
                                                                <li {...props}>
                                                                    {option}
                                                                </li>
                                                            )}
                                                            //   sx={{ width: 300 }}
                                                            freeSolo
                                                            renderInput={(
                                                                params
                                                            ) => (
                                                                <TextField
                                                                    {...params}
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        setValue(
                                                                            "city",
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    onSubmit={() =>
                                                                        setValue(
                                                                            "city",
                                                                            ""
                                                                        )
                                                                    }
                                                                    placeholder="N/A"
                                                                />
                                                            )}
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </div>

                                        <div className="card-form-field">
                                            <div className="form-group">
                                                <label htmlFor="address">
                                                    Address
                                                </label>
                                                <Controller
                                                    name="address"
                                                    control={control}
                                                    rules={{
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
                                                            onBlur={(e) =>
                                                                setValue(
                                                                    "address",
                                                                    e.target.value?.trim()
                                                                )
                                                            }
                                                            inputProps={{
                                                                maxLength: 250,
                                                            }}
                                                            className={`input-textarea ${
                                                                error &&
                                                                "input-textarea-error"
                                                            }`}
                                                            id="outlined-basic"
                                                            placeholder="Enter address"
                                                            helperText={
                                                                error
                                                                    ? memberHelper
                                                                          .address[
                                                                          error
                                                                              .type
                                                                      ]
                                                                    : " "
                                                            }
                                                            variant="outlined"
                                                        />
                                                    )}
                                                />
                                                {/* Add Address Text Area field here */}
                                                {/* <Input control={control} name="city" placeholder="Enter state"/> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-inner-wrap">
                                    <h2 className="sub-heading1">
                                        CGF Office Detail
                                    </h2>
                                    <div className="flex-between card-blk">
                                        <div className="card-form-field">
                                            <div className="form-group">
                                                <label htmlFor="cgfOfficeRegion">
                                                    Region{" "}
                                                    <span className="mandatory">
                                                        *
                                                    </span>
                                                </label>
                                                <Dropdown
                                                    isDisabled
                                                    control={control}
                                                    name="cgfOfficeRegion"
                                                    // myOnChange={cgfOfficeRegionChangeHandler}
                                                    placeholder="Select Region"
                                                    myHelper={memberHelper}
                                                    rules={{ required: true }}
                                                    options={arrOfRegions}
                                                />
                                            </div>
                                        </div>
                                        <div className="card-form-field">
                                            <div className="form-group">
                                                <label htmlFor="cgfOfficeCountry">
                                                    Country{" "}
                                                    <span className="mandatory">
                                                        *
                                                    </span>
                                                </label>
                                                <Dropdown
                                                    isDisabled
                                                    control={control}
                                                    name="cgfOfficeCountry"
                                                    placeholder="Select country"
                                                    myHelper={memberHelper}
                                                    rules={{ required: true }}
                                                    options={
                                                        arrOfCgfOfficeCountryRegions
                                                            ? arrOfCgfOfficeCountryRegions
                                                            : []
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className="card-form-field">
                                            <div className="form-group">
                                                <label htmlFor="cgfOffice">
                                                    Office{" "}
                                                    <span className="mandatory">
                                                        *
                                                    </span>
                                                </label>
                                                <Dropdown
                                                    isDisabled
                                                    control={control}
                                                    name="cgfOffice"
                                                    placeholder="Select office"
                                                    myHelper={memberHelper}
                                                    rules={{ required: true }}
                                                    options={CGF_OFFICES}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-inner-wrap">
                                    <h2 className="sub-heading1">
                                        Representative Contact Detail
                                    </h2>
                                    <div className="flex-between card-blk">
                                        <div className="card-form-field">
                                            <div className="form-group">
                                                <div className="salutation-wrap">
                                                    <div className="salutation-blk">
                                                        <label htmlFor="memberContactSalutation">
                                                            Salutation{" "}
                                                            <span className="mandatory">
                                                                *
                                                            </span>
                                                        </label>
                                                        <Dropdown
                                                            control={control}
                                                            name="memberContactSalutation"
                                                            placeholder=""
                                                            myHelper={
                                                                memberHelper
                                                            }
                                                            rules={{
                                                                required: true,
                                                            }}
                                                            options={[
                                                                "Mr.",
                                                                "Mrs.",
                                                                "Ms.",
                                                            ]}
                                                        />
                                                    </div>
                                                    <div className="salutation-inputblk">
                                                        <label htmlFor="memberContactFullName">
                                                            Full Name{" "}
                                                            <span className="mandatory">
                                                                *
                                                            </span>
                                                        </label>
                                                        <Input
                                                            control={control}
                                                            myHelper={
                                                                memberHelper
                                                            }
                                                            rules={{
                                                                required: true,
                                                                maxLength: 50,
                                                                minLength: 3,
                                                                pattern:
                                                                    /^[a-zA-Z][a-zA-Z ]*$/,
                                                            }}
                                                            name="memberContactFullName"
                                                            onBlur={(e) =>
                                                                setValue(
                                                                    "memberContactFullName",
                                                                    e.target.value?.trim()
                                                                )
                                                            }
                                                            placeholder="Enter full name"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-form-field">
                                            <div className="form-group">
                                                <label htmlFor="title">
                                                    Job Title
                                                </label>
                                                <Input
                                                    control={control}
                                                    myHelper={memberHelper}
                                                    isDisabled={disableMember}
                                                    rules={{
                                                        maxLength: 50,
                                                        minLength: 3,
                                                    }}
                                                    name="title"
                                                    onBlur={(e) =>
                                                        setValue(
                                                            "title",
                                                            e.target.value?.trim()
                                                        )
                                                    }
                                                    placeholder="Enter job title"
                                                />
                                            </div>
                                        </div>
                                        <div className="card-form-field">
                                            <div className="form-group">
                                                <label htmlFor="department">
                                                    Department
                                                </label>
                                                <Input
                                                    control={control}
                                                    myHelper={memberHelper}
                                                    rules={{
                                                        maxLength: 50,
                                                        minLength: 3,
                                                    }}
                                                    isDisabled={disableMember}
                                                    name="department"
                                                    onBlur={(e) =>
                                                        setValue(
                                                            "department",
                                                            e.target.value?.trim()
                                                        )
                                                    }
                                                    placeholder="Enter department"
                                                />
                                            </div>
                                        </div>
                                        <div className="card-form-field">
                                            <div className="form-group">
                                                <label htmlFor="memberContactEmail">
                                                    Email{" "}
                                                    <span className="mandatory">
                                                        *
                                                    </span>
                                                </label>
                                                <Input
                                                    isDisabled
                                                    control={control}
                                                    myHelper={memberHelper}
                                                    rules={{
                                                        required: true,
                                                        maxLength: 50,
                                                        minLength: 3,
                                                        pattern:
                                                            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                                    }}
                                                    name="memberContactEmail"
                                                    onBlur={(e) =>
                                                        setValue(
                                                            "memberContactEmail",
                                                            e.target.value?.trim()
                                                        )
                                                    }
                                                    placeholder="N/A"
                                                />
                                            </div>
                                        </div>
                                        <div className="card-form-field">
                                            <div className="form-group">
                                                <label htmlFor="memberContactPhoneNumber">
                                                    Phone Number
                                                </label>
                                                <div className="phone-number-field">
                                                    <div className="select-field country-code">
                                                        <Controller
                                                            control={control}
                                                            name="memberContactCountryCode"
                                                            rules={{
                                                                validate:
                                                                    () => {
                                                                        if (
                                                                            !watch(
                                                                                "memberContactCountryCode"
                                                                            ) &&
                                                                            watch(
                                                                                "memberContactPhoneNuber"
                                                                            )
                                                                        )
                                                                            return "Invalid input";
                                                                    },
                                                            }}
                                                            render={({
                                                                field,
                                                                fieldState: {
                                                                    error,
                                                                },
                                                            }) => (
                                                                <EditMemberAutoComplete
                                                                    {...field}
                                                                    className={`${
                                                                        error &&
                                                                        "autocomplete-error"
                                                                    }`}
                                                                    popupIcon={
                                                                        <KeyboardArrowDownRoundedIcon />
                                                                    }
                                                                    PaperComponent={({
                                                                        children,
                                                                    }) => (
                                                                        <Paper
                                                                            className={
                                                                                arrOfCountryCode?.length >
                                                                                5
                                                                                    ? "autocomplete-option-txt autocomplete-option-limit"
                                                                                    : "autocomplete-option-txt"
                                                                            }
                                                                        >
                                                                            {
                                                                                children
                                                                            }
                                                                        </Paper>
                                                                    )}
                                                                    onChange={(
                                                                        event,
                                                                        newValue
                                                                    ) => {
                                                                        newValue &&
                                                                        typeof newValue ===
                                                                            "object"
                                                                            ? setValue(
                                                                                  "memberContactCountryCode",
                                                                                  newValue.name
                                                                              )
                                                                            : setValue(
                                                                                  "memberContactCountryCode",
                                                                                  newValue
                                                                              );
                                                                        trigger(
                                                                            "memberContactCountryCode"
                                                                        );
                                                                        trigger(
                                                                            "memberContactPhoneNuber"
                                                                        );
                                                                    }}
                                                                    // sx={{ width: 200 }}
                                                                    options={
                                                                        arrOfCountryCode
                                                                    }
                                                                    autoHighlight
                                                                    placeholder="Select country code"
                                                                    // getOptionLabel={(country) => country.name + " " + country}
                                                                    renderOption={(
                                                                        props,
                                                                        option
                                                                    ) => (
                                                                        <li
                                                                            {...props}
                                                                        >
                                                                            {
                                                                                option
                                                                            }
                                                                        </li>
                                                                    )}
                                                                    renderInput={(
                                                                        params
                                                                    ) => (
                                                                        <TextField
                                                                            {...params}
                                                                            inputProps={{
                                                                                ...params.inputProps,
                                                                            }}
                                                                            isDisabled={
                                                                                disableMember
                                                                            }
                                                                            onChange={() =>
                                                                                trigger(
                                                                                    "memberContactPhoneNuber"
                                                                                )
                                                                            }
                                                                            // onSubmit={() =>
                                                                            //   setValue("memberContactCountryCode", "")
                                                                            // }
                                                                            placeholder={
                                                                                "+91"
                                                                            }
                                                                            disabled={
                                                                                disableMember
                                                                            }
                                                                            helperText={
                                                                                error
                                                                                    ? memberHelper
                                                                                          .countryCode[
                                                                                          error
                                                                                              ?.type
                                                                                      ]
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
                                                        name="memberContactPhoneNuber"
                                                        myOnChange={(e) =>
                                                            phoneNumberChangeHandler(
                                                                e,
                                                                "memberContactPhoneNuber",
                                                                "memberContactCountryCode"
                                                            )
                                                        }
                                                        onBlur={(e) =>
                                                            setValue(
                                                                "memberContactPhoneNuber",
                                                                e.target.value?.trim()
                                                            )
                                                        }
                                                        myHelper={memberHelper}
                                                        rules={{
                                                            maxLength: 15,
                                                            minLength: 3,
                                                            validate: (
                                                                value
                                                            ) => {
                                                                if (
                                                                    !watch(
                                                                        "memberContactPhoneNuber"
                                                                    ) &&
                                                                    watch(
                                                                        "memberContactCountryCode"
                                                                    )
                                                                )
                                                                    return "invalid input";
                                                                if (
                                                                    value &&
                                                                    !Number(
                                                                        value
                                                                    )
                                                                )
                                                                    return "Invalid input";
                                                            },
                                                        }}
                                                        placeholder="1234567890"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-form-field">
                                            <div className="form-group">
                                                <label htmlFor="role">
                                                    Role{" "}
                                                    <span className="mandatory">
                                                        *
                                                    </span>
                                                </label>

                                                <div>
                                                    <Dropdown
                                                        name="roleId"
                                                        control={control}
                                                        options={roles}
                                                        rules={{
                                                            required: true,
                                                        }}
                                                        myHelper={memberHelper}
                                                        placeholder={
                                                            "Select role"
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-form-field">
                                            <div className="form-group">
                                                <label htmlFor="status">
                                                    Status{" "}
                                                    <span className="mandatory">
                                                        *
                                                    </span>
                                                </label>
                                                <div className="radio-btn-field">
                                                    <Controller
                                                        name="status"
                                                        control={control}
                                                        render={({ field }) => (
                                                            <RadioGroup
                                                                {...field}
                                                                aria-labelledby="demo-radio-buttons-group-label"
                                                                name="radio-buttons-group"
                                                                className="radio-btn"
                                                            >
                                                                <FormControlLabel
                                                                    value="active"
                                                                    control={
                                                                        <Radio />
                                                                    }
                                                                    label="Active"
                                                                />
                                                                <FormControlLabel
                                                                    value="inactive"
                                                                    control={
                                                                        <Radio />
                                                                    }
                                                                    label="Inactive"
                                                                />
                                                            </RadioGroup>
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-btn flex-between add-members-btn">
                                    <button
                                        type="reset"
                                        onClick={onClickCancelHandler}
                                        className="secondary-button mr-10"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        //   onClick={}
                                        disabled={disableEditMemberUpdateButton}
                                        className="primary-button add-button"
                                    >
                                        Update
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </section>
        </div>
    );
};

export default EditMember;
