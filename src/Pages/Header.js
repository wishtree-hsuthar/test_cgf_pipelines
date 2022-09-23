import React, { useEffect } from "react";
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
const Header = () => {
    // const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [isActive, setActive] = React.useState("false");
    const userAuth = useSelector((state) => state.user.userObj);
    const CGF_ADMIN_ACCESS = userAuth?.roleId?.name == "Sub Admin";
    const MEMBER_ACCESS = userAuth?.roleId?.name == "Member";
    const OPERATION_MEMBER = userAuth?.roleId?.name == "Operation Member";

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    console.log("location in header", location.pathname);
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
        <AppBar position="static" className="header-sect">
            <div className="nav">
                <div className="container">
                    <Toolbar disableGutters>
                        <div className="header-wrapper">
                            <div className="header-left">
                                <div className="logo-blk">
                                    <a href="/#">
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
                                        <li
                                            className={
                                                location.pathname ==
                                                "/dashboard"
                                                    ? "active"
                                                    : ""
                                            }
                                        >
                                            <a 
                                                onClick={() =>
                                                    navigate("/dashboard")
                                                }
                                                style={{
                                                    cursor: "pointer",
                                                }}
                                            >
                                                Dashboard
                                            </a>
                                        </li>
                                        <li
                                            className={
                                                location.pathname == "/members"
                                                    ? "active"
                                                    : ""
                                            }
                                        >
                                            <a hidden={MEMBER_ACCESS} style={{
                                                    cursor: "pointer",
                                                }} onClick={() => navigate("/members")}>
                                                Members
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                hidden={OPERATION_MEMBER}
                                                href="/#"
                                                style={{
                                                    cursor: "pointer",
                                                }}
                                            >
                                                Operation Members
                                            </a>
                                        </li>
                                        <li>
                                            <a href="/#">Questionnaires</a>
                                        </li>
                                        <li
                                            className={
                                                location.pathname.includes(
                                                    "/sub-admins"
                                                )
                                                    ? "active"
                                                    : ""
                                            }
                                        >
                                            <a
                                                hidden={
                                                    CGF_ADMIN_ACCESS ||
                                                    MEMBER_ACCESS
                                                }
                                                onClick={() =>
                                                    navigate("/sub-admins")
                                                }
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
                                                    ? "active"
                                                    : ""
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
                                                    ER
                                                </span>
                                            </div>
                                            <div className="user-info">
                                                <span className="user-name">
                                                    Erin
                                                </span>
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
        </AppBar>
    );
};

export default Header;
