import React, { useEffect, useState } from "react";
import {
    AppBar,
    Box,
    Toolbar,
    Typography,
    Menu,
    Tooltip,
    MenuItem,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetUser, setUser } from "../redux/UserSlice";
import { GET_USER, LOGOUT_URL } from "../api/Url";
import axios from "axios";
import { privateAxios } from "../api/axios";
import "./Header.css";
const Header = () => {
    // const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [isActive, setActive] = React.useState("false");
    const userAuth = useSelector((state) => state.user.userObj);
    let initials = userAuth?.name?.split(" ");
    const CGF_ADMIN_ACCESS = userAuth?.roleId?.name == "Sub Admin";
    const MEMBER_ACCESS = userAuth?.roleId?.name == "Member";
    const OPERATION_MEMBER = userAuth?.roleId?.name == "Operation Member";

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const [activeStateForMembers, setActiveStateForMembers] = useState(false);
    const [activeStateForOperationMembers, setActiveStateForOperationMembers] =
        useState(false);
    console.log("location in header", location.pathname);
    const routeAddress = ["/members", "/operation_members"];
    const myFunction = (activeState) => {
        if (activeState === "/members") {
            console.log("active state==members");
            return "active";
        }
        if (activeState === "/operation_members") {
            console.log("active state==operation_members");

            return "active";
        } else {
            return "";
        }
    };
    console.log("active state", myFunction);
    // const activeAddress = routeAddress.filter(myFunction);
    useEffect(() => {
        // const controller = new AbortController();
        // const fetchUser = async () => {
        //     try {
        //         const { data } = await axios.get(GET_USER);
        //         dispatch(setUser(data));
        //     } catch (error) {
        //         console.log("Error from header file useEffect", error);
        //         // navigate("/login");
        //     }
        // };
        // fetchUser();
        // //clean up function
        // return () => {
        //     controller.abort();
        // };
    }, []);
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
        setActive(!isActive);
    };

    // const handleCloseNavMenu = () => {
    //   setAnchorElNav(null);
    // };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
        setActive(!isActive);
    };

    const handleLogOut = async () => {
        try {
            const response = await privateAxios.post(LOGOUT_URL);
            console.log("Response from logout");
            if (response.status == 201) {
                setAnchorElUser(null);
                dispatch(resetUser());
                setActive(!isActive);
                navigate("/login");
            }
        } catch (error) {
            console.log("Error from logout API", error);
            if (error?.response?.status === 401) {
                navigate("/login");
            }
        }
    };
    return (
        <AppBar position="sticky" className="header-sect">
            <div className="nav">
                <div className="container">
                    <Toolbar disableGutters>
                        <div className="header-wrapper">
                            <div className="header-left">
                                <div className="logo-blk">
                                    <a href="/home">
                                        <img
                                            src={
                                                process.env.PUBLIC_URL +
                                                "/images/logo.png"
                                            }
                                            className="img-fluid"
                                            alt=""
                                        />
                                    </a>
                                </div>
                                <div className="nav-listblk">
                                    <ul className="nav-list flex-between">
                                        {/* <li
                                            className={
                                                location.pathname ==
                                                "/dashboard"
                                            }>
                                            <a hidden={MEMBER_ACCESS} style={{
                                                    cursor: "pointer",
                                                }} onClick={() => navigate("/members")}>
                                                Members
                                            </a>
                                        </li> */}
                                        <li
                                            className={
                                                location.pathname == "/home"
                                                    ? "list-item active"
                                                    : "list-item"
                                            }
                                        >
                                            <a
                                                hidden={
                                                    CGF_ADMIN_ACCESS
                                                        ? "active"
                                                        : ""
                                                }
                                            ></a>
                                            <a
                                                onClick={() =>
                                                    navigate("/home")
                                                }
                                                style={{
                                                    cursor: "pointer",
                                                }}
                                            >
                                                Home
                                            </a>
                                        </li>
                                        <li
                                            className={
                                                location.pathname.includes(
                                                    "/users"
                                                )
                                                    ? "list-item active"
                                                    : "list-item"
                                            }
                                        >
                                            <a
                                                hidden={OPERATION_MEMBER}
                                                style={{
                                                    cursor: "pointer",
                                                }}
                                            >
                                                User Management
                                            </a>
                                            <ul className="header-submenu">
                                                <li
                                                    className={
                                                        location.pathname ===
                                                        "/users/members"
                                                            ? "subactive"
                                                            : ""
                                                    }
                                                >
                                                    <a
                                                        onClick={() => {
                                                            navigate(
                                                                "/users/members"
                                                            );
                                                        }}
                                                    >
                                                        Members
                                                    </a>
                                                </li>
                                                <li
                                                    className={
                                                        location.pathname ===
                                                        "/users/operation_members"
                                                            ? "subactive"
                                                            : ""
                                                    }
                                                >
                                                    <a
                                                        onClick={() => {
                                                            navigate(
                                                                "/users/operation_members"
                                                            );
                                                        }}
                                                    >
                                                        Operation Members
                                                    </a>
                                                </li>
                                            </ul>
                                        </li>
                                        <li className="list-item">
                                            <a href="/#">Questionnaires</a>
                                        </li>

                                        <li
                                            className={
                                                location.pathname.includes(
                                                    "/sub-admins"
                                                )
                                                    ? "list-item active"
                                                    : "list-item"
                                            }
                                        >
                                            <a
                                                hidden={
                                                    CGF_ADMIN_ACCESS ||
                                                    MEMBER_ACCESS
                                                }
                                                onClick={() => {
                                                    // setActiveState(false);
                                                    setActiveStateForMembers(
                                                        false
                                                    );
                                                    setActiveStateForOperationMembers(
                                                        false
                                                    );
                                                    navigate("/sub-admins");
                                                }}
                                                style={{
                                                    cursor: "pointer",
                                                }}
                                            >
                                                CGF Admins
                                            </a>
                                        </li>
                                        <li
                                            className={
                                                location.pathname == "/roles"
                                                    ? "list-item active"
                                                    : "list-item"
                                            }
                                        >
                                            <a
                                                hidden={
                                                    CGF_ADMIN_ACCESS ||
                                                    MEMBER_ACCESS
                                                }
                                                onClick={() =>
                                                    navigate("/roles")
                                                }
                                                style={{
                                                    cursor: "pointer",
                                                }}
                                            >
                                                Roles and Privileges
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="header-right">
                                <Box>
                                    <Tooltip title="Open settings">
                                        <div className="user-blk flex-between">
                                            <div className="user-img">
                                                <span className="user-name-txt">
                                                    {initials?.length >= 1 &&
                                                        initials[0].slice(
                                                            0,
                                                            1
                                                        ) +
                                                            initials[1]?.slice(
                                                                0,
                                                                1
                                                            )}
                                                </span>
                                            </div>
                                            <div className="user-info">
                                                <span className="user-name">
                                                    {userAuth?.name}
                                                </span>
                                                <span
                                                    className="user-type"
                                                    onClick={handleOpenUserMenu}
                                                >
                                                    {userAuth?.roleId?.name}
                                                    <span
                                                        className={
                                                            isActive
                                                                ? "super-admin-arrow"
                                                                : "super-admin-arrow active"
                                                        }
                                                    >
                                                        <KeyboardArrowDownIcon />
                                                    </span>
                                                </span>
                                            </div>
                                        </div>
                                    </Tooltip>
                                    <Menu
                                        sx={{ mt: "35px" }}
                                        id="menu-appbar"
                                        anchorEl={anchorElUser}
                                        anchorOrigin={{
                                            vertical: "top",
                                            horizontal: "right",
                                        }}
                                        keepMounted
                                        transformOrigin={{
                                            vertical: "top",
                                            horizontal: "right",
                                        }}
                                        open={Boolean(anchorElUser)}
                                        onClose={handleCloseUserMenu}
                                        className="profile-menu-item"
                                    >
                                        <MenuItem onClick={handleCloseUserMenu}>
                                            <Typography textAlign="center">
                                                Profile
                                            </Typography>
                                        </MenuItem>
                                        <MenuItem onClick={handleLogOut}>
                                            <Typography textAlign="center">
                                                Logout
                                            </Typography>
                                        </MenuItem>
                                    </Menu>
                                </Box>
                            </div>
                        </div>
                    </Toolbar>
                </div>
            </div>
            {/* <div className="header-right">
                <Box>
                  <Tooltip title="Open settings">
                    <div className="user-blk flex-between">
                      <div className="user-img">
                        <span className="user-name-txt">ER</span>
                      </div>
                      <div className="user-info">
                        <span className="user-name">Erin</span>
                        <span
                          className="user-type"
                          onClick={handleOpenUserMenu}
                        >
                          Super Admin{" "}
                          <span
                            className={
                              isActive
                                ? "super-admin-arrow"
                                : "super-admin-arrow active"
                            }
                          >
                            <KeyboardArrowDownIcon />
                          </span>
                        </span>
                      </div>
                    </div>
                  </Tooltip>
                  <Menu
                    sx={{ mt: "35px" }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                    className="profile-menu-item"
                  >
                    <MenuItem onClick={handleCloseUserMenu}>
                      <Typography textAlign="center">Profile</Typography>
                    </MenuItem>
                    <MenuItem onClick={handleLogOut}>
                      <Typography textAlign="center">Logout</Typography>
                    </MenuItem>
                  </Menu>
                </Box>
              </div> */}
        </AppBar>
    );
};

export default Header;
