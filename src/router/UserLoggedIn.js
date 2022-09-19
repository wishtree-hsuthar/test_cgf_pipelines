import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { setUser } from "../redux/UserSlice";
import { GET_USER } from "../api/Url";
import { privateAxios } from "../api/axios";

const UserLoggedIn = ({ children }) => {
    const authUser = useSelector((state) => state.user.userObj);
    const navigate = useNavigate();
    console.log("auth user from check user -----------", authUser);

    const dispatch = useDispatch();

    const fetchUser = async () => {
        try {
            const { data } = await privateAxios.get(GET_USER);
            console.log(
                "data from app fetcuser method UserLoggedIn file",
                data
            );
            dispatch(setUser(data));
        } catch (error) {
            console.log(
                "Error from app file useEffect UserLoggedIn file",
                error
            );
            navigate("/login");
        }
    };

    console.log("after useEFFECT", authUser);

    console.log("authuser from checkuser======", authUser);
    if (authUser == undefined) {
        fetchUser();
    } else {
        return children;
    }
};

export default UserLoggedIn;
