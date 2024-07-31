import { createSlice } from "@reduxjs/toolkit";
import { UserInfo } from "../../models/model";
import userThunk from "./userThunk";

const EDIT_ROLE = ["Admin", "Designer"]

interface User {
    userInfo: UserInfo | undefined,
    hasEditRight: boolean
}

const initialState = {
    userInfo: undefined,
    hasEditRight: false
} satisfies User as User

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
    },
    extraReducers: builder => {
        builder
            .addCase(
                userThunk.loadUserInfo.fulfilled,
                (state, action) => {
                    const userInfo = action.payload
                    state.userInfo = userInfo
                    state.hasEditRight = EDIT_ROLE.includes(userInfo.role)
                }
            )
            .addCase(
                userThunk.loadUserInfo.rejected,
                (state) => {
                    const userInfo: UserInfo = {
                        name: "unknown",
                        role: "unknown"
                    }
                    state.userInfo = userInfo
                }
            )
    },
})

export default userSlice.reducer