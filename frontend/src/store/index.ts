import { configureStore } from "@reduxjs/toolkit";
import dirModelReducer from "./dirModel/dirModelSlice";
import bpmnReducer from "./bpmn/bpmnSlice"
import userReducer from "./user/userSlice"
import appStatusReducer from "./appStatusSlice";
import moveFeatureReducer from "./moveFeature/moveFeatureSlice";
import { useDispatch, useSelector } from "react-redux";


const store = configureStore({
    reducer: {
        appStatus: appStatusReducer,
        dirModel: dirModelReducer,
        moveFeature: moveFeatureReducer,
        bpmn: bpmnReducer,
        user: userReducer
    }
});

type RootState = ReturnType<typeof store.getState>;
type StoreDispatch = typeof store.dispatch;

const useAppDispatch = useDispatch.withTypes<StoreDispatch>()
const useAppSelector = useSelector.withTypes<RootState>()

export type {
    RootState
}

export {
    useAppDispatch,
    useAppSelector
}

export default store