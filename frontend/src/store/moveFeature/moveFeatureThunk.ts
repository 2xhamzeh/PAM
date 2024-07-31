import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "..";
import { DirMetadata, DirectoryReturnType, ModelMetadata } from "../../models/model";
import { LoadingState } from "../appStatusSlice";
import { camelize } from "../camelizer";
import { TargetDirectory } from "./moveFeatureSlice";


const moveFeatureThunk = {
    loadCurrentDirectory: createAsyncThunk<
        TargetDirectory,
        {},
        {
            state: RootState
        }
    >(
        "moveFeature/loadCurrentDirectory",
        ({ }, { getState }) => {
            const {
                currentInode,
                path,
                containedModels,
                containedDirectories
            } = getState().dirModel

            return ({
                destination_inode: currentInode,
                path,
                containedModels,
                containedDirectories,
                isSuccessfullyMoved: false
            })
        }
    ),

    loadDirectoryByInode: createAsyncThunk<
        DirectoryReturnType,
        number,
        {
            state: RootState
        }
    >(
        "moveFeature/loadDirectoryByInode",
        async (targetInode, { getState, rejectWithValue }) => {
            const { loading } = getState().appStatus
            const { containedDirectories, destination_inode } = getState().moveFeature

            if (loading !== LoadingState.PENDING || destination_inode === targetInode) {
                return rejectWithValue(undefined)
            }

            try {
                const response = await fetch(`/api/v1/directory/${targetInode}`, { credentials: 'include' })

                if (response.ok) {
                    return camelize(await response.json()) as DirectoryReturnType
                } else throw Error
            } catch (error) {
                return rejectWithValue(`Failed to open directory "${containedDirectories[targetInode]}" for moving action`)
            }
        }
    ),

    moveModel: createAsyncThunk<
        ModelMetadata,
        number,
        {
            state: RootState
        }
    >(
        "moveFeature/moveModel",
        async (modelId, { getState, rejectWithValue }) => {
            const { loading } = getState().appStatus
            const { destination_inode } = getState().moveFeature
            const { currentInode, containedModels } = getState().dirModel

            if (loading !== LoadingState.PENDING || destination_inode === currentInode) {
                return rejectWithValue(undefined)
            }

            try {
                const response = await fetch(`/api/v1/models/${modelId}/move?destination_dir_inode=${destination_inode}`, {
                    method: "PUT",
                    credentials: 'include'
                })

                if (response.ok) {
                    return containedModels[modelId]
                } else throw Error
            } catch (error) {
                return rejectWithValue(`Failed to move model ${containedModels[modelId].name}`)
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
        "moveFeature/addDirectory",
        async (name: string, { getState, rejectWithValue }) => {
            const { loading } = getState().appStatus
            const { destination_inode } = getState().moveFeature
            if (loading !== LoadingState.PENDING) {
                return rejectWithValue(undefined)
            }

            try {
                const response = await fetch(`/api/v1/directory/?src_inode=${destination_inode}&name=${name}`, {
                    method: "POST",
                    credentials: 'include'
                })

                if (response.ok) {
                    const newDirectory: DirMetadata = {
                        inode: await response.json(),
                        name: name,
                        parentInode: destination_inode as number
                    }
                    return newDirectory
                } else throw Error
            } catch (error) {
                return rejectWithValue(`Failed to add new directory`)
            }
        }
    ),
}

export default moveFeatureThunk