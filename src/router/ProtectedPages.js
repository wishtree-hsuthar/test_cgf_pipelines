import React from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "../Pages/Layout";
import SubAdminList from "../Pages/subAdminManagement/SubAdminList";
import AddSubAdmin from "../Pages/subAdminManagement/AddSubAdmin";
import ViewSubAdmin from "../Pages/subAdminManagement/ViewSubAdmin";
import EditSubAdmin from "../Pages/subAdminManagement/EditSubAdmin";
import ReplaceSubAdmin from "../Pages/subAdminManagement/ReplaceSubAdmin";
import { Dashboard } from "../Pages/Dashboard";
import RequireAuth from "./RequireAuth";
import RolesList from "../Pages/roleManagement/RolesList";
import AddRole from "../Pages/roleManagement/AddRole";
import EditRole from "../Pages/roleManagement/EditRole";
import ViewRole from "../Pages/roleManagement/ViewRole";
const ProtectedPages = () => {
    return (
        <Routes>
            {/* <Route path="/" element={<Layout />}> */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route
                path="/sub-admins"
                element={
                    <RequireAuth allowedRoles={["Super Admin", "Sub Admin"]}>
                        <SubAdminList />
                    </RequireAuth>
                }
            />
            <Route
                path="/sub-admins/add-sub-admin"
                element={
                    <RequireAuth allowedRoles={["Super Admin", "Sub Admin"]}>
                        <AddSubAdmin />
                    </RequireAuth>
                }
            />
            <Route
                path="/sub-admins/view-sub-admin/:id"
                element={<ViewSubAdmin />}
            />
            <Route
                path="/sub-admins/edit-sub-admin/:id"
                element={<EditSubAdmin />}
            />
            <Route
                path="/sub-admins/replace-sub-admin/:id"
                element={<ReplaceSubAdmin />}
            />
            {/* Role Management Routes */}
            <Route path="/roles" element={<RolesList />} />
            <Route path="/roles/add-role" element={<AddRole />} />
            <Route path="/roles/view-role/:id" element={<ViewRole />} />
            <Route path="roles/edit-role/:id" element={<EditRole />} />

            {/* </Route> */}
        </Routes>
    );
};

export default ProtectedPages;
