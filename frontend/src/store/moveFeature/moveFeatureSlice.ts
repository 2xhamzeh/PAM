import { createSlice } from "@reduxjs/toolkit"
import { DirMetadata, DirectoryReturnType, ModelMetadata, Path } from "../../models/model"
import moveFeatureThunk from "./moveFeatureThunk"

export interface TargetDirectory {
    destination_inode: number | undefined,
    path: Path[],
    containedModels: Record<number, ModelMetadata>,
    containedDirectories: Record<number, DirMetadata>,
    isSuccessfullyMoved: boolean
}

const initialState = {
    destination_inode: undefined,
    path: [],
    containedModels: {},
    containedDirectories: {},
    isSuccessfullyMoved: false
} satisfies TargetDirectory as TargetDirectory

const moveFeatureSlice = createSlice({
    name: "moveFeature",
    initialState,
    reducers: {
        cancelMoving(state) {
            state.destination_inode = undefined
            state.path = []
            state.containedDirectories = []
            state.containedModels = []
            state.isSuccessfullyMoved = false
        }
    },
    extraReducers: builder => {
        builder
            .addCase(
                moveFeatureThunk.loadCurrentDirectory.fulfilled,
                (state, action) => state = action.payload
            )
            .addCase(
                moveFeatureThunk.loadDirectoryByInode.fulfilled,
                (state, action) => {
                    const { metadata, path, containedDirectories, containedModels }: DirectoryReturnType = action.payload

                    let truncatedPath = [...path]
                    if (path.length > 3) {
                        let firstTwo = path.slice(0, 2);
                        let pointX3: DirMetadata = {
                            inode: -1,
                            parentInode: -1,
                            name: "..."
                        }
                        let lastOne = path[path.length - 1];
                        truncatedPath = [...firstTwo, pointX3, lastOne]
                    }
                    state.path = truncatedPath.map((dir): Path => ({
                        inode: dir.inode,
                        name: dir.name
                    }))

                    state.destination_inode = metadata.inode;

                    state.containedModels = containedModels.reduce((byId: Record<number, ModelMetadata>, model) => {
                        byId[model.id] = model
                        return byId
                      }, {})
                    state.containedDirectories = containedDirectories.reduce((byId: Record<number, DirMetadata>, dir) => {
                        byId[dir.inode] = dir
                        return byId
                      }, {})
                }
            )
            .addCase(
                moveFeatureThunk.moveModel.fulfilled,
                (state, action) => {
                    const model: ModelMetadata = action.payload

                    state.containedModels[model.id] = model
                    state.isSuccessfullyMoved = true
                }
            )
            .addCase(
                moveFeatureThunk.addDirectory.fulfilled,
                (state, action) => {
                    const directory : DirMetadata = action.payload
                    state.containedDirectories[directory.inode] = directory
                }
            )
    }
})

export const { cancelMoving } = moveFeatureSlice.actions
export default moveFeatureSlice.reducer