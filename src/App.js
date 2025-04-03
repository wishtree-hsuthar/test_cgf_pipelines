import React, { Suspense } from "react";
import "./index.css";
import "./responsive.css";

import axios from "axios";
import { Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import UserLoggedIn from "./router/UserLoggedIn";
import Loader from "./utils/Loader";
import OneTimePassword from "./Pages/OneTimePassword";
const Login = React.lazy(() => import("./Pages/Login"));
const ProtectedPages = React.lazy(() => import("./router/ProtectedPages"));
const SetPassword = React.lazy(() => import("./Pages/SetPassword"));
const ResetPassword = React.lazy(() => import("./Pages/ResetPassword"));
const FallBackUI = React.lazy(() => import("./Pages/FallBackUI"));
const ForgetPassword = React.lazy(() => import("./Pages/ForgetPassword"));
axios.defaults.withCredentials = true;
function App() {
  return (
    <React.Fragment>
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* <Route path="/questionnare" element={<AddQuestionnaires/>}/> */}
          <Route path="/login" element={<Login />} />
          <Route path="/otp-verification" element={<OneTimePassword />} />
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
      </Suspense>
      <Footer />
    </React.Fragment>
  );
}

export default App;
