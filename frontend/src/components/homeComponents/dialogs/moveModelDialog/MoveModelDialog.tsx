import '../globalDialog.scss'
import "./_moveModelDialog.scss"
import '../../../../static/extra-styles/button.scss'

import {Move} from "../../../../static/images/iconsModel/react-components/Move.tsx";
import Folder from "../../../../static/images/iconsFolder/folderThin.svg"
import { useAppDispatch, useAppSelector } from '../../../../store'
import moveFeatureThunk from '../../../../store/moveFeature/moveFeatureThunk'
import Path, { PathOwner } from '../../body/Path'
import Add from "../../../../static/images/buttonAdd/Vector.svg"
import { useEffect, useState } from 'react'

type Props = {
    closeDialog: () => void,
    handleMove: () => void
}

const MoveModelDialog = ({ closeDialog, handleMove }: Props) => {
    const [isAddingDir, setIsAddingDir] = useState(false)
    const [newDirName, setNewDirName] = useState("")

    const targetDir = useAppSelector(state => state.moveFeature)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (isAddingDir) {
            cancelCreateNew()
        }
    }, [targetDir])

    const handleGoInsideDir = (id: number) => () => {
        dispatch(moveFeatureThunk.loadDirectoryByInode(id))
    }

    const onClickAddButton = () => {
        setIsAddingDir(true)
    }

    const cancelCreateNew = () => {
        setIsAddingDir(false)
        setNewDirName("")
    }

    const handleCreateNew = () => {
        dispatch(moveFeatureThunk.addDirectory(newDirName))
    }

    return (
        <div className="dialog dialog-green dialog-move" onClick={e => e.stopPropagation()}>
            <div className="dialog__edit">
                <div className="dialog__icon-and-title">
                    <Move className='dialog__icon dropdown__button-icon-green' />
                    <h3 className="dialog__title">Modell verschieben?</h3>
                </div>

                <div className='move-dialog__target-dir'>
                    <div className='move-dialog__container'>
                        <Path path={targetDir.path} owner={PathOwner.MOVE_DIALOG} />
                        <div className='move-dialog__contained-dirs'>
                            {
                                Object.values(targetDir.containedDirectories).map(dir => (
                                    <div key={dir.inode}
                                        className='contained-dir'
                                        onClick={handleGoInsideDir(dir.inode)}>
                                        <img className="dialog__icon" src={Folder} alt='icon' />
                                        <div className='dir-name'>{dir.name}</div>
                                    </div>
                                ))
                            }
                            {
                                isAddingDir ?
                                    <div className='contained-dir contained-dir-new'>
                                        <img className="dialog__icon" src={Folder} alt='icon' />
                                        <input type="text" value={newDirName} onChange={e => setNewDirName(e.target.value)} />
                                        <div className='button-group'>
                                            <button onClick={handleCreateNew}>ja</button>
                                            <button onClick={cancelCreateNew}>nein</button>
                                        </div>
                                    </div>
                                    : <button className='add-btn' onClick={onClickAddButton}>
                                        <img  src={Add} alt="Add" />
                                    </button>
                            }
                        </div>
                    </div>


                    <div className="dialog__button-groups">
                        <button className="custom-button green-button" onClick={closeDialog}>ABBRECHEN</button>

                        <button className="custom-button green-button"
                            onClick={handleMove}
                        >
                            HIERHIN VERSCHIEBEN
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MoveModelDialog;