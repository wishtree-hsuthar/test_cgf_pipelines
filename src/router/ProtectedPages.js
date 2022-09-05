import React from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "../Pages/Layout";
import SubAdminList from "../Pages/SubAdminList";
import AddSubAdmin from "../Pages/AddSubAdmin";
import ViewSubAdmin from "../Pages/ViewSubAdmin";
import EditSubAdmin from "../Pages/EditSubAdmin";
import ReplaceSubAdmin from "../Pages/ReplaceSubAdmin";
import { Dashboard } from "../Pages/Dashboard";
import RequireAuth from "./RequireAuth";
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
                path="/sub-admins/view-sub-admin"
                element={<ViewSubAdmin />}
            />
            <Route
                path="/sub-admins/edit-sub-admin"
                element={<EditSubAdmin />}
            />
            <Route
                path="/sub-admins/replace-sub-admin"
                element={<ReplaceSubAdmin />}
            />
            {/* </Route> */}
        </Routes>
    );
};

export default ProtectedPages;
