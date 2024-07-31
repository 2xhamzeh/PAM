import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ModelReturnType } from "../../models/model";
import bpmnThunk from "./bpmnThunk";

interface bpmnState {
    isOpen: boolean, 
    model: ModelReturnType | undefined, // type "undefined" is used for new model
    uploadedData: string | undefined
}

const initialState = {
    isOpen: false, 
    model: undefined,
    uploadedData: undefined
} satisfies bpmnState as bpmnState

const bpmnSlice = createSlice({
    name: "bpmn",
    initialState,
    reducers: {
        openBpmnWithNewModel(state) {
            state.isOpen = true
        },
        closeBpmn(state) {
            state.isOpen = false
            state.model = undefined
            state.uploadedData = undefined
        },
        uploadBpmn(state, action: PayloadAction<string>) {
            const data = action.payload

            state.isOpen = true
            state.uploadedData = data
        }
    },
    extraReducers: builder => {
        builder
            .addCase(
                bpmnThunk.loadModelById.fulfilled,
                (state, action) => {
                    const model: ModelReturnType = action.payload
                    state.isOpen = true
                    state.model = model
                }
            )
            .addCase(
                bpmnThunk.updateModel.fulfilled,
                (state, action) => {
                    const xmlData: string = action.payload
                    
                    if(typeof state.model !== "undefined") 
                        state.model.data = xmlData
                }
            )
    }
})

export const { closeBpmn, uploadBpmn, openBpmnWithNewModel } = bpmnSlice.actions

export default bpmnSlice.reducer