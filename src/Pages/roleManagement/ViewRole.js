//Third party imports
import React, { useEffect, useState } from "react";
import {
  TextField,
  Box,
  Radio,
  RadioGroup,
  FormControlLabel,
  Tabs,
  Tab,
  Paper,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Table,
  TableBody,
  Checkbox,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PropTypes from "prop-types";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

//Internal Imports
import TableComponent from "../../components/TableComponent";
import DialogBox from "../../components/DialogBox";
import Toaster from "../../components/Toaster";
import useCallbackState from "../../utils/useCallBackState";
import Loader2 from "../../assets/Loader/Loader2.svg";
import { REACT_APP_API_ENDPOINT } from "../../api/Url";
import { useDocumentTitle } from "../../utils/useDocumentTitle";
import { TabPanel } from "../../utils/tabUtils/TabPanel";

const tableHead = [
  {
    id: "cgfAdmins.name",
    disablePadding: false,
    width: "20%",
    label: "Name",
  },
  {
    id: "cgfAdmins.email",
    disablePadding: false,
    label: "Email",
  },
  {
    id: "cgfAdmins.createdAt",
    disablePadding: false,
    label: "Created On",
  },
  {
    id: "cgfAdmins.isActive",
    disablePadding: false,
    label: "Status",
  },
];

const ViewRole = () => {
  //custom hook to set title of page
  useDocumentTitle("View Role");
  //Refr for Toaster
  const myRef4 = React.useRef();
  //order in which records needs to show
  const keysOrder = ["_id", "name", "email", "createdAt", "isActive"];
  //Toaster Message setter
  const [toasterDetails4, setToasterDetails4] = useCallbackState({
    titleMessage: "",
    descriptionMessage: "",
    messageType: "success",
  });

  // state to manage loader
  const [isLoading3, setIsLoading3] = useState(true);

  //code to get id from url
  const params = useParams();

  //varialble to hold privileges
  let privileges = {};
  // Dialog box code
  const [fieldValues, setFieldValues] = useState({
    roleName: "",
    status: "",
    description: "",
    subAdmin: "",
  });
  const [openDialog, setOpenDialog] = useState(false);
  const onDialogPrimaryButtonClickHandler = async () => {
    try {
      await axios.delete(REACT_APP_API_ENDPOINT + `roles/${params.id}`);
      setToasterDetails4(
        {
          titleMessage: "Success",
          descriptionMessage: `${fieldValues.roleName} deleted!`,
          messageType: "success",
        },
        () => myRef4.current()
      );
      return setTimeout(() => navigate4("/roles"), 3000);
    } catch (error) {
      console.log("error on delete", error);
      if (error?.code === "ERR_CANCELED") return;
      console.log(toasterDetails4);
      setToasterDetails4(
        {
          titleMessage: "Error",
          descriptionMessage:
            error?.response?.data?.message &&
            typeof error.response.data.message === "string"
              ? error.response.data.message
              : "Something went wrong!",
          messageType: "error",
        },
        () => myRef4.current()
      );
    } finally {
      setOpenDialog(false);
    }
  };
  const onDialogSecondaryButtonClickHandler = () => {
    navigate4("/roles");
  };

  //code form View Member
  const navigate4 = useNavigate();
  const [isActive, setActive] = useState(false);
  const handleToggle = () => {
    setActive(!isActive);
  };

  //code from Member List
  // function TabPanel(props) {
  //     const { children, value, index, ...other } = props;

  //     return (
  //         <div
  //             role="tabpanel"
  //             hidden={value !== index}
  //             id={`simple-tabpanel-${index}`}
  //             aria-labelledby={`simple-tab-${index}`}
  //             {...other}
  //         >
  //             {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  //         </div>
  //     );
  // }

  // TabPanel.propTypes = {
  //     children: PropTypes.node,
  //     index: PropTypes.number.isRequired,
  //     value: PropTypes.number.isRequired,
  // };

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  //state to hold privileges
  const [temp, setTemp] = useState({});
  //code of tablecomponent
  const [page, setPage] = React.useState(1);
  const [records, setRecords] = React.useState([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("");
  const [selected, setSelected] = React.useState([]);
  const [totalRecords, setTotalRecords] = React.useState(0);

  //implemention of pagination on front-end
  // let records = rows.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  // const tempRows = [...records];

    const handleTablePageChange = (newPage) => {
        setPage(newPage);
    };
    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(1);
    };
    const onClickVisibilityIconHandler = (id) => {
        console.log("id", id);
        return navigate4(`/users/cgf-admin/view-sub-admin/${id}`);
    };
    const createPrevileges3 = (tempPrivileges) => {
        console.log("temp data", tempPrivileges);
        Object.keys(tempPrivileges).forEach((tempPriv) => {
            // console.log("temp Previ value",tempPrivileges[tempPriv])
            privileges[tempPriv] = {
                add: tempPrivileges[tempPriv]["add"],
                fill: tempPrivileges[tempPriv]["fill"],
                // assign: tempPrivileges[tempPriv]["assign"],
                delete: tempPrivileges[tempPriv]["delete"],
                view: tempPrivileges[tempPriv]["view"],
                edit: tempPrivileges[tempPriv]["edit"],
                list: tempPrivileges[tempPriv]["list"],
                all:
                    tempPrivileges[tempPriv]["add"] &&
                    // tempPrivileges[tempPriv]["assign"] &&
                    tempPrivileges[tempPriv]["delete"] &&
                    tempPrivileges[tempPriv]["edit"] &&
                    tempPrivileges[tempPriv]["view"] &&
                    tempPrivileges[tempPriv]["list"] && (tempPrivileges[tempPriv]["moduleId"]["name"] === "Assessment"
                    ? tempPrivileges[tempPriv]["fill"]
                    : true),
                name: tempPrivileges[tempPriv]["moduleId"]["name"],
            };
        });
        setTemp(privileges);
    };
    const updateUsers = (data) => {
        const users = data?.cgfAdmins;
        console.log("Users: ", users);
        users.forEach((object) => {
            delete object["countryCode"];
            delete object["createdBy"];
            delete object["isDeleted"];
            delete object["isReplaced"];
            delete object["password"];
            delete object["phoneNumber"];
            delete object["roleId"];
            delete object["salt"];
            delete object["subRoleId"];
            delete object["updatedAt"];
            delete object["updatedBy"];
            delete object["uuid"];
            delete object["memberId"];
            delete object["title"];
            delete object["department"];
            delete object["salutation"];
            delete object["reportingManager"];
            delete object["operationType"];
            delete object["address"];
            delete object["isCGFStaff"];
            delete object["isOperationMember"];
            delete object["isMemberRepresentative"];
            delete object["isCGFAdmin"];

      delete object["__v"];
      object["createdAt"] = new Date(object["createdAt"]).toLocaleDateString(
        "en-US",
        {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
        }
      );
      keysOrder.forEach((k) => {
        const v = object[k];
        delete object[k];
        object[k] = v;
      });
    });
    setRecords([...users]);
  };
  const updateFileds = async (data) => {
    console.log("data", data);
    updateUsers(data);
    setTotalRecords(data?.totalCgfAdmins ?? 0);
    setFieldValues({
      roleName: data?.name,
      description: data?.description,
      status: data?.isActive ? "active" : "inactive",
      subAdmin: data?.totalCgfAdmins ?? 0,
    });
    createPrevileges3(data.privileges);
  };
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    (async () => {
      try {
        setIsLoading3(true);
        const response = await axios.get(
          REACT_APP_API_ENDPOINT +
            `roles/${params.id}?page=${page}&size=${rowsPerPage}&orderBy=${orderBy}&order=${order}`
        );
        isMounted && (await updateFileds(response?.data));
        setIsLoading3(false);
      } catch (error) {
        if (error?.code === "ERR_CANCELED") return;
        setIsLoading3(false);
        isMounted &&
          setToasterDetails4(
            {
              titleMessage: "Error",
              descriptionMessage:
                error?.response?.data?.message &&
                typeof error.response.data.message === "string"
                  ? error.response.data.message
                  : "Something went wrong!",
              messageType: "error",
            },
            () => myRef4.current()
          );
      }
    })();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [page, rowsPerPage, orderBy, order]);
  return (
    <div className="page-wrapper" onClick={() => isActive && setActive(false)}>
      <Toaster
        myRef={myRef4}
        titleMessage={toasterDetails4.titleMessage}
        descriptionMessage={toasterDetails4.descriptionMessage}
        messageType={toasterDetails4.messageType}
      />
      <DialogBox
        title={
          <p>Delete role "{fieldValues ? fieldValues.roleName : ""}"!</p>
        }
        info1={
          <p>
            On deleting all the CGF admins to whom assign this role the access
            for the system would get deleted and this will be an irreversible
            action
          </p>
        }
        info2={
          <p>
            Are you sure you want to delete{" "}
            <b>{fieldValues ? fieldValues.roleName : "Role"}</b>?
          </p>
        }
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
              <Link to="/roles">Roles</Link>
            </li>
            <li>View Role</li>
          </ul>
        </div>
      </div>
      <section>
        <div className="container">
          <div className="form-header flex-between">
            <h2 className="heading2">View Role</h2>
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
                  <li
                    onClick={() => navigate4(`/roles/edit-role/${params.id}`)}
                  >
                    Edit
                  </li>
                  <li onClick={() => setOpenDialog(true)}>Delete</li>
                </ul>
              </div>
              {/* <CustomModal /> */}
            </span>
          </div>
          {isLoading3 ? (
            <div className="loader-blk">
              <img src={Loader2} alt="Loading" />
            </div>
          ) : (
            <div className="card-wrapper">
              <div className="card-blk flex-between">
                <div className="card-form-field">
                  <div className="form-group">
                    <label htmlFor="roleName">
                      Role Name <span className="mandatory">*</span>
                    </label>
                    <TextField
                      disabled
                      className="input-field"
                      id="outlined-basic"
                      placeholder="Enter role name"
                      value={fieldValues && fieldValues.roleName}
                      variant="outlined"
                      helperText=" "
                    />
                  </div>
                </div>
                <div className="card-form-field">
                  <div className="form-group">
                    <label htmlFor="status">Status</label>
                    <div className="radio-btn-field">
                      <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        value={fieldValues && fieldValues.status}
                        name="radio-buttons-group"
                        className="radio-btn"
                      >
                        <FormControlLabel
                          disabled
                          value="active"
                          control={<Radio />}
                          label="Active"
                        />
                        <FormControlLabel
                          disabled
                          value="inactive"
                          control={<Radio />}
                          label="Inactive"
                        />
                      </RadioGroup>
                    </div>
                  </div>
                </div>
                <div className="card-form-field">
                  <div className="form-group">
                    <label htmlFor="description">
                      Description <span className="mandatory">*</span>
                    </label>
                    <TextField
                      disabled
                      multiline
                      inputProps={{ maxLength: 500 }}
                      className="input-textarea textarea-overflow"
                      //   className={`input-field ${error && "input-error"}`}
                      id="outlined-basic"
                      placeholder="Enter description"
                      value={fieldValues && fieldValues.description}
                      helperText=" "
                      variant="outlined"
                    />
                  </div>
                </div>
                <div className="card-form-field">
                  <div className="form-group">
                    <label htmlFor="roleName">
                      No. of Users <span className="mandatory">*</span>
                    </label>
                    <TextField
                      disabled
                      className="input-field"
                      id="outlined-basic"
                      placeholder="Enter CGF admin"
                      value={fieldValues && fieldValues.subAdmin}
                      variant="outlined"
                      helperText=" "
                    />
                  </div>
                </div>
              </div>
              <div className="form-header-left-blk flex-start">
                <div className="member-tab-wrapper view-role-tab-wrapper">
                  <Box
                    sx={{
                      borderBottom: 1,
                      borderColor: "divider",
                    }}
                    className="tabs-sect"
                  >
                    <Tabs
                      value={value}
                      onChange={handleChange}
                      aria-label="basic tabs example"
                    >
                      <Tab
                        label="Module Access"
                        // {...a11yProps(0)}
                        id="simple-tab-0"
                        aria-controls="simple-tabpanel-0"
                      />
                      <Tab
                        label="Users"
                        // {...a11yProps(1)}
                        id="simple-tab-0"
                        aria-controls="simple-tabpanel-0"
                      />
                    </Tabs>
                  </Box>
                </div>
              </div>
              <div className="member-info-wrapper table-content-wrap table-role-content-wrap">
                <TabPanel value={value} index={0}>
                  <Box
                    sx={{ width: "100%" }}
                    className="table-blk table-blk-role pb-0"
                  >
                    <Paper sx={{ width: "100%" }}>
                      <TableContainer>
                        <Table sx={{ minWidth: 750 }}>
                          <TableHead>
                            <TableRow>
                              <TableCell
                                align="left"
                                className="table-header"
                                width="16%"
                              >
                                <span className="sorted-blk">Modules</span>
                              </TableCell>
                              <TableCell className="table-header">
                                <span className="sorted-blk">Fill</span>
                              </TableCell>
                              <TableCell className="table-header">
                                <span className="sorted-blk">List</span>
                              </TableCell>
                              <TableCell
                                align="center"
                                className="table-header"
                              >
                                <span className="sorted-blk">Add</span>
                              </TableCell>
                              <TableCell
                                align="center"
                                className="table-header"
                              >
                                <span className="sorted-blk">Edit</span>
                              </TableCell>
                              <TableCell
                                align="center"
                                className="table-header"
                              >
                                <span className="sorted-blk">View</span>
                              </TableCell>
                              <TableCell
                                align="center"
                                className="table-header"
                              >
                                <span className="sorted-blk">Delete</span>
                              </TableCell>
                              {/* <TableCell
                              align="center"
                              className="table-header"
                              width="16%"
                            >
                              Assign to Member
                            </TableCell> */}
                              <TableCell
                                align="center"
                                className="table-header"
                              >
                                <span className="sorted-blk">All</span>
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {Object.keys(temp).map((previleg, id) => {
                              return (
                                <TableRow key={previleg} hover>
                                  <TableCell>
                                    {temp[previleg]["name"]}
                                  </TableCell>
                                  <TableCell align="center" padding="checkbox">
                                  <Checkbox
                                      disabled
                                      className="table-checkbox"
                                      checked={temp[previleg]["fill"]}
                                    />
                                  </TableCell>
                                  <TableCell align="center" padding="checkbox">
                                    <Checkbox
                                      disabled
                                      className="table-checkbox"
                                      checked={temp[previleg]["list"]}
                                    />
                                  </TableCell>
                                  <TableCell align="center" padding="checkbox">
                                    <Checkbox
                                      disabled
                                      className="table-checkbox"
                                      checked={temp[previleg]["add"]}
                                    />
                                  </TableCell>
                                  <TableCell align="center" padding="checkbox">
                                    <Checkbox
                                      disabled
                                      className="table-checkbox"
                                      checked={temp[previleg]["edit"]}
                                    />
                                  </TableCell>
                                  <TableCell align="center" padding="checkbox">
                                    <Checkbox
                                      disabled
                                      className="table-checkbox"
                                      checked={temp[previleg]["view"]}
                                    />
                                  </TableCell>
                                  <TableCell align="center" padding="checkbox">
                                    <Checkbox
                                      disabled
                                      className="table-checkbox"
                                      checked={temp[previleg]["delete"]}
                                    />
                                  </TableCell>
                                  {/* <TableCell align="center" padding="checkbox">
                                    <Checkbox
                                      disabled
                                      className="table-checkbox"
                                      checked={temp[previleg]["assign"]}
                                    />
                                  </TableCell> */}
                                  <TableCell align="center" padding="checkbox">
                                    <Checkbox
                                      disabled
                                      className="table-checkbox"
                                      checked={temp[previleg]["all"]}
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
                </TabPanel>
                <TabPanel value={value} index={1}>
                  <TableComponent
                    tableHead={tableHead}
                    records={records}
                    handleChangePage1={handleTablePageChange}
                    handleChangeRowsPerPage1={handleRowsPerPageChange}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    totalRecords={totalRecords}
                    orderBy={orderBy}
                    selected={selected}
                    setSelected={setSelected}
                    // icons={["visibility"]}
                    onClickVisibilityIconHandler1={onClickVisibilityIconHandler}
                    order={order}
                    setOrder={setOrder}
                    setOrderBy={setOrderBy}
                    setCheckBoxes={false}
                    onRowClick
                  />
                </TabPanel>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ViewRole;
