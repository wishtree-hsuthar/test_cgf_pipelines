import React from "react";
import ToasterTester from "./components/ToasterTester";
import TableTester from "./components/TableTester";
import DialogBoxTester from "./components/DialogBoxTester.js";
import DialogBox from "./components/DialogBox";

import Login from "./Pages/Login";
import ForgetPassword from "./Pages/ForgetPassword";
import ResetPassword from "./Pages/ResetPassword";
import SetPassword from "./Pages/SetPassword";
import Header from "./Pages/Header";
import { Dashboard } from "./Pages/Dashboard";
import { Route, Routes } from "react-router-dom";
import Layout from "./Pages/Layout";
import SubAdminList from "./Pages/SubAdminList";
import AddSubAdmin from "./Pages/AddSubAdmin";
import ViewSubAdmin from "./Pages/ViewSubAdmin";
import EditSubAdmin from "./Pages/EditSubAdmin";
import RolesList from "./Pages/roleManagement/RolesList.js"
import AddRole from "./Pages/roleManagement/AddRole.js"
import ViewRole from "./Pages/roleManagement/ViewRole";
import EditRole from "./Pages/roleManagement/EditRole.js"
import Footer from "./components/Footer";
function App() {
  const userO = localStorage.getItem("user");
  return (
    <React.Fragment>
      {/* Jay shree krishna */}
      {/* <ToasterTester /> */}
      {/* <TableTester/> */}
      {/* <DialogBoxTester/> */}

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Sub Admin Routes */}
          <Route path="/sub-admins" element={<SubAdminList />} />
          <Route path="/sub-admins/add-sub-admin" element={<AddSubAdmin />} />
          <Route path="/sub-admins/view-sub-admin" element={<ViewSubAdmin />} />
          <Route path="/sub-admins/edit-sub-admin" element={<EditSubAdmin />} />


          {/* Role Management Routes */}
          <Route path="/roles" element={<RolesList/>}/>
          <Route path="/roles/add-role" element={<AddRole/>}/>
          <Route path='/roles/view-role/:id' element={<ViewRole/>}/>
          <Route path='roles/edit-role/:id' element={<EditRole/>}/>

        </Route>
      </Routes>
      <Footer/>
    </React.Fragment>
  );
}

export default App;
