import "./App.css";
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
axios.defaults.withCredentials = true;
function App() {
    const [userPresent, setUserPresent] = useState(false);

    useEffect(() => {
        const controller = new AbortController();
        const fetchUser = async () => {
            try {
                const { data } = await axios.get(GET_USER, {
                    withCredentials: true,
                    signal: controller.signal,
                });
                console.log("data from app fetcuser method", data);
                setUserPresent(true);
            } catch (error) {
                setUserPresent(false);
                console.log("Error from app file useEffect", error);
            }
        };
        fetchUser();
        return () => {
            controller.abort();
        };
    }, []);
    return (
        <React.Fragment>
            <Routes>
                <Route
                    path="/login"
                    element={
                        userPresent ? <Navigate to={"/dashboard"} /> : <Login />
                    }
                />
                <Route
                    path="/forget-password"
                    element={
                        userPresent ? (
                            <Navigate to={"/dashboard"} />
                        ) : (
                            <ForgetPassword />
                        )
                    }
                />
                <Route path="auth/*" element={<AuthOutlet />} />
                <Route
                    path="auth/confirm/:id"
                    element={
                        userPresent ? (
                            <Navigate to={"/dashboard"} />
                        ) : (
                            <SetPassword />
                        )
                    }
                />
                <Route
                    path="auth/forgot/:id"
                    element={
                        userPresent ? (
                            <Navigate to={"/dashboard"} />
                        ) : (
                            <ResetPassword />
                        )
                    }
                />
                <Route path="/" element={<Layout />}>
                    <Route
                        path={"/*"}
                        element={
                            <UserLoggedIn>
                                <ProtectedPages />
                            </UserLoggedIn>
                        }
                    />
                </Route>
            </Routes>
        </React.Fragment>
    );
}

export default App;
