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
import AddNewQuestionnaire from "../Pages/questionnaires/AddNewQuestionnaire";
// import PreviewQuestionnaire from "../Pages/PreviewQuestionnaire";
import PreviewQuestionnaire from "../Pages/questionnaires/Preview/PreviewQuestionnaire";
// import PreviewDemo from "../Pages/PreviewDemo";
import PreviewDemo from "../Pages/questionnaires/Preview/PreviewDemo";
import Preview from "../Pages/questionnaires/Preview";
import AddAssessment from "../Pages/AssessmentModule/AddAssessment";
import AssessmentList from "../Pages/AssessmentModule/AssessmentList";
import EditAssessment from "../Pages/AssessmentModule/EditAssessment";
import AssignAssessmentToOperationMember from "../Pages/AssessmentModule/AssignAssessmentToOperationMember";
import FillAssessment from "../Pages/AssessmentModule/FillAssessment";
import ReplaceOperationMember from "../Pages/operationMember/ReplaceOperationMember";
import ChangePassword from "../Pages/ChangePassword";
import VersionHistory from "../Pages/questionnaires/VersionHistory";
// import Layout from "../Pages/Layout";
const ProtectedPages = () => {
    return (
        <Routes>
            {/* <Route path="/" element={<Layout />}> */}
            <Route path="/" element={<Layout />}>
                <Route path="/home" element={<Dashboard />} />
                <Route
                    path="/users/cgf-admin"
                    element={
                        // <RequireAuth allowedRoles={["Super Admin", "Sub Admin"]}>
                        <SubAdminList />
                        // </RequireAuth>
                    }
                />
                <Route
                    path="/users/cgf-admin/add-sub-admin"
                    element={
                        <RequireAuth moduleName={""} page={""}>
                            <AddSubAdmin />
                        </RequireAuth>
                    }
                />
                <Route
                    path="/users/cgf-admin/view-sub-admin/:id"
                    element={
                        <RequireAuth moduleName={""} page={""}>
                            <ViewSubAdmin />
                        </RequireAuth>
                    }
                />

                <Route
                    path="/users/cgf-admin/edit-sub-admin/:id"
                    element={
                        <RequireAuth>
                            <EditSubAdmin />
                        </RequireAuth>
                    }
                />
                <Route
                    path="/users/cgf-admin/replace-sub-admin/:id"
                    element={
                        <RequireAuth page={""} moduleName={""}>
                            <ReplaceSubAdmin />
                        </RequireAuth>
                    }
                />

                <Route
                    path="/questionnaires/add-questionnaires"
                    element={<AddQuestionnaires />}
                />
                <Route path="/questionnaires/preview" element={<Preview />} />

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
                    path="/users/operation-member/replace-operation-member/:id"
                    element={
                        <RequireAuth
                            page={"delete"}
                            moduleName={"Operation Members"}
                        >
                            <ReplaceOperationMember />
                        </RequireAuth>
                    }
                />
                <Route
                    path="/questionnaires"
                    element={
                        <RequireAuth page={"list"} moduleName={"Questionnaire"}>
                            <QuestionnairesList />
                        </RequireAuth>
                    }
                />
                <Route
                    path="/questionnaires/add-questionnaire/:id"
                    element={
                        <RequireAuth page={"add"} moduleName={"Questionnaire"}>
                            <AddNewQuestionnaire />
                        </RequireAuth>
                    }
                    // element={<AddQuestionnaires />}
                />
                <Route
                    path="/questionnaires/preview-questionnaire/:id"
                    element={<PreviewQuestionnaire />}
                />
                <Route
                    path="/questionnaires/preview-questionnaire-version/:id"
                    element={<PreviewQuestionnaire />}
                />
                <Route
                    path="/assessments/add-assessment"
                    element={
                        <RequireAuth page={"add"} moduleName={"Assessment"}>
                            <AddAssessment />
                        </RequireAuth>
                    }
                />
                <Route
                    path="/assessment-list"
                    element={
                        <RequireAuth page={"list"} moduleName={"Assessment"}>
                            <AssessmentList />
                        </RequireAuth>
                    }
                />
                <Route
                    path="/assessments/edit-assessment/:id"
                    element={
                        <RequireAuth page={"edit"} moduleName={"Assessment"}>
                            <EditAssessment />
                        </RequireAuth>
                    }
                />
                <Route
                    path="/assessment-list/assign-assessment/:id"
                    element={<AssignAssessmentToOperationMember />}
                />
                <Route
                    path="/assessment-list/fill-assessment/:id"
                    element={
                        // <RequireAuth moduleName={"Assessment"} page={"fill"}>
                        <FillAssessment />
                        // </RequireAuth>
                    }
                />
                <Route path="/preview" element={<PreviewDemo />} />
                <Route path="*" element={<FallBackUI />} />
                <Route path="/change-password" element={<ChangePassword />} />
                <Route
                    path="/questionnaire-version-history/:id"
                    element={<VersionHistory />}
                />
            </Route>
        </Routes>
    );
};

export default ProtectedPages;
