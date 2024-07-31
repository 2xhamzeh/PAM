import { Status } from "./enum"

export interface DirMetadata {
    inode: number,
    parentInode: number,
    name: string
}

export interface ModelMetadata {
    id: number,
    directoryInode: number,
    name: string
    description: string,
    sharedReaders: string[],
    status: Status,
    creationDate: string,
    author: string,
    favorite: boolean
}

export interface DirectoryReturnType {
    metadata: DirMetadata,
    path: DirMetadata [],
    containedModels: ModelMetadata[],
    containedDirectories: DirMetadata[]
}

export interface ModelReturnType {
    id: number,
    name: string,
    data: string
}

export interface UserInfo {
    name: string,
    role: string
}

export interface Path {
    inode: number,
    name: string
}