import React from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "../Pages/Layout";
import RequireAuth from "./RequireAuth";

const SubAdminList = React.lazy(() =>
  import("../Pages/subAdminManagement/SubAdminList")
);
const AddSubAdmin = React.lazy(() =>
  import("../Pages/subAdminManagement/AddSubAdmin")
);
const ViewSubAdmin = React.lazy(() =>
  import("../Pages/subAdminManagement/ViewSubAdmin")
);
const EditSubAdmin = React.lazy(() =>
  import("../Pages/subAdminManagement/EditSubAdmin")
);
const ReplaceSubAdmin = React.lazy(() =>
  import("../Pages/subAdminManagement/ReplaceSubAdmin")
);
const Dashboard = React.lazy(() => import("../Pages/Dashboard"));
const RolesList = React.lazy(() => import("../Pages/roleManagement/RolesList"));
const AddRole = React.lazy(() => import("../Pages/roleManagement/AddRole"));
const EditRole = React.lazy(() => import("../Pages/roleManagement/EditRole"));
const ViewRole = React.lazy(() => import("../Pages/roleManagement/ViewRole"));
const AddOperationMember = React.lazy(() =>
  import("../Pages/operationMember/AddOperationMember")
);
const OperationMemberList = React.lazy(() =>
  import("../Pages/operationMember/OperationMemberList")
);
const FallBackUI = React.lazy(() => import("../Pages/FallBackUI"));
const MemberList = React.lazy(() => import("../Pages/member/MemberList"));
const AddMember = React.lazy(() => import("../Pages/member/AddMember"));
const EditMember = React.lazy(() => import("../Pages/member/EditMember"));
const ViewMember = React.lazy(() => import("../Pages/member/ViewMember"));
const ViewOperationMembers = React.lazy(() =>
  import("../Pages/operationMember/ViewOperationMembers")
);
const EditOperationMember = React.lazy(() =>
  import("../Pages/operationMember/EditOperationMember")
);
const QuestionnairesList = React.lazy(() =>
  import("../Pages/questionnaires/QuestionnairesList")
);
const AddNewQuestionnaire = React.lazy(() =>
  import("../Pages/questionnaires/AddNewQuestionnaire")
);
const PreviewQuestionnaire = React.lazy(() =>
  import("../Pages/questionnaires/Preview/PreviewQuestionnaire")
);
const PreviewDemo = "../Pages/questionnaires/Preview/PreviewDemo";
const AddAssessment = React.lazy(() =>
  import("../Pages/AssessmentModule/AddAssessment")
);
const AssessmentList = React.lazy(() =>
  import("../Pages/AssessmentModule/AssessmentList")
);
const EditAssessment = React.lazy(() =>
  import("../Pages/AssessmentModule/EditAssessment")
);
const AssignAssessmentToOperationMember = React.lazy(() =>
  import("../Pages/AssessmentModule/AssignAssessmentToOperationMember")
);
const FillAssessment = React.lazy(() =>
  import("../Pages/AssessmentModule/FillAssessment")
);
const ReplaceOperationMember = React.lazy(() =>
  import("../Pages/operationMember/ReplaceOperationMember")
);
const ChangePassword = React.lazy(() => import("../Pages/ChangePassword"));
const VersionHistory = React.lazy(() =>
  import("../Pages/questionnaires/VersionHistory")
);
const Instructions = React.lazy(() =>
  import("../Pages/AssessmentModule/Instructions")
);
const ProtectedPages = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/home" element={<Dashboard />} />

        <Route
          path="/users/cgf-admin"
          element={
            <RequireAuth moduleName={""} page={""}>
              <SubAdminList />
            </RequireAuth>
          }
        />
        <Route
          path="/users/cgf-admin/add-cgf-admin"
          element={
            <RequireAuth moduleName={""} page={""}>
              <AddSubAdmin />
            </RequireAuth>
          }
        />
        <Route
          path="/users/cgf-admin/view-cgf-admin/:id"
          element={
            <RequireAuth moduleName={""} page={""}>
              <ViewSubAdmin />
            </RequireAuth>
          }
        />

        <Route
          path="/users/cgf-admin/edit-cgf-admin/:id"
          element={
            <RequireAuth>
              <EditSubAdmin />
            </RequireAuth>
          }
        />
        <Route
          path="/users/cgf-admin/replace-cgf-admin/:id"
          element={
            <RequireAuth page={""} moduleName={""}>
              <ReplaceSubAdmin />
            </RequireAuth>
          }
        />

        {/* Role Management Routes */}
        <Route
          path="/roles"
          element={
            <RequireAuth page={""} moduleName={""}>
              <RolesList />
            </RequireAuth>
          }
        />
        <Route
          path="/roles/add-role"
          element={
            <RequireAuth page={""} moduleName={""}>
              <AddRole />
            </RequireAuth>
          }
        />
        <Route
          path="/roles/view-role/:id"
          element={
            <RequireAuth page={""} moduleName={""}>
              {" "}
              <ViewRole />
            </RequireAuth>
          }
        />
        <Route
          path="roles/edit-role/:id"
          element={
            <RequireAuth page={""} moduleName={""}>
              <EditRole />
            </RequireAuth>
          }
        />

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
        <Route
          path={"/users/members/view-member/pending/:id"}
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
            <RequireAuth page={"list"} moduleName={"Operation Members"}>
              <OperationMemberList />
            </RequireAuth>
          }
        />
        <Route
          path="/users/operation-members/add-operation-member"
          element={
            <RequireAuth page={"add"} moduleName={"Operation Members"}>
              <AddOperationMember />
            </RequireAuth>
          }
        />
        <Route
          path="/users/operation-member/view-operation-member/:id"
          element={
            <RequireAuth page={"view"} moduleName={"Operation Members"}>
              <ViewOperationMembers />
            </RequireAuth>
          }
        />
        <Route
          path="/users/operation-member/edit-operation-member/:id"
          element={
            <RequireAuth page={"edit"} moduleName={"Operation Members"}>
              <EditOperationMember />
            </RequireAuth>
          }
        />
        <Route
          path="/users/operation-member/replace-operation-member/:id"
          element={
            <RequireAuth page={"delete"} moduleName={"Operation Members"}>
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
        />
        <Route
          path="/questionnaires/edit-questionnaire/:id"
          element={
            <RequireAuth page={"edit"} moduleName={"Questionnaire"}>
              <AddNewQuestionnaire />
            </RequireAuth>
          }
        />
        <Route
          path="/questionnaires/preview-questionnaire/:id"
          element={
            <RequireAuth page={"view"} moduleName={"Questionnaire"}>
              <PreviewQuestionnaire />
            </RequireAuth>
          }
        />
        <Route
          path="/questionnaires/preview-questionnaire-version/:id"
          element={<PreviewQuestionnaire />}
        />
        <Route
          path="/assessment-list/add-assessment"
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
          path="/assessment-list/instructions"
          element={
            <RequireAuth page={"list"} moduleName={"Assessment"}>
              <Instructions />
            </RequireAuth>
          }
        />
        <Route
          path="/assessment-list/edit-assessment/:id"
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
        <Route
          path="/assessment-list/view-assessment/:id"
          element={
            // <RequireAuth moduleName={"Assessment"} page={"fill"}>
            <FillAssessment />
            // </RequireAuth>
          }
        />
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
