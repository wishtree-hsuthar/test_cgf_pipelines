import { useSelector } from "react-redux";
import { Outlet, useLocation, Navigate } from "react-router-dom";

const RequireAuth = ({ allowedRoles, children }) => {
    const location = useLocation();
    const authUser = useSelector((state) => state.user.userObj);
    // console.log("authUsr from requireAuth", authUser);
    // console.log("roles from requireAuth", authUser?.roleId?.name);
    let sameRole = authUser?.roleId?.name;
    let grantAccess = allowedRoles.find((role) => {
        return role === sameRole;
    });
    // console.log("grant access to---------", grantAccess);
    return grantAccess ? (
        children
    ) : (
        <Navigate to={"/login"} state={{ from: location }} replace />
    );
};
export default RequireAuth;
