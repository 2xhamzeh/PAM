import './style/components.scss'

import { Path as PathType } from '../../../models/model'

import dirModelThunk from '../../../store/dirModel/dirModelThunk'
import { useAppDispatch } from '../../../store'
import moveFeatureThunk from '../../../store/moveFeature/moveFeatureThunk'
import React from 'react'

export enum PathOwner {
    HOME,
    MOVE_DIALOG
}

type props = {
    path: PathType[],
    owner: PathOwner
}

const Path = ({ path, owner }: props) => {
    const dispatch = useAppDispatch();

    const handleNavigate = (inode: number) => () => {
        switch(owner) {
            case PathOwner.HOME:
                dispatch(dirModelThunk.loadDirectoryByInode(inode))
                break
            case PathOwner.MOVE_DIALOG:
                dispatch(moveFeatureThunk.loadDirectoryByInode(inode))
                break
            default:
                throw new Error("Invalid owner of path")
        }
    }

    return (
        <div className="path-container path-container__extra">
            {path &&
                path.slice(0).reverse().map((dir, index) => (
                    <React.Fragment key={dir.inode}>
                        <button
                            className={`path-button ${index === path.length - 1 ? 'current' : 'parent'}`}
                            onClick={(dir.inode !== -1) && (index < path.length - 1) ? handleNavigate(dir.inode) : () => null}
                        >
                            {dir.name}
                        </button>
                        {index < path.length - 1 && (
                            <span className="path-separator"> &gt; </span>
                        )}
                    </React.Fragment>
                ))
            }
        </div>
    )
}

export default Path