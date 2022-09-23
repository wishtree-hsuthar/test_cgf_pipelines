import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { setUser, resetUser } from "../redux/UserSlice";
import { GET_USER } from "../api/Url";
import { privateAxios } from "../api/axios";
import { useState } from "react";
const UserLoggedIn = ({ children }) => {
    const authUser = useSelector((state) => state.user.userObj);
    const navigate = useNavigate();
    const location = useLocation();
    const [requestRetry, setRequestRetry] = useState(false);
    console.log("auth user from check user -----------", authUser);

    const dispatch = useDispatch();

    const fetchUser = async () => {
        try {
            const response = await privateAxios.get(GET_USER);
            console.log(
                "data from app fetcuser method UserLoggedIn file",
                response.data
            );
            dispatch(setUser(response.data));
        } catch (error) {
            console.log(
                "Error from app file useEffect UserLoggedIn file",
                error
            );
            if (error?.response?.status == 401) {
                // dispatch(resetUser());
                console.log("401 from userLoggedIn component");

                // return (
                //     <Navigate
                //         to={"/login"}
                //         state={{ from: location }}
                //         replace
                //     />
                // );
                setRequestRetry(true);
                navigate("/login");
            }
        }
    };

    // console.log("after useEFFECT", authUser);

    // console.log("authuser from checkuser======", authUser);
    if (authUser == undefined) {
        fetchUser();
        // navigate("/login");
        // return <Navigate to={"/login"} state={{ from: location }} replace />;
    } else {
        return children;
    }
};

export default UserLoggedIn;
