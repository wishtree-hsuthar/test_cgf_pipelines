import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setUser, setPrivileges } from "../redux/UserSlice";
import { GET_USER } from "../api/Url";
import { privateAxios } from "../api/axios";
const UserLoggedIn = ({ children }) => {
    const authUser = useSelector((state) => state.user.userObj);
    const navigate = useNavigate();

    const dispatch = useDispatch();

    const fetchUser = async () => {
        try {
            const response = await privateAxios.get(GET_USER);

            dispatch(setUser(response.data));
            dispatch(setPrivileges(response.data?.role));
        } catch (error) {
            if (error?.response?.status == 401) {
                return navigate("/login");
            }
        }
    };

    if (authUser == undefined) {
        fetchUser();
    } else {
        return children;
    }
};

export default UserLoggedIn;
