import { Action, PayloadAction, createSlice } from "@reduxjs/toolkit"

enum LoadingState {
    IDLE = "idle",
    PENDING = "pending",
    FAILED = "failed"
}

const isRejectedAction = (action: Action) => {
    return action.type.endsWith('rejected')
}

const isPendingAction = (action: Action) => {
    return action.type.endsWith('pending')
}

const isFullfilledAction = (action: Action) => {
    return action.type.endsWith('fulfilled')
}

interface AppStatusState {
    loading: LoadingState,
    error: string | undefined,
}

const initialState = {
    loading: LoadingState.IDLE,
    error: undefined,
} satisfies AppStatusState as AppStatusState

const appStatusSlice = createSlice({
    name: "appStatus",
    initialState,
    reducers: {
    },
    extraReducers: builder => {
        builder
            .addMatcher(
                isRejectedAction,
                (state, action: PayloadAction<any>) => {
                    if(typeof action.payload === "undefined") return

                    state.loading = LoadingState.FAILED
                    state.error = action.payload

                    console.error(action.payload)
                }
            )
            .addMatcher(
                isPendingAction,
                (state) => {
                    if (state.loading === LoadingState.IDLE)
                        state.loading = LoadingState.PENDING
                }
            )
            .addMatcher(
                isFullfilledAction,
                (state) => {
                    state.loading = LoadingState.IDLE
                }
            )
    }
})

export { LoadingState }
export default appStatusSlice.reducer

