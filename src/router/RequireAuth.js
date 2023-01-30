import { useSelector } from "react-redux";
import { useLocation, Navigate } from "react-router-dom";

const RequireAuth = ({ children, moduleName, page }) => {
    const location = useLocation();
    const authUser = useSelector((state) => state.user.userObj);
    const privilege = useSelector((state) => state.user.privilege);
    const privilegeArray = privilege
        ? Object.values(privilege?.privileges)
        : [];
    let moduleAccessByModuleName = privilegeArray
        .filter((data) => data?.moduleId?.name === moduleName)
        .map((data) => ({
            [moduleName]: {
                list: data.list,
                view: data.view,
                edit: data.edit,
                delete: data.delete,
                add: data.add,
            },
        }));

    let grantAccess =
        authUser.role.name === "Super Admin"
            ? true
            : moduleAccessByModuleName[0]?.[moduleName][page];

    return grantAccess ? (
        children
    ) : (
        <Navigate to={"/page-not-found"} state={{ from: location }} replace />
    );
};
export default RequireAuth;
