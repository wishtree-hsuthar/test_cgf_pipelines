// Third party packages
import {
  Box,
  Checkbox,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

//internal packages
import Toaster from "../../components/Toaster";
import "../../components/TableComponent.css";
// import { backendBase } from "../../utils/urls";
import useCallbackState from "../../utils/useCallBackState";
import { REACT_APP_API_ENDPOINT } from "../../api/Url";

const AddRole = () => {
  const navigate = useNavigate();

  //Refr for Toaster
  const myRef = React.useRef();
  //Toaster Message setter
  const [toasterDetails, setToasterDetails] = useCallbackState({
    titleMessage: "",
    descriptionMessage: "",
    messageType: "success",
  });

  //array to hold modules available
  let modules = []
  console.log("modules",modules)
  //variable to hold privileges
  let temp = {};

  //default values of input fields
  const defaultValues = {
    roleName: "",
    status: "active",
    description: "",
  };

  //helper text content for input fields
  const myHelper = {
    roleName: {
      required: "Enter the role name",
      maxLength: "Max char limit exceed",
      minLength: "Role must contain atleast 3 characters",
      pattern: "Invalid format",
    },
    description: {
      required: "Enter the description",
      maxLength: "Max char limit exceed",
      minLength: "Description must contain atlest 3 characters",
    },
  };

  const [previleges, setPrevileges] = useState({ ...temp });

  const createPrevileges = () => {
    console.log("modules in side create prive func",modules)
    modules.forEach((module) => 
       temp[module.moduleId] = {
        name: module.moduleName,
        list: false,
        add: false,
        edit: false,
        view: false,
        delete: false,
        // assign: false,
        all: false,
      }
    );
    setPrevileges({ ...temp });
  };

  const createModules = (data) => {
    data.map(
      (module, id) =>
        (modules[id] = {
          moduleName: module.name,
          moduleId: module._id,
        })
    );
    createPrevileges()
  };

  const { control, reset, setValue, handleSubmit } =
    useForm({
      defaultValues: defaultValues,
    });
  const onSubmit = async (data) => {
    console.log("inside on Submit")
    let previlegesForBackend = JSON.parse(JSON.stringify(previleges));
    Object.keys(previlegesForBackend).forEach((p_key) => {
      delete previlegesForBackend[p_key]["all"];
      delete previlegesForBackend[p_key]["name"];
    });
    // console.log("previleges : ", previlegesForBackend);
    //backend call
    try {
      await axios.post(REACT_APP_API_ENDPOINT + "roles", {
        name: data.roleName,
        description: data.description,
        isActive: data.status === "active" ? true : false,
        privileges: previlegesForBackend,
      });
      setToasterDetails(
        {
          titleMessage: "Hurray!",
          descriptionMessage: "New role added successfully",
          messageType: "success",
        },
        () => myRef.current()
      );
      reset({ defaultValues });
      setTimeout(() => navigate("/roles"), 3000);
    } catch (error) {
      console.log("error", error);
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
    }
  };
  const onSubmitAddMoreClickHandler = async (data) => {
    console.log("on Submit", data, "previleges on Submit", previleges);
    let previlegesForBackend = JSON.parse(JSON.stringify(previleges));
    Object.keys(previlegesForBackend).forEach((p_key) => {
      console.log("key", p_key);
      delete previlegesForBackend[p_key]["all"];
      delete previlegesForBackend[p_key]["name"];
    });

    console.log("pBack", previlegesForBackend, "pFront", previleges);

    //backend call
    try {
      await axios.post(REACT_APP_API_ENDPOINT + "roles", {
        name: data.roleName,
        description: data.description,
        isActive: data.status === "active" ? true : false,
        privileges: previlegesForBackend,
      });
      setToasterDetails(
        {
          titleMessage: "Hurray!",
          descriptionMessage: "New role added successfully",
          messageType: "success",
        },
        () => myRef.current()
      );
      reset({defaultValues})
    } catch (error) {
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
    }
  };
  const onClickCancelHandler = () => {
    console.log("inside on click cancel")
    reset({defaultValues})
    return navigate("/roles");
  };
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    (async () => {
      try {
        const { data } = await axios.get(REACT_APP_API_ENDPOINT + "system-modules", {
          signal: controller.signal,
        });
        isMounted && createModules(data);
      } catch (error) {
        if (error?.code === "ERR_CANCELED") return;
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
      }
    })();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return (
    <div className="page-wrapper">
      <Toaster
        myRef={myRef}
        titleMessage={toasterDetails.titleMessage}
        descriptionMessage={toasterDetails.descriptionMessage}
        messageType={toasterDetails.messageType}
      />
      <div className="breadcrumb-wrapper">
        <div className="container">
          <ul className="breadcrumb">
            <li>
              <Link to="/roles">Roles</Link>
            </li>
            <li>Add Role</li>
          </ul>
        </div>
      </div>
      <section>
        <div className="container">
          <div className="form-header flex-between">
            <h2 className="heading2">Add Role</h2>
            <div className="form-header-right-txt">
              <div className="tertiary-btn-blk">
                <span className="addmore-icon">
                  <i className="fa fa-plus"></i>
                </span>
                <span
                  className="addmore-txt"
                  onClick={handleSubmit(onSubmitAddMoreClickHandler)}
                >
                  Save & Add More
                </span>
              </div>
            </div>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="card-wrapper">
              <div className="card-blk flex-between">
                <div className="card-form-field">
                  <div className="form-group">
                    <label htmlFor="roleName">
                      Role Name <span className="mandatory">*</span>
                    </label>
                    <Controller
                      name="roleName"
                      rules={{
                        required: true,
                        maxLength: 50,
                        minLength: 3,
                        pattern: /^[A-Za-z]+[A-Za-z ]*$/,
                      }}
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          onBlur={(e) =>
                            setValue("roleName", e.target.value.trim())
                          }
                          inputProps={{
                            maxLength: 50,
                          }}
                          className={`input-field ${error && "input-error"}`}
                          id="outlined-basic"
                          placeholder="Enter role name"
                          helperText={
                            error ? myHelper.roleName[error.type] : " "
                          }
                          variant="outlined"
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="card-form-field">
                  <div className="form-group">
                    <label htmlFor="status">Status</label>
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
                              control={<Radio />}
                              label="Active"
                            />
                            <FormControlLabel
                              value="inactive"
                              control={<Radio />}
                              label="Inactive"
                            />
                          </RadioGroup>
                        )}
                      />
                    </div>
                  </div>
                </div>
                <div className="card-form-field fullwidth">
                  <div className="form-group">
                    <label htmlFor="description">
                      Description <span className="mandatory">*</span>
                    </label>
                    <Controller
                      name="description"
                      rules={{
                        required: true,
                        maxLength: 500,
                        minLength: 3,
                      }}
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          multiline
                          {...field}
                          onBlur={(e) =>
                            setValue("description", e.target.value.trim())
                          }
                          inputProps={{
                            maxLength: 500,
                          }}
                          className={`input-textarea ${
                            error && "input-textarea-error"
                          }`}
                          id="outlined-basic"
                          placeholder="Enter description"
                          helperText={
                            error ? myHelper.description[error.type] : " "
                          }
                          variant="outlined"
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
              {/* <div className="table-blk"> */}
              <Box sx={{ width: "100%" }} className="table-blk table-blk-role">
                <Paper sx={{ width: "100%" }}>
                  <TableContainer>
                    <Table sx={{ minWidth: 750 }}>
                      <TableHead>
                        <TableRow>
                          <TableCell
                            align="left"
                            className="tableHeader"
                            width="16%"
                            style={{
                              padding: "15px !important",
                            }}
                          >
                            Modules
                          </TableCell>
                          <TableCell align="center" className="tableHeader">
                            List
                          </TableCell>
                          <TableCell align="center" className="tableHeader">
                            Add
                          </TableCell>
                          <TableCell align="center" className="tableHeader">
                            Edit
                          </TableCell>
                          <TableCell align="center" className="tableHeader">
                            View
                          </TableCell>
                          <TableCell align="center" className="tableHeader">
                            Delete
                          </TableCell>
                          {/* <TableCell
                            align="center"
                            className="tableHeader"
                            width="16%"
                          >
                            Assign to Member
                          </TableCell> */}
                          <TableCell align="center" className="tableHeader">
                            All
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {Object.keys(previleges).map((previleg, _id) => {
                          return (
                            <TableRow key={previleg} hover>
                              <TableCell>
                                {previleges[previleg]["name"]}
                              </TableCell>
                              <TableCell align="center" padding="checkbox">
                                <Checkbox
                                  className="table-checkbox"
                                  checked={previleges[previleg]["list"]}
                                  onChange={() =>
                                    setPrevileges((previous) => ({
                                      ...previous,
                                      [previleg]: {
                                        ...previous[previleg],
                                        list: !previous[previleg]["list"],
                                        all: false,
                                      },
                                    }))
                                  }
                                />
                              </TableCell>
                              <TableCell align="center" padding="checkbox">
                                <Checkbox
                                  className="table-checkbox"
                                  checked={previleges[previleg]["add"]}
                                  onChange={() =>
                                    setPrevileges((previous) => ({
                                      ...previous,
                                      [previleg]: {
                                        ...previous[previleg],
                                        add: !previous[previleg]["add"],
                                        all: false,
                                      },
                                    }))
                                  }
                                />
                              </TableCell>
                              <TableCell align="center" padding="checkbox">
                                <Checkbox
                                  className="table-checkbox"
                                  checked={previleges[previleg]["edit"]}
                                  onChange={() =>
                                    setPrevileges((previous) => ({
                                      ...previous,
                                      [previleg]: {
                                        ...previous[previleg],
                                        edit: !previous[previleg]["edit"],
                                        all: false,
                                      },
                                    }))
                                  }
                                />
                              </TableCell>
                              <TableCell align="center" padding="checkbox">
                                <Checkbox
                                  className="table-checkbox"
                                  checked={previleges[previleg]["view"]}
                                  onChange={() =>
                                    setPrevileges((previous) => ({
                                      ...previous,
                                      [previleg]: {
                                        ...previous[previleg],
                                        view: !previous[previleg]["view"],
                                        all: false,
                                      },
                                    }))
                                  }
                                />
                              </TableCell>
                              <TableCell align="center" padding="checkbox">
                                <Checkbox
                                  className="table-checkbox"
                                  checked={previleges[previleg]["delete"]}
                                  onChange={() =>
                                    setPrevileges((previous) => ({
                                      ...previous,
                                      [previleg]: {
                                        ...previous[previleg],
                                        delete: !previous[previleg]["delete"],
                                        all: false,
                                      },
                                    }))
                                  }
                                />
                              </TableCell>
                              {/* <TableCell align="center" padding="checkbox">
                                <Checkbox
                                  className="table-checkbox"
                                  checked={previleges[previleg]["assign"]}
                                  onChange={() =>
                                    setPrevileges((previous) => ({
                                      ...previous,
                                      [previleg]: {
                                        ...previous[previleg],
                                        assign: !previous[previleg]["assign"],
                                        all: false,
                                      },
                                    }))
                                  }
                                />
                              </TableCell> */}
                              <TableCell align="center" padding="checkbox">
                                <Checkbox
                                  className="table-checkbox"
                                  checked={previleges[previleg]["all"]}
                                  onChange={() =>
                                    setPrevileges((previous) => ({
                                      ...previous,
                                      [previleg]: {
                                        ...previous[previleg],
                                        all: !previous[previleg]["all"],
                                        list: !previous[previleg]["all"],
                                        view: !previous[previleg]["all"],
                                        add: !previous[previleg]["all"],
                                        edit: !previous[previleg]["all"],
                                        delete: !previous[previleg]["all"],
                                        // assign: !previous[previleg]["all"],
                                      },
                                    }))
                                  }
                                />
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Box>
              {/* </div> */}
              <div className="form-btn flex-between add-members-btn">
                <button
                  type="reset"
                  style={{ marginTop: "30px" }}
                  className="secondary-button mr-10"
                  onClick={onClickCancelHandler}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="primary-button"
                  style={{ marginTop: "30px" }}
                >
                  Add
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default AddRole;
