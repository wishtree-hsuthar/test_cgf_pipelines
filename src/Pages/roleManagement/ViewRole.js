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

const tableHead = [
  {
    id: "subAdmin",
    disablePadding: false,
    width: "20%",
    label: "Name",
  },
  {
    id: "email",
    disablePadding: false,
    label: "Email",
  },
  {
    id: "onboardedOn",
    disablePadding: false,
    label: "Onboarded On",
  },
  {
    id: "assignedOn",
    disablePadding: false,
    label: "Assigned On",
  },
  {
    id: "isActive",
    disablePadding: false,
    label: "Status",
  },
  // {
  //   id: "action",
  //   disablePadding: false,
  //   label: "Action",
  // },
];

const rows = [
  {
    _id: "1",
    subAdmin: "jeff Hall",
    email: "jeffbezoz@gmail.com",
    assessments: "internal",
    onboardedOn: new Date().toLocaleDateString("en-US"),
    status: "active",
    createdBy: "rajkumar",
    assignedOn: new Date().toLocaleDateString("en-US"),
  },
  {
    _id: "2",
    subAdmin: "Edward Meaning",
    email: "EdwardMeaning53@gmail.com",
    assessments: "internal",
    onboardedOn: new Date().toLocaleDateString("en-US"),
    status: "inactive",
    createdBy: "rajkumar",
    assignedOn: new Date().toLocaleDateString("en-US"),
  },
  {
    _id: "3",
    subAdmin: "William Johnsan bhai",
    email: "WillianJohnbhai4509@gmail.com",
    assessments: "External",
    onboardedOn: new Date().toLocaleDateString("en-US"),
    status: "active",
    createdBy: "rajkumar",
    assignedOn: new Date().toLocaleDateString("en-US"),
  },
  {
    _id: "4",
    subAdmin: "harry robot son",
    email: "harrykakaji3209@zero.com",
    assessments: "External",
    onboardedOn: new Date().toLocaleDateString("en-US"),
    status: "active",
    createdBy: "rajkumar",
    assignedOn: new Date().toLocaleDateString("en-US"),
  },
  {
    _id: "5",
    subAdmin: "joe biden",
    email: "joeBidenladen@gmail.com",
    assessments: "internal",
    onboardedOn: new Date().toLocaleDateString("en-US"),
    status: "Inactive",
    createdBy: "rajkumar",
    assignedOn: new Date().toLocaleDateString("en-US"),
  },
  {
    _id: "6",
    subAdmin: "Vladimir Putin",
    email: "vladputin007@gmail.com",
    assessments: "External",
    onboardedOn: new Date().toLocaleDateString("en-US"),
    status: "active",
    createdBy: "rajkumar",
    assignedOn: new Date().toLocaleDateString("en-US"),
  },
  {
    _id: "7",
    subAdmin: "Anderson James",
    email: "Andersonvir@gmail.com",
    assessments: "internal",
    onboardedOn: new Date().toLocaleDateString("en-US"),
    status: "active",
    createdBy: "rajkumar",
    assignedOn: new Date().toLocaleDateString("en-US"),
  },
  {
    _id: "8",
    subAdmin: "Virat Kohli",
    email: "ViratRunMachicne@icc.com",
    assessments: "internal",
    onboardedOn: new Date().toLocaleDateString("en-US"),
    status: "active",
    createdBy: "rajkumar",
    assignedOn: new Date().toLocaleDateString("en-US"),
  },
  {
    _id: "9",
    subAdmin: "Sachin Tendulkar",
    email: "SachinMumbaikar123@gmail.com",
    assessments: "internal",
    onboardedOn: new Date().toLocaleDateString("en-US"),
    status: "Inactive",
    createdBy: "rajkumar",
    assignedOn: new Date().toLocaleDateString("en-US"),
  },
  {
    _id: "10",
    subAdmin: "Mahendra Singh Dhoni",
    email: "Mahikmatvalie@csk.com",
    assessments: "external",
    onboardedOn: new Date().toLocaleDateString("en-US"),
    status: "active",
    createdBy: "rajkumar",
    assignedOn: new Date().toLocaleDateString("en-US"),
  },
  {
    _id: "11",
    subAdmin: "SRK",
    email: "srkverse@gmail.com",
    assessments: "internal",
    onboardedOn: new Date().toLocaleDateString("en-US"),
    status: "Inactive",
    createdBy: "rajkumar",
    assignedOn: new Date().toLocaleDateString("en-US"),
  },
  {
    _id: "12",
    subAdmin: "salman khan",
    email: "blackbug123@gmail.com",
    assessments: "internal",
    onboardedOn: new Date().toLocaleDateString("en-US"),
    status: "active",
    createdBy: "rajkumar",
    assignedOn: new Date().toLocaleDateString("en-US"),
  },
  {
    _id: "13",
    subAdmin: "Rishabh Pant",
    email: "rishabhPant234@gmail.com",
    assessments: "External",
    onboardedOn: new Date().toLocaleDateString("en-US"),
    status: "active",
    createdBy: "rajkumar",
    assignedOn: new Date().toLocaleDateString("en-US"),
  },
  {
    _id: "14",
    subAdmin: "Jasprit Bumrah",
    email: "yorkerking007@gmail.com",
    assessments: "internal",
    onboardedOn: new Date().toLocaleDateString("en-US"),
    status: "active",
    createdBy: "rajkumar",
    assignedOn: new Date().toLocaleDateString("en-US"),
  },
  {
    _id: "15",
    subAdmin: "Mohammad Shami",
    email: "mohammadshami002@gmail.com",
    assessments: "internal",
    onboardedOn: new Date().toLocaleDateString("en-US"),
    status: "active",
    createdBy: "rajkumar",
    assignedOn: new Date().toLocaleDateString("en-US"),
  },
  {
    _id: "16",
    subAdmin: "Rohit Sharma",
    email: "rosuperhitsharma234@gmail.com",
    assessments: "External",
    onboardedOn: new Date().toLocaleDateString("en-US"),
    status: "Inactive",
    createdBy: "rajkumar",
    assignedOn: new Date().toLocaleDateString("en-US"),
  },
  {
    _id: "17",
    subAdmin: "Ravindra Jadeja",
    email: "sirjadeja123@gmail.com",
    assessments: "internal",
    onboardedOn: new Date().toLocaleDateString("en-US"),
    status: "active",
    createdBy: "rajkumar",
    assignedOn: new Date().toLocaleDateString("en-US"),
  },
];

const ViewRole = () => {
  //Refr for Toaster
  const myRef = React.useRef();
  //Toaster Message setter
  const [toasterDetails, setToasterDetails] = useCallbackState({
    titleMessage: "",
    descriptionMessage: "",
    messageType: "success",
  });

  // state to manage loader
  const [isLoading, setIsLoading] = useState(false);

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
      setToasterDetails(
        {
          titleMessage: "Success",
          descriptionMessage: `${fieldValues.roleName} deleted!`,
          messageType: "success",
        },
        () => myRef.current()
      );
      return setTimeout(() => navigate("/roles"), 3000);
    } catch (error) {
      console.log("error on delete", error);
      if (error?.code === "ERR_CANCELED") return;
      console.log(toasterDetails);
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
    } finally {
      setOpenDialog(false);
    }
  };
  const onDialogSecondaryButtonClickHandler = () => {
    navigate("/roles");
  };

  //code form View Member
  const navigate = useNavigate();
  const [isActive, setActive] = useState(false);
  const handleToggle = () => {
    setActive(!isActive);
  };

  //code from Member List
  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    );
  }

  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  //state to hold privileges
  const [temp, setTemp] = useState({});
  //code of tablecomponent
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("");
  const [selected, setSelected] = React.useState([])

  //implemention of pagination on front-end
  let records = rows.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const tempRows = [...records];

  tempRows.forEach((object) => {
    delete object["createdBy"];
    delete object["assessments"];
  });

  const handleTablePageChange = (newPage) => {
    setPage(newPage);
  };
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };
  const onClickVisibilityIconHandler = (id) => {
    console.log("id", id);
  };
  const createPrevileges = (tempPrivileges) => {
    console.log("temp data", tempPrivileges);
    Object.keys(tempPrivileges).forEach((tempPriv) => {
      // console.log("temp Previ value",tempPrivileges[tempPriv])
      privileges[tempPriv] = {
        add: tempPrivileges[tempPriv]["add"],
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
          tempPrivileges[tempPriv]["list"],
        name: tempPrivileges[tempPriv]["moduleId"]["name"],
      };
    });
    setTemp(privileges);
  };
  const updateFileds = (data) => {
    console.log("data",data)
    setFieldValues({
      roleName: data?.name,
      description: data?.description,
      status: data?.isActive ? "active" : "inactive",
      subAdmin: data?.totalCgfAdmins ?? 0 ,
    });
    createPrevileges(data.privileges);
  };
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    (async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(REACT_APP_API_ENDPOINT + `roles/${params.id}`);
        isMounted && updateFileds(response?.data);
        setIsLoading(false);
      } catch (error) {
        if (error?.code === "ERR_CANCELED") return;
        isMounted &&
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
        setIsLoading(false);
      }
    })();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);
  return (
    <div className="page-wrapper" onClick={() => isActive && setActive(false)}>
      <Toaster
        myRef={myRef}
        titleMessage={toasterDetails.titleMessage}
        descriptionMessage={toasterDetails.descriptionMessage}
        messageType={toasterDetails.messageType}
      />
      <DialogBox
        title={`Delete role "${fieldValues ? fieldValues.roleName : "Role"}"!`}
        info1={`On deleting all the sub admins to whoom this role the access for the system would get deleted and this will be irreversible action.`}
        info2={`Are you sure you want to delete ${
          fieldValues ? fieldValues.roleName : "Role"
        }?`}
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
                  <li onClick={() => navigate(`/roles/edit-role/${params.id}`)}>
                    Edit
                  </li>
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
                      className="input-textarea"
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
                      No of Users <span className="mandatory">*</span>
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
                <div className="member-tab-wrapper">
                  <Box
                    sx={{ borderBottom: 1, borderColor: "divider" }}
                    className="tabs-sect"
                  >
                    <Tabs
                      value={value}
                      onChange={handleChange}
                      aria-label="basic tabs example"
                    >
                      <Tab
                        label="Modules Access"
                        // {...a11yProps(0)}
                        id="simple-tab-0"
                        aria-controls="simple-tabpanel-0"
                      />
                      <Tab
                        label="CGF Admins"
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
                                className="tableHeader"
                                width="16%"
                              >
                                Modules
                              </TableCell>
                              <TableCell className="tableHeader">
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
                    totalRecords={rows.length}
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
