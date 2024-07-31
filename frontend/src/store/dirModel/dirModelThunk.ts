import { createAsyncThunk } from "@reduxjs/toolkit"
import { DirMetadata, DirectoryReturnType, ModelMetadata } from "../../models/model";
import { camelize } from "../camelizer";
import { LoadingState } from "../appStatusSlice";
import { RootState } from "..";
import { CurrentDir } from "./dirModelSlice";
import { Status } from "../../models/enum";


const FAVORITE_DIR: DirMetadata = {
    inode: -1,
    name: "Meine Favoriten",
    parentInode: 0
}

const MY_DIAGRAMS_DIR: DirMetadata = {
    inode: -2,
    name: "Meine Diagramme",
    parentInode: 0
}

const dirModelThunk = {
    loadDirectoryByInode: createAsyncThunk<
        DirectoryReturnType,
        number,
        {
            state: RootState
        }
    >(
        "dirModel/loadDrectoryByInode",
        async (inode, { getState, rejectWithValue }) => {
            const { loading } = getState().appStatus
            const { containedDirectories, sorting, filter } = getState().dirModel

            if (loading !== LoadingState.PENDING) {
                return rejectWithValue(undefined)
            }

            const sortValue = sorting.value === 1 ? sorting.type : sorting.type + "_reversed"
            let query = `?sort=${sortValue}`
            filter.status.forEach(s => query += `&status=${s}`)

            try {
                switch (inode) {
                    case -1: {
                        // Fetch favorite models
                        const response = await fetch(`/api/v1/users/favorites${query}`, { credentials: 'include' })

                        if (response.ok) {
                            const resModels = await response.json()

                            const camelizedModels = camelize(resModels) as ModelMetadata[]
                            return {
                                containedDirectories: [],
                                containedModels: camelizedModels,
                                metadata: FAVORITE_DIR,
                                path: [
                                    FAVORITE_DIR
                                ]
                            } as DirectoryReturnType
                        } else return rejectWithValue(`Failed to open favorite`)
                    }

                    case -2: {
                        // Fetch my models
                        const response = await fetch(`/api/v1/users/myModels${query}`, { credentials: 'include' })

                        if (response.ok) {
                            const resModels = await response.json()

                            const camelizedModels = camelize(resModels) as ModelMetadata[]
                            return {
                                containedDirectories: [],
                                containedModels: camelizedModels,
                                metadata: MY_DIAGRAMS_DIR,
                                path: [
                                    MY_DIAGRAMS_DIR
                                ]
                            } as DirectoryReturnType
                        } else return rejectWithValue(`Failed to open my models`)
                    }

                    default: {
                        // Fetch normal directory
                        const response = await fetch(`/api/v1/directory/${inode}${query}`, { credentials: 'include' })

                        if (response.ok) {
                            const json = await response.json()
                            return camelize(json) as DirectoryReturnType
                        } else return rejectWithValue(`Failed to open directory "${containedDirectories[inode].name}"`)
                    }
                }
            } catch (error) {
                return rejectWithValue(`Failed at thunk dirModel/loadDrectoryByInode`)
            }
        }
    ),

    addDirectory: createAsyncThunk<
        DirMetadata,
        string,
        {
            state: RootState
        }
    >(
        "dirModel/addDirectory",
        async (name: string, { getState, rejectWithValue }) => {
            const { loading } = getState().appStatus
            const { currentInode } = getState().dirModel
            if (loading !== LoadingState.PENDING) {
                return rejectWithValue(undefined)
            }

            try {
                const response = await fetch(`/api/v1/directory/?src_inode=${currentInode}&name=${name}`, {
                    method: "POST",
                    credentials: 'include'
                })

                if(response.ok) {
                    const newDirectory: DirMetadata = {
                        inode: await response.json(),
                        name: name,
                        parentInode: currentInode as number
                    }
                    return newDirectory
                } else throw Error 
            } catch (error) {
                return rejectWithValue(`Failed to add new directory`)
            }
        }
    ),

    renameDirectory: createAsyncThunk<
        DirMetadata,
        {
            inode: number,
            name: string
        },
        {
            state: RootState
        }
    >(
        "dirModel/renameDirectory",
        async ({ inode, name }, { getState, rejectWithValue }) => {
            const { loading } = getState().appStatus
            const { containedDirectories } = getState().dirModel
            if (loading !== LoadingState.PENDING) {
                return rejectWithValue(undefined)
            }

            try {
                const response = await fetch(`/api/v1/directory/?dir_inode=${inode}&new_name=${name}`, {
                    method: "PUT",
                    credentials: 'include'
                })
                if (response.ok)
                    return { ...containedDirectories[inode], name }
                throw new Error
            } catch (error) {
                return rejectWithValue(`Failed to rename directory "${containedDirectories[inode].name}"`)
            }
        }
    ),

    deleteDirectory: createAsyncThunk<
        number,
        number,
        {
            state: RootState
        }
    >(
        "dirModel/deleteDirectory",
        async (inode, { getState, rejectWithValue }) => {
            const { loading } = getState().appStatus
            const { containedDirectories } = getState().dirModel
            if (loading !== LoadingState.PENDING) {
                return rejectWithValue(undefined)
            }

            try {
                const response = await fetch(`/api/v1/directory/?dir_inode=${inode}`, {
                    method: "DELETE",
                    credentials: 'include'
                })
                if (response.ok) return inode
                throw new Error
            } catch (error) {
                return rejectWithValue(`Failed to detele directory "${containedDirectories[inode].name}"`)
            }
        }
    ),

    renameModel: createAsyncThunk<
        ModelMetadata,
        {
            id: number,
            name: string
        },
        {
            state: RootState
        }
    >(
        "dirModel/renameModel",
        async ({ id, name }, { getState, rejectWithValue }) => {
            const { loading } = getState().appStatus
            const { containedModels } = getState().dirModel
            if (loading !== LoadingState.PENDING) {
                return rejectWithValue(undefined)
            }

            try {
                const response = await fetch(`/api/v1/models/rename?id=${id}&new_name=${name}`, {
                    method: "PUT",
                    credentials: 'include'
                })
                if (response.ok)
                    return { ...containedModels[id], name }
                throw new Error
            } catch (error) {
                return rejectWithValue(`Failed to rename model "${containedModels[id].name}"`)
            }
        }
    ),

    updateDescriptionModel: createAsyncThunk<
        ModelMetadata,
        {
            id: number,
            description: string
        },
        {
            state: RootState
        }
    >(
        "dirModel/updateDescriptionModel",
        async ({ id, description }, { getState, rejectWithValue }) => {
            const { loading } = getState().appStatus
            const { containedModels } = getState().dirModel
            if (loading !== LoadingState.PENDING) {
                return rejectWithValue(undefined)
            }

            try {
                const response = await fetch(`/api/v1/models/updateDescription?id=${id}&description=${description}`, {
                    method: "PUT",
                    credentials: 'include'
                })
                if (response.ok)
                    return { ...containedModels[id], description }
                throw new Error
            } catch (error) {
                return rejectWithValue(`Failed to update description in model "${containedModels[id].name}"`)
            }
        }
    ),

    grantAccessToModel: createAsyncThunk<
        ModelMetadata,
        {
            modelId: number,
            readerMail: string
        },
        {
            state: RootState
        }
    >(
        "dirModel/grantAccessToModel",
        async ({ modelId, readerMail }, { getState, rejectWithValue }) => {
            const { loading } = getState().appStatus
            const { containedModels } = getState().dirModel
            if (loading !== LoadingState.PENDING) {
                return rejectWithValue(undefined)
            }

            const targetModel = containedModels[modelId]

            try {
                const response = await fetch(`/api/v1/grant/?reader_mail=${readerMail}&model_id=${modelId}`, {
                    method: "POST",
                    credentials: 'include'
                })
                if (response.ok)
                    return {
                        ...targetModel,
                        sharedReaders: [...targetModel.sharedReaders, readerMail]
                    }
                throw new Error
            } catch (error) {
                return rejectWithValue(`Failed to grant access to model "${targetModel.name}"`)
            }
        }
    ),

    revokeAccessToModel: createAsyncThunk<
        ModelMetadata,
        {
            modelId: number,
            readerMail: string
        },
        {
            state: RootState
        }
    >(
        "dirModel/revokeAccessToModel",
        async ({ modelId, readerMail }, { getState, rejectWithValue }) => {
            const { loading } = getState().appStatus
            const { containedModels } = getState().dirModel
            if (loading !== LoadingState.PENDING) {
                return rejectWithValue(undefined)
            }

            const targetModel = containedModels[modelId]

            try {
                const response = await fetch(`/api/v1/grant/?reader_email=${readerMail}&model_id=${modelId}`, {
                    method: "DELETE",
                    credentials: 'include'
                })
                if (response.ok)
                    return {
                        ...targetModel,
                        sharedReaders: targetModel.sharedReaders.filter(mail => mail !== readerMail)
                    }
                throw new Error
            } catch (error) {
                return rejectWithValue(`Failed to revoke access to model "${targetModel.name}"`)
            }
        }
    ),

    updateStatusModel: createAsyncThunk<
        ModelMetadata,
        {
            modelId: number,
            status: Status
        },
        {
            state: RootState
        }
    >(
        "dirModel/updateStatusModel",
        async ({ modelId, status }, { getState, rejectWithValue }) => {
            const { loading } = getState().appStatus
            const { containedModels } = getState().dirModel
            if (loading !== LoadingState.PENDING) {
                return rejectWithValue(undefined)
            }

            try {
                const response = await fetch(`/api/v1/models/${modelId}/status?status=${status}`, {
                    method: "PUT",
                    credentials: 'include'
                })
                if (response.ok)
                    return { ...containedModels[modelId], status }
                throw new Error
            } catch (error) {
                return rejectWithValue(`Failed to change status of model "${containedModels[modelId].name}"`)
            }
        }
    ),

    deleteModel: createAsyncThunk<
        number,
        number,
        {
            state: RootState
        }
    >(
        "dirModel/deleteModel",
        async (modelId, { getState, rejectWithValue }) => {
            const { loading } = getState().appStatus
            const { containedModels } = getState().dirModel
            if (loading !== LoadingState.PENDING) {
                return rejectWithValue(undefined)
            }

            try {
                const response = await fetch(`/api/v1/models/?id=${modelId}`, {
                    method: "DELETE",
                    credentials: 'include'
                })
                if (response.ok)
                    return modelId
                throw new Error
            } catch (error) {
                return rejectWithValue(`Failed to delete model "${containedModels[modelId].name}"`)
            }
        }
    ),

    changeModelFavorite: createAsyncThunk<
        ModelMetadata,
        number,
        {
            state: RootState
        }
    >(
        "dirModel/changeModelFavorite",
        async (modelId, { getState, rejectWithValue }) => {
            const { loading } = getState().appStatus
            const { containedModels } = getState().dirModel
            if (loading !== LoadingState.PENDING) {
                return rejectWithValue(undefined)
            }

            const targetModel = containedModels[modelId]

            try {
                const response = await fetch(`/api/v1/users/favorites/${modelId}`, {
                    method: "PUT",
                    credentials: 'include'
                })
                if (response.ok)
                    return {
                        ...targetModel,
                        favorite: !targetModel.favorite
                    }
                throw new Error
            } catch (error) {
                return rejectWithValue(`Failed to delete model "${targetModel.name}"`)
            }
        }
    ),

    changeDirAfterMovingModel: createAsyncThunk<
        CurrentDir,
        undefined,
        {
            state: RootState
        }
    >(
        "dirModel/changeDirAfterMovingModel",
        async (_, { getState }) => {
            const currentDirModel = getState().dirModel
            const { destination_inode, containedModels, containedDirectories, path } = getState().moveFeature

            return ({
                ...currentDirModel,
                currentInode: destination_inode,
                containedModelIds: Object.values(containedModels).map(model => model.id),
                path,
                containedModels,
                containedDirectories
            })
        }
    ),
}

export default dirModelThunk;
