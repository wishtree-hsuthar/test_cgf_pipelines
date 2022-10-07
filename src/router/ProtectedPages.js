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
import AddOperationMember from "../Pages/operationMember/AddOperationMember";
import OperationMemberList from "../Pages/operationMember/OperationMemberList";
import FallBackUI from "../Pages/FallBackUI";
import MemberList from "../Pages/member/MemberList";
import AddMember from "../Pages/member/AddMember";
import EditMember from "../Pages/member/EditMember";
import ViewMember from "../Pages/member/ViewMember";
import ViewOperationMembers from "../Pages/operationMember/ViewOperationMembers";
import EditOperationMember from "../Pages/operationMember/EditOperationMember";
import AddQuestionnaires from "../Pages/questionnaires/AddQuestionnaires";
import QuestionnairesList from "../Pages/questionnaires/QuestionnairesList";
// import Layout from "../Pages/Layout";
const ProtectedPages = () => {
    return (
        <Routes>
            {/* <Route path="/" element={<Layout />}> */}
            <Route path="/" element={<Layout />}>
                <Route path="/home" element={<Dashboard />} />
                <Route
                    path="/sub-admins"
                    element={
                        // <RequireAuth allowedRoles={["Super Admin", "Sub Admin"]}>
                        <SubAdminList />
                        // </RequireAuth>
                    }
                />
                <Route
                    path="/sub-admins/add-sub-admin"
                    element={
                        // <RequireAuth allowedRoles={["Super Admin", "Sub Admin"]}>
                        <AddSubAdmin />
                        // </RequireAuth>
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

                {/* Member Pages */}
                <Route
                    path="/users/members"
                    element={
                        <RequireAuth page={"list"} moduleName={"Members"}>
                            <MemberList />
                        </RequireAuth>
                    }
                ></Route>
                <Route
                    path="/users/members/add-member"
                    element={
                        <RequireAuth page={"add"} moduleName={"Members"}>
                            <AddMember />
                        </RequireAuth>
                    }
                ></Route>
                <Route
                    path={"/users/members/edit-member/:id"}
                    element={
                        <RequireAuth page={"edit"} moduleName={"Members"}>
                            <EditMember />
                        </RequireAuth>
                    }
                ></Route>
                <Route
                    path={"/users/members/view-member/:id"}
                    element={
                        <RequireAuth page={"view"} moduleName={"Members"}>
                            <ViewMember />
                        </RequireAuth>
                    }
                ></Route>

                {/* </Route> */}

                {/* Operation Members */}
                <Route
                    path="/users/operation-members"
                    element={
                        <RequireAuth
                            page={"list"}
                            moduleName={"Operation Members"}
                        >
                            <OperationMemberList />
                        </RequireAuth>
                    }
                />
                <Route
                    path="/users/operation-members/add-operation-member"
                    element={
                        <RequireAuth
                            page={"add"}
                            moduleName={"Operation Members"}
                        >
                            <AddOperationMember />
                        </RequireAuth>
                    }
                />
                <Route
                    path="/users/operation-member/view-operation-member/:id"
                    element={
                        <RequireAuth
                            page={"view"}
                            moduleName={"Operation Members"}
                        >
                            <ViewOperationMembers />
                        </RequireAuth>
                    }
                />
                <Route
                    path="/users/operation-member/edit-operation-member/:id"
                    element={
                        <RequireAuth
                            page={"edit"}
                            moduleName={"Operation Members"}
                        >
                            <EditOperationMember />
                        </RequireAuth>
                    }
                />
                <Route
                    path="/questionnaires"
                    element={<QuestionnairesList />}
                />
                <Route
                    path="/questionnaires/add-questionnaire/:id"
                    element={<AddQuestionnaires />}
                />
                <Route path="*" element={<FallBackUI />} />
            </Route>
        </Routes>
    );
};

export default ProtectedPages;
