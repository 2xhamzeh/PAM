/*react*/
import React, { RefObject, useState } from 'react';
import { createPortal } from "react-dom";

/*icons*/
import Add from "../../../static/images/buttonAdd/Vector.svg"
import Rectangle from '../../../static/images/buttonAdd/Rectangle.svg'
import Folder from '../../../static/images/buttonAdd/folder.svg'
import Document from '../../../static/images/buttonAdd/document.svg'

/*style*/
import './style/addButton.scss'

/*components*/
import AddDirDialog from "../dialogs/AddDirDialog.tsx";
import BlurBackground from "../dialogs/BlurBackground.tsx";
import AddModelDialog from '../dialogs/AddModelDialog.tsx';

/*redux*/
import dirModelThunk from '../../../store/dirModel/dirModelThunk.ts';
import { openBpmnWithNewModel, uploadBpmn } from '../../../store/bpmn/bpmnSlice.ts';
import { useAppDispatch } from '../../../store';

/*hooks*/
import useDropdownStatus from '../../../hooks/useDropdownStatus.ts';


export const AddButton: React.FC = () => {
    const [isOpen, toggleDropdown, addButtonRef]: [boolean, (() => void), RefObject<HTMLInputElement>] = useDropdownStatus();
    const [isDirDialogOpen, setIsDirDialogOpen] = useState(false);
    const [isModelDialogOpen, setIsModelDialogOpen] = useState(false);

    const dispatch = useAppDispatch();

    const handleFolderClick = () => {
        setIsDirDialogOpen(true);
    };

    const handleDocumentClick = () => {
        setIsModelDialogOpen(true);
    };

    const closeDirDialog = () => {
        setIsDirDialogOpen(false);
    };

    const closeModelDialog = () => {
        setIsModelDialogOpen(false);
    };

    const handleDirSubmit = (name: string) => {
        dispatch(dirModelThunk.addDirectory(name))
        setIsDirDialogOpen(false);
    };

    const handleOpenBPMN = async (file: File | undefined) => {
        if (file)
            dispatch(uploadBpmn(await file.text()))
        else dispatch(openBpmnWithNewModel())

        setIsModelDialogOpen(false)
    };

    // @ts-ignore
    return (
        <div className='button-container'>
            <div className="button">
                <div ref={addButtonRef} className="add-button" onClick={toggleDropdown}>
                    <img src={Add} alt="Add" />
                </div>
                <div className={`back ${isOpen ? 'expand' : 'collapse'}`}>
                    <img src={Rectangle} alt="Rectangle" />
                    <div className={`buttons ${isOpen ? 'visible' : 'hidden'}`}>
                        <img className="img-button"
                            src={Folder}
                            alt="Folder"
                            onClick={handleFolderClick} />
                        <img className="img-button"
                            src={Document}
                            alt="Document"
                            onClick={handleDocumentClick} />
                    </div>
                </div>
                {isDirDialogOpen && createPortal(
                    <BlurBackground handleOutsideClick={closeDirDialog}>
                        <AddDirDialog closeDialog={closeDirDialog} handleSubmit={handleDirSubmit} />
                    </BlurBackground>,
                    document.body
                )}
                {isModelDialogOpen && createPortal(
                    <BlurBackground handleOutsideClick={closeModelDialog}>
                        <AddModelDialog closeDialog={closeModelDialog} handleSubmit={handleOpenBPMN} />
                    </BlurBackground>,
                    document.body
                )}
            </div>
        </div>

    );
};
