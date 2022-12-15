import "./index.css";
import "./responsive.css";
import React, { useState, useEffect, Suspense } from "react";

import Login from "./Pages/Login";
import ForgetPassword from "./Pages/ForgetPassword";
import ResetPassword from "./Pages/ResetPassword";
import SetPassword from "./Pages/SetPassword";
import { Route, Routes } from "react-router-dom";
import UserLoggedIn from "./router/UserLoggedIn";
import ProtectedPages from "./router/ProtectedPages";
import axios from "axios";
import Footer from "./components/Footer";
import FallBackUI from "./Pages/FallBackUI";
import Loader from "./utils/Loader";
axios.defaults.withCredentials = true;
function App() {
    return (
        <React.Fragment>
            <Suspense fallback={<Loader />}>
                <Routes>
                    {/* <Route path="/questionnare" element={<AddQuestionnaires/>}/> */}
                    <Route path="/login" element={<Login />} />
                    <Route
                        path="/forget-password"
                        element={<ForgetPassword />}
                    />
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
            </Suspense>
            <Footer />
        </React.Fragment>
    );
}

export default App;
