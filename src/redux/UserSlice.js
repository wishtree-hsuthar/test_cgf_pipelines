import { createSlice } from "@reduxjs/toolkit";
export const userSlice = createSlice({
    name: "User",
    initialState: {},
    reducers: {
        setUser: (state, action) => {
            state.userObj = { ...action.payload };
        },
        resetUser: (state) => {
            return {};
        },
        setPrivileges: (state, action) => {
            state.privilege = { ...state, ...action.payload };
        },
        setOldQuestionnaire: (state, action) =>{
            state.questionnaire = [...action.payload]
        },
        setOldAssessment: (state, action) => {
            state.assessment = {...action.payload}
        }
    },
});
// this is for dispatch action
export const { setUser, resetUser, setPrivileges, setOldQuestionnaire, setOldAssessment } = userSlice.actions;
// this for config store
export default userSlice.reducer;
