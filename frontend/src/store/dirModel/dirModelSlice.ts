import { PayloadAction, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { DirMetadata, DirectoryReturnType, ModelMetadata, Path } from "../../models/model";
import dirModelThunk from "./dirModelThunk";
import bpmnThunk from "../bpmn/bpmnThunk";
import { Status, Sorting, Filtering } from "../../models/enum";
import moveFeatureThunk from "../moveFeature/moveFeatureThunk";


export interface CurrentDir {
    /* 
        currentInode = -1 => favorite models
        currentInode = -2 => my models
    */
    currentInode: number | undefined, 

    path: Path[],
    containedModelIds: number[]
    containedModels: Record<number, ModelMetadata>,
    containedDirectories: Record<number, DirMetadata>,
    sorting: {
        type: Sorting,
        value: 1 | -1
    },
    filter: {
        status: Status[],
        favorite: boolean
    }
}

const initialState = {
    currentInode: undefined,
    path: [],
    containedModelIds: [],
    containedModels: {},
    containedDirectories: {},
    sorting: {
        type: Sorting.DATE,
        value: 1
    },
    filter: {
        status: [Status.IN_PROGRESS, Status.PUBLISHED, Status.UNPUBLISHED],
        favorite: false
    }
} satisfies CurrentDir as CurrentDir

const dirModelSlice = createSlice({
    name: "dirModel",
    initialState,
    reducers: {
        changeSorting(state, action: PayloadAction<typeof state.sorting>) {
            state.sorting = action.payload
        },
        changeFilter(state, action: PayloadAction<{
            type: Filtering,
            value: Status | undefined
        }>) {
            const { type, value } = action.payload

            switch (type) {
                case Filtering.STATUS: {
                    const currentStatus = state.filter.status
                    if (currentStatus.includes(value!)) {
                        if (currentStatus.length !== 1)
                            state.filter.status = currentStatus.filter(s => s !== value)
                    } else state.filter.status.push(value!)

                    break
                }
                case Filtering.FAVORITE: {
                    state.filter.favorite = !state.filter.favorite
                }
            }
        }
    },
    extraReducers: builder => {
        builder
            .addCase(
                dirModelThunk.loadDirectoryByInode.fulfilled,
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

                    state.currentInode = metadata.inode;

                    state.containedModelIds = containedModels.map(model => model.id)

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
                bpmnThunk.addModel.fulfilled,
                (state, action) => {
                    const model: ModelMetadata = action.payload
                    state.containedModelIds.unshift(model.id)
                    state.containedModels[model.id] = model
                }
            )
            .addCase(
                dirModelThunk.deleteDirectory.fulfilled,
                (state, action) => {
                    const inode: number = action.payload
                    delete state.containedDirectories[inode]
                }
            )
            .addCase(
                dirModelThunk.deleteModel.fulfilled,
                (state, action) => {
                    const id: number = action.payload
                    state.containedModelIds = state.containedModelIds.filter(modelId => modelId !== id)
                    delete state.containedModels[id]
                }
            )
            .addCase(
                moveFeatureThunk.moveModel.fulfilled,
                (state, action) => {
                    const model: ModelMetadata = action.payload
                    state.containedModelIds = state.containedModelIds.filter(modelId => modelId !== model.id)
                    delete state.containedModels[model.id]
                }
            )
            .addCase(
                dirModelThunk.changeDirAfterMovingModel.fulfilled,
                (_, action) => {
                    return action.payload
                }
            )
            .addMatcher(
                isAnyOf(
                    dirModelThunk.renameModel.fulfilled,
                    dirModelThunk.updateDescriptionModel.fulfilled,
                    dirModelThunk.grantAccessToModel.fulfilled,
                    dirModelThunk.revokeAccessToModel.fulfilled,
                    dirModelThunk.updateStatusModel.fulfilled,
                    dirModelThunk.changeModelFavorite.fulfilled
                ),
                (state, action) => {
                    const model: ModelMetadata = action.payload
                    state.containedModels[model.id] = model
                }
            )
            .addMatcher(
                isAnyOf(
                    dirModelThunk.addDirectory.fulfilled,
                    dirModelThunk.renameDirectory.fulfilled,
                ),
                (state, action) => {
                    const directory: DirMetadata = action.payload
                    state.containedDirectories[directory.inode] = directory
                }
            )
    }
})

export const { changeFilter, changeSorting } = dirModelSlice.actions

export default dirModelSlice.reducer