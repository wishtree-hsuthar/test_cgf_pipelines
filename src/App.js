import "./index.css";
import "./responsive.css";
import React, { useState, useEffect } from "react";

import Login from "./Pages/Login";
import ForgetPassword from "./Pages/ForgetPassword";
import ResetPassword from "./Pages/ResetPassword";
import SetPassword from "./Pages/SetPassword";
import { Route, Routes, Navigate } from "react-router-dom";
import UserLoggedIn from "./router/UserLoggedIn";
import ProtectedPages from "./router/ProtectedPages";
import { GET_USER } from "./api/Url";
import axios from "axios";
import Layout from "./Pages/Layout";
import { privateAxios } from "./api/axios";
import AuthOutlet from "./Pages/AuthOutlet";
import Footer from "./components/Footer";
import { useNavigate } from "react-router-dom";
import FallBackUI from "./Pages/FallBackUI";
// import AddQuestionnaires from "./Pages/questionnaires/AddQuestionnaires";
axios.defaults.withCredentials = true;
function App() {
    // const [userPresent, setUserPresent] = useState(false);
    // const navigate = useNavigate();

    return (
        <React.Fragment>
            <Routes>
                {/* <Route path="/questionnare" element={<AddQuestionnaires/>}/> */}
                <Route path="/login" element={<Login />} />
                <Route path="/forget-password" element={<ForgetPassword />} />
                {/* <Route path="auth/*" element={<AuthOutlet />} /> */}
                <Route path="auth/confirm/:id" element={<SetPassword />} />
                <Route path="auth/forgot/:id" element={<ResetPassword />} />
                {/* <Route path="/*" element={<Layout />}> */}
                <Route
                    path={"/*"}
                    element={
                        <UserLoggedIn>
                            <ProtectedPages />
                        </UserLoggedIn>
                    }
                />
                {/* </Route> */}
                <Route element={<FallBackUI />} />
            </Routes>
            <Footer />
        </React.Fragment>
    );
}

export default App;
