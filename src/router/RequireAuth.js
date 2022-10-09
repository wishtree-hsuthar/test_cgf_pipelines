import { useSelector } from "react-redux";
import { Outlet, useLocation, Navigate } from "react-router-dom";
import { object } from "yup";

const RequireAuth = ({ children, moduleName, page }) => {
    const location = useLocation();
    const authUser = useSelector((state) => state.user.userObj);
    const privilege = useSelector((state) => state.user.privilege);
    const privilegeArray = privilege
        ? Object.values(privilege?.privileges)
        : [];
    // console.log("authUsr from requireAuth", authUser);
    // console.log("roles from requireAuth", authUser?.roleId?.name);
    //static role based access
    // let sameRole = authUser?.roleId?.name;
    // let grantAccess = allowedRoles.find((role) => {
    //     return role === sameRole;
    // });
    // console.log("grant access to---------", grantAccess);

    // dynamic role based access
    // console.log("privilege array in require auth", privilegeArray);
    // console.log("privilege  in require auth", privilege);
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

    // console.log("moduleAccess in require auth", moduleAccessByModuleName);
    let grantAccess =
        authUser.role.name === "Super Admin"
            ? true
            : moduleAccessByModuleName[0]?.[moduleName][page];
    // console.log(`grant access for ${page} and ${moduleName} `, grantAccess);

    return grantAccess ? (
        children
    ) : (
        <Navigate to={"/login"} state={{ from: location }} replace />
    );
};
export default RequireAuth;
